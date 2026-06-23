import * as React from "react";
import { cn } from "@/lib/utils";

/** Textarea — éditeur de séquence. Police mono pour l'aspect "code". */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    spellCheck={false}
    className={cn(
      "w-full resize-none rounded-[var(--radius-base)] border border-line bg-ink-soft px-4 py-3 font-mono text-[13px] leading-relaxed text-fog placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
