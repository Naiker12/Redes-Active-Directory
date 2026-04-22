const ldap = require('ldapjs');

const PERMISSION_GROUP_ENV = {
  notas: 'AD_PERMISSION_GROUP_NOTAS',
  tareas: 'AD_PERMISSION_GROUP_TAREAS',
  reportes: 'AD_PERMISSION_GROUP_REPORTES'
};

function isAdConfigured() {
  return Boolean(
    process.env.AD_URL &&
    process.env.AD_BASE_DN &&
    process.env.AD_ADMIN_DN &&
    process.env.AD_ADMIN_PASSWORD
  );
}

function getPermissionGroupDn(permission) {
  const envKey = PERMISSION_GROUP_ENV[permission];
  return envKey ? (process.env[envKey] || '').trim() : '';
}

function getConfiguredPermissions() {
  return Object.keys(PERMISSION_GROUP_ENV).filter((permission) => getPermissionGroupDn(permission));
}

function normalizeDnList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).toLowerCase());
  return [String(value).toLowerCase()];
}

function escapeLdapFilter(value) {
  return String(value)
    .replace(/\\/g, '\\5c')
    .replace(/\*/g, '\\2a')
    .replace(/\(/g, '\\28')
    .replace(/\)/g, '\\29')
    .replace(/\0/g, '\\00');
}

function createBoundClient() {
  return new Promise((resolve, reject) => {
    if (!isAdConfigured()) {
      const error = new Error('AD no está completamente configurado.');
      error.code = 'AD_NOT_CONFIGURED';
      return reject(error);
    }

    const client = ldap.createClient({
      url: process.env.AD_URL,
      tlsOptions: { rejectUnauthorized: false }
    });

    const cleanupAndReject = (error) => {
      try {
        client.unbind(() => reject(error));
      } catch (unbindError) {
        reject(error);
      }
    };

    client.on('error', () => {});

    client.bind(process.env.AD_ADMIN_DN, process.env.AD_ADMIN_PASSWORD, (error) => {
      if (error) {
        return cleanupAndReject(error);
      }

      resolve(client);
    });
  });
}

function searchSingleEntry(client, baseDn, options) {
  return new Promise((resolve, reject) => {
    let settled = false;

    client.search(baseDn, options, (error, res) => {
      if (error) {
        return reject(error);
      }

      res.on('searchEntry', (entry) => {
        if (settled) return;
        settled = true;
        const object = entry.object || null;
        if (object && !object.dn && entry.objectName) {
          object.dn = entry.objectName.toString();
        }
        resolve(object);
      });

      res.on('error', (searchError) => {
        if (settled) return;
        settled = true;
        reject(searchError);
      });

      res.on('end', () => {
        if (settled) return;
        settled = true;
        resolve(null);
      });
    });
  });
}

function extractEntryDn(entry) {
  if (!entry) return '';
  if (entry.dn) return String(entry.dn);
  if (entry.distinguishedName) return String(entry.distinguishedName);
  if (entry.objectName) return String(entry.objectName);
  return '';
}

function getPermissionsFromMemberOf(memberOf) {
  const configuredPermissions = getConfiguredPermissions();
  if (!configuredPermissions.length) {
    return null;
  }

  const memberOfList = normalizeDnList(memberOf);
  if (!memberOfList.length) return [];

  return configuredPermissions.filter((permission) => {
    const groupDn = getPermissionGroupDn(permission);
    return memberOfList.includes(groupDn.toLowerCase());
  });
}

async function getAdPermissionsForUser(username) {
  if (!isAdConfigured()) {
    return null;
  }

  const configuredPermissions = getConfiguredPermissions();
  if (!configuredPermissions.length) {
    return null;
  }

  const client = await createBoundClient();

  try {
    const user = await searchSingleEntry(client, process.env.AD_BASE_DN, {
      scope: 'sub',
      filter: `(sAMAccountName=${escapeLdapFilter(username)})`,
      attributes: ['sAMAccountName', 'memberOf', 'distinguishedName']
    });

    if (!user) {
      return null;
    }

    return getPermissionsFromMemberOf(user.memberOf);
  } finally {
    try {
      client.unbind(() => {});
    } catch (error) {
      // Ignore unbind errors during cleanup.
    }
  }
}

async function syncAdPermission({ username, permission, action }) {
  if (!isAdConfigured()) {
    return {
      synced: false,
      skipped: true,
      message: 'AD no está configurado. La acción se guardó solo en la BD local.'
    };
  }

  const groupDn = getPermissionGroupDn(permission);
  if (!groupDn) {
    return {
      synced: false,
      skipped: true,
      message: `No existe un grupo AD configurado para el permiso "${permission}".`
    };
  }

  const client = await createBoundClient();

  try {
    const user = await searchSingleEntry(client, process.env.AD_BASE_DN, {
      scope: 'sub',
      filter: `(sAMAccountName=${escapeLdapFilter(username)})`,
      attributes: ['sAMAccountName', 'memberOf', 'distinguishedName']
    });

    if (!user) {
      const error = new Error(`No se encontró el usuario ${username} en AD.`);
      error.statusCode = 404;
      throw error;
    }

    const userDn = extractEntryDn(user);
    if (!userDn) {
      const error = new Error(`No fue posible resolver el DN del usuario ${username}.`);
      error.statusCode = 500;
      throw error;
    }

    const memberOfList = normalizeDnList(user.memberOf);
    const groupDnLower = groupDn.toLowerCase();

    if (action === 'add' && memberOfList.includes(groupDnLower)) {
      return {
        synced: true,
        skipped: false,
        message: `El usuario ${username} ya tenía este permiso en AD.`
      };
    }

    if (action === 'delete' && !memberOfList.includes(groupDnLower)) {
      return {
        synced: true,
        skipped: false,
        message: `El usuario ${username} no tenía este permiso en AD.`
      };
    }

    const change = new ldap.Change({
      operation: action,
      modification: {
        member: userDn
      }
    });

    await new Promise((resolve, reject) => {
      client.modify(groupDn, change, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });

    return {
      synced: true,
      skipped: false,
      message: `Permiso sincronizado en AD para ${username}.`
    };
  } finally {
    try {
      client.unbind(() => {});
    } catch (error) {
      // Ignore unbind errors during cleanup.
    }
  }
}

module.exports = {
  getAdPermissionsForUser,
  getConfiguredPermissions,
  getPermissionGroupDn,
  getPermissionsFromMemberOf,
  isAdConfigured,
  syncAdPermission
};
