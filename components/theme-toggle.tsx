// @/components/theme-toggle.tsx
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"

type Props = {
  showLabel?: boolean
  targetTheme?: "light" | "dark" | "toggle" // baru
}

export default function ThemeToggle({ showLabel = true, targetTheme = "toggle" }: Props) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const applyTransition = () => {
    try {
      const el = document.documentElement
      el.classList.add("theme-transition")
      window.setTimeout(() => el.classList.remove("theme-transition"), 350)
    } catch {}
  }

  const handleSetTheme = (nextTheme: "light" | "dark") => {
    applyTransition()
    try {
      localStorage.setItem("theme", nextTheme)
      document.cookie = `theme=${nextTheme}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
    setTheme(nextTheme)
  }

  if (!mounted) {
    return (
      <SidebarMenuButton aria-label="Toggle theme" disabled>
        <Sun className="size-4" />
      </SidebarMenuButton>
    )
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme

  let label: string
  let icon: React.ReactNode
  let clickHandler: () => void
  let isActive = false

  if (targetTheme === "toggle") {
    const isDark = resolvedTheme === "dark"
    label = isDark ? "Dark" : "Light"
    icon = isDark ? <Moon className="size-4" /> : <Sun className="size-4" />
    clickHandler = () => handleSetTheme(isDark ? "light" : "dark")
    isActive = true
  } else {
    label = targetTheme === "dark" ? "Dark Mode" : "Light Mode"
    icon = targetTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />
    clickHandler = () => handleSetTheme(targetTheme)
    isActive = resolvedTheme === targetTheme
  }

  return (
    <SidebarMenuButton
      aria-label={label}
      onClick={clickHandler}
      data-active={isActive || undefined}
    >
      {icon}
      {showLabel && <span>{label}</span>}
    </SidebarMenuButton>
  )
}