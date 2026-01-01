"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className,
  href,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "clip-hud relative overflow-hidden font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 group";

  const variantStyles = {
    primary:
      "bg-accent-blue hover:bg-accent-blue-hover text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]",
    secondary: "bg-white text-black hover:bg-neutral-200",
    ghost:
      "bg-transparent border border-white/10 hover:border-white/30 text-white hover:bg-white/5",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-[0.625rem]",
    md: "px-8 py-4 text-xs",
    lg: "px-10 py-5 text-xs",
  };

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const content = (
    <>
      {variant === "primary" && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
      )}
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {icon && <span className="flex-shrink-0">{icon}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {content}
    </button>
  );
};
