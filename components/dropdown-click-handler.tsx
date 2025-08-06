"use client"

import { useEffect, useRef } from 'react'

interface DropdownClickHandlerProps {
  isOpen: boolean
  onClose: () => void
  triggerElement?: HTMLElement | null
  contentElement?: HTMLElement | null
}

export function DropdownClickHandler({ 
  isOpen, 
  onClose, 
  triggerElement, 
  contentElement 
}: DropdownClickHandlerProps) {
  const handlerRef = useRef<((event: Event) => void) | null>(null)

  useEffect(() => {
    if (!isOpen) {
      if (handlerRef.current) {
        document.removeEventListener('click', handlerRef.current, true)
        document.removeEventListener('touchend', handlerRef.current, true)
        handlerRef.current = null
      }
      return
    }

    // Create a robust click handler
    const handleOutsideClick = (event: Event) => {
      const target = event.target as Node

      // Check if the click is on the trigger or content
      if (triggerElement?.contains(target) || contentElement?.contains(target)) {
        return
      }

      // Check if click is on any dropdown-related element
      const dropdownElements = document.querySelectorAll(
        '[role="listbox"], [role="option"], [data-radix-portal], [data-radix-popper-content-wrapper]'
      )
      
      for (const element of dropdownElements) {
        if (element.contains(target)) {
          return
        }
      }

      // Safe to close
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }

    handlerRef.current = handleOutsideClick

    // Use capture phase and multiple event types
    document.addEventListener('click', handleOutsideClick, true)
    document.addEventListener('touchend', handleOutsideClick, true)

    return () => {
      if (handlerRef.current) {
        document.removeEventListener('click', handlerRef.current, true)
        document.removeEventListener('touchend', handlerRef.current, true)
        handlerRef.current = null
      }
    }
  }, [isOpen, onClose, triggerElement, contentElement])

  return null
}

export function useDropdownClickHandler(isOpen: boolean, onClose: () => void) {
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)

  return {
    triggerRef,
    contentRef,
    ClickHandler: () => (
      <DropdownClickHandler
        isOpen={isOpen}
        onClose={onClose}
        triggerElement={triggerRef.current}
        contentElement={contentRef.current}
      />
    )
  }
}