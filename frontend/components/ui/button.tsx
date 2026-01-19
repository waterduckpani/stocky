import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-active hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-hard-hover",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-white border-2 border-primary shadow-hard hover:bg-accent/90",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-primary shadow-hard hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-background shadow-hard-sm hover:bg-tertiary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-primary shadow-hard hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground border-2 border-transparent hover:border-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
