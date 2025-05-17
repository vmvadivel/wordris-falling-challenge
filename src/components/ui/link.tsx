
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const linkVariants = cva("hover:underline underline-offset-4", {
  variants: {
    variant: {
      default: "text-primary hover:text-primary/90",
      secondary: "text-secondary-foreground hover:text-secondary-foreground/80",
      muted: "text-muted-foreground hover:text-muted-foreground/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, ...props }, ref) => (
    <a
      className={cn(linkVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
)
Link.displayName = "Link"

export { Link, linkVariants }
