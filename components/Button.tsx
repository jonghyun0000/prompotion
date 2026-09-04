"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-ink text-white border border-ink hover:bg-black active:bg-black disabled:bg-subtle disabled:border-subtle disabled:cursor-not-allowed",
  secondary:
    "bg-surface text-ink border border-line hover:border-ink active:bg-canvas disabled:text-subtle disabled:border-line disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-ink active:text-ink disabled:text-subtle disabled:cursor-not-allowed",
};

const sizeClass: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-13 px-7 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150",
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(" ")}
    />
  );
}
