import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const variants = cva("button", {
  variants: {
    variant: {
      default: "button-primary",
      secondary: "button-secondary",
      ghost: "button-ghost",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Button({
  variant,
  className,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof variants>) {
  return <button className={cn(variants({ variant }), className)} {...props} />;
}
export function ButtonLink({
  variant,
  className,
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof variants>) {
  return <Link className={cn(variants({ variant }), className)} {...props} />;
}
