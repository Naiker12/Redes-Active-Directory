import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
  theme: "light",
  setTheme: () => null,
})

/**
 * Proveedor de Tema Simplificado (Light Mode Only)
 * Fuerza el modo claro en todo el documento para cumplir con la estandarización corporativa.
 */
export function ThemeProvider({
  children,
  ...props
}) {
  const [theme] = useState("light")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
  }, [])

  const value = {
    theme: "light",
    setTheme: () => {
      console.warn("ThemeProvider: El cambio de tema está deshabilitado por estandarización corporativa (Light Mode Only).")
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
