import { useEffect, useState } from 'react'
import './ThemeToggle.css'

// The key we use to remember the user's chosen theme across visits.
const THEME_STORAGE_KEY = 'quizding-theme'

// Figures out which theme to start with: whatever the user explicitly
// picked last time (saved in localStorage), or -- if they've never chosen
// one -- whatever their operating system is currently set to.
function getInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return systemPrefersDark ? 'dark' : 'light'
}

// A self-contained light/dark toggle button, fixed to the top-right corner
// of the app. It manages its own theme state rather than receiving it as a
// prop, since no other component in the app actually needs to know or
// react to the current theme as data -- they only care about the CSS
// custom properties, which this component updates directly on <html>.
function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  // Whenever the theme changes, reflect it on the root <html> element (so
  // our CSS's `:root[data-theme="dark"]` rules apply) and remember the
  // choice for next time.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function handleToggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  // The button's label describes the mode it will switch TO, not the mode
  // it's currently in -- that reads more naturally as an action ("Switch to
  // dark mode") for screen reader users than announcing current state.
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const iconId = theme === 'dark' ? 'sun-icon' : 'moon-icon'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      <svg className="icon" aria-hidden="true">
        <use href={`/icons.svg#${iconId}`} />
      </svg>
    </button>
  )
}

export default ThemeToggle
