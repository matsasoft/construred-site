import type { ReactNode, MouseEventHandler } from "react";

type Variant = "primary" | "primary-flat" | "secondary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
}

const staticStyles = `
    inline-flex items-center justify-center
    font-display font-normal tracking-wider uppercase
    transition-all duration-300 ease-out
    border-2 rounded-md
    relative overflow-hidden
`;

const interactiveStyles = `
    cursor-pointer
    transform hover:-translate-y-0.5 active:translate-y-0
`;

const disabledStyles = `
    bg-neutral-300 border-neutral-300 text-neutral-500 cursor-not-allowed pointer-events-none
`;

const variants: Record<Variant, string> = {
  primary: `
        bg-primary text-secondary-dark border-primary
        hover:bg-primary-dark hover:border-primary-dark
        shadow-industrial-sm hover:shadow-industrial
    `,
  "primary-flat": `
        bg-primary text-secondary-dark border-primary
        hover:bg-primary-dark hover:border-primary-dark
    `,
  secondary: `
        bg-secondary text-white border-secondary
        hover:bg-secondary-dark hover:border-secondary-dark
        shadow-[2px_2px_0_0_var(--color-primary)] hover:shadow-[4px_4px_0_0_var(--color-primary)]
    `,
  accent: `
        bg-accent text-white border-accent
        hover:bg-accent-dark hover:border-accent-dark
        shadow-[2px_2px_0_0_var(--color-secondary)] hover:shadow-[4px_4px_0_0_var(--color-secondary)]
    `,
  outline: `
        bg-transparent text-secondary border-secondary
        hover:bg-secondary hover:text-white
    `,
  ghost: `
        bg-transparent text-white border-white
        hover:bg-white hover:text-secondary
    `,
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  type = "button",
  target,
  rel,
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  const classes = [
    staticStyles,
    disabled
      ? disabledStyles
      : [interactiveStyles, variants[variant]].join(" "),
    sizes[size],
    className,
  ].join(" ");

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
