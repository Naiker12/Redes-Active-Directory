"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Componente MagicCard (Magic UI)
 * Añade un efecto de iluminación (spotlight) que sigue al cursor.
 * 
 * @param {string} className - Clases adicionales de Tailwind.
 * @param {React.ReactNode} children - Contenido de la tarjeta.
 * @param {number} gradientSize - Tamaño del degradado del spotlight.
 * @param {string} gradientColor - Color del degradado.
 * @param {string} gradientOpacity - Opacidad del degradado.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#4f46e5", // Indigo-600 por defecto
  gradientOpacity = "0.15",
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [mouseX, mouseY, gradientSize]);

  useEffect(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [mouseX, gradientSize]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex size-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="relative z-10 w-full">{children}</div>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 80%
            )
          `,
          opacity: gradientOpacity,
        }}
      />
    </div>
  );
}
