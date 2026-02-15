import { forwardRef } from "react";

const Badge = forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "text-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
  };
  return (
    <div ref={ref} className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />
  );
});
Badge.displayName = "Badge";

export { Badge };
