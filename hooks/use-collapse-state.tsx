"use client"

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseCollapseStateOptions {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  preventRapidToggle?: boolean
  debounceMs?: number
}

export function useCollapseState({
  defaultOpen = false,
  onOpenChange,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  preventRapidToggle = true,
  debounceMs = 150
}: UseCollapseStateOptions = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isAnimating, setIsAnimating] = useState(false)
  const lastToggleTime = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const triggerRef = useRef<HTMLElement>()
  const contentRef = useRef<HTMLElement>()

  // Debounced state change to prevent rapid toggling
  const handleOpenChange = useCallback((open: boolean, force: boolean = false) => {
    const now = Date.now()
    
    if (preventRapidToggle && !force && now - lastToggleTime.current < debounceMs) {
      return
    }
    
    lastToggleTime.current = now
    
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setIsAnimating(true)
    setIsOpen(open)
    onOpenChange?.(open)
    
    // Reset animation state after animation completes
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 200)
  }, [onOpenChange, preventRapidToggle, debounceMs])

  // Toggle function with safety checks
  const toggle = useCallback((force: boolean = false) => {
    if (isAnimating && !force) return
    handleOpenChange(!isOpen, force)
  }, [isOpen, isAnimating, handleOpenChange])

  // Force close function (for escape key, outside clicks)
  const forceClose = useCallback(() => {
    handleOpenChange(false, true)
  }, [handleOpenChange])

  // Force open function
  const forceOpen = useCallback(() => {
    handleOpenChange(true, true)
  }, [handleOpenChange])

  // Outside click handler
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Check if click is outside both trigger and content
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(target) &&
        !contentRef.current.contains(target)
      ) {
        forceClose()
      }
    }

    // Use capture to handle events before they bubble
    document.addEventListener('mousedown', handleOutsideClick, true)
    document.addEventListener('touchstart', handleOutsideClick, true)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true)
      document.removeEventListener('touchstart', handleOutsideClick, true)
    }
  }, [isOpen, closeOnOutsideClick, forceClose])

  // Escape key handler
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        forceClose()
      }
    }

    document.addEventListener('keydown', handleEscape, true)

    return () => {
      document.removeEventListener('keydown', handleEscape, true)
    }
  }, [isOpen, closeOnEscape, forceClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Portal cleanup effect
  useEffect(() => {
    return () => {
      // Clean up any orphaned portals when component unmounts
      const portals = document.querySelectorAll('[data-radix-portal]')
      portals.forEach(portal => {
        if (portal.children.length === 0) {
          portal.remove()
        }
      })
    }
  }, [])

  return {
    isOpen,
    isAnimating,
    toggle,
    forceClose,
    forceOpen,
    setOpen: handleOpenChange,
    triggerRef,
    contentRef,
    // Helper props for common use cases
    triggerProps: {
      ref: triggerRef,
      'aria-expanded': isOpen,
      'data-state': isOpen ? 'open' : 'closed',
      onClick: toggle
    },
    contentProps: {
      ref: contentRef,
      'data-state': isOpen ? 'open' : 'closed',
      'aria-hidden': !isOpen
    }
  }
}

// Hook specifically for dropdown/select components
export function useDropdownState(options: UseCollapseStateOptions = {}) {
  const collapseState = useCollapseState({
    closeOnOutsideClick: true,
    closeOnEscape: true,
    preventRapidToggle: true,
    debounceMs: 150,
    ...options
  })

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        collapseState.toggle()
        break
      case 'Escape':
        event.preventDefault()
        collapseState.forceClose()
        break
      case 'ArrowDown':
      case 'ArrowUp':
        if (!collapseState.isOpen) {
          event.preventDefault()
          collapseState.forceOpen()
        }
        break
    }
  }, [collapseState])

  return {
    ...collapseState,
    handleKeyDown,
    // Enhanced trigger props for dropdowns
    triggerProps: {
      ...collapseState.triggerProps,
      role: 'combobox',
      'aria-haspopup': 'listbox',
      onKeyDown: handleKeyDown
    }
  }
}

// Hook for mobile-optimized collapse behavior
export function useMobileCollapseState(options: UseCollapseStateOptions = {}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return useCollapseState({
    // More lenient settings for mobile
    debounceMs: isMobile ? 250 : 150,
    preventRapidToggle: isMobile,
    ...options
  })
}