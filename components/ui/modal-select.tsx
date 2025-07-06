"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ModalSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  triggerClassName?: string
  contentClassName?: string
  title?: string
}

interface ModalSelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onSelect?: (value: string) => void
}

interface ModalSelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
  selectedLabel?: string
  setSelectedLabel?: (label: string) => void
  onClose?: () => void
}

const ModalSelectContext = React.createContext<ModalSelectContextValue>({})

export function ModalSelect({
  value,
  onValueChange,
  placeholder = "Select an option",
  children,
  className,
  disabled = false,
  triggerClassName,
  contentClassName,
  title = "Select Option",
}: ModalSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState<string>("")
  const isMobile = useIsMobile()

  const handleClose = () => {
    setOpen(false)
  }

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue)
    setOpen(false)
  }

  const contextValue: ModalSelectContextValue = {
    value,
    onValueChange: handleValueChange,
    selectedLabel,
    setSelectedLabel,
    onClose: handleClose,
  }

  return (
    <ModalSelectContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal text-left h-auto min-h-[48px] px-3 py-2",
            !value && "text-muted-foreground",
            triggerClassName
          )}
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={cn(
              // Base styles
              "gap-0 p-0 max-h-[90vh] overflow-hidden",
              // Mobile: full screen
              isMobile ? [
                "fixed inset-0 max-w-none w-full h-full max-h-full",
                "translate-x-0 translate-y-0 top-0 left-0",
                "rounded-none border-0",
                "data-[state=open]:slide-in-from-bottom-full",
                "data-[state=closed]:slide-out-to-bottom-full",
                "data-[state=open]:slide-in-from-left-0",
                "data-[state=closed]:slide-out-to-left-0",
                "data-[state=open]:slide-in-from-top-0",
                "data-[state=closed]:slide-out-to-top-0"
              ] : [
                // Desktop: centered modal
                "max-w-md w-full max-h-[80vh]",
                "sm:rounded-lg"
              ],
              contentClassName
            )}
          >
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-2">
                {children}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </ModalSelectContext.Provider>
  )
}

export function ModalSelectItem({
  value,
  children,
  className,
  disabled = false,
  onSelect,
}: ModalSelectItemProps) {
  const context = React.useContext(ModalSelectContext)
  const isSelected = context.value === value
  const [label, setLabel] = React.useState<string>("")
  const ref = React.useRef<HTMLDivElement>(null)

  // Extract text content for the label
  React.useEffect(() => {
    if (ref.current) {
      const textContent = ref.current.textContent || ""
      setLabel(textContent)
      
      // Update the selected label in context if this item is selected
      if (isSelected && context.setSelectedLabel) {
        context.setSelectedLabel(textContent)
      }
    }
  }, [isSelected, context.setSelectedLabel])

  const handleSelect = () => {
    if (disabled) return
    
    context.onValueChange?.(value)
    onSelect?.(value)
    
    // Update the selected label
    if (context.setSelectedLabel) {
      context.setSelectedLabel(label)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-start rounded-md p-3 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "transition-colors duration-150",
        "min-h-[48px] touch-manipulation",
        disabled && "pointer-events-none opacity-50",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={handleSelect}
      role="option"
      aria-selected={isSelected}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleSelect()
        }
      }}
    >
      <div className="flex items-center w-full">
        {isSelected && (
          <Check className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ModalSelectValue({ 
  placeholder = "Select an option",
  className,
}: { 
  placeholder?: string
  className?: string
}) {
  const context = React.useContext(ModalSelectContext)
  
  return (
    <span className={cn("truncate", className)}>
      {context.selectedLabel || placeholder}
    </span>
  )
}

// Export the compound component
ModalSelect.Item = ModalSelectItem
ModalSelect.Value = ModalSelectValue