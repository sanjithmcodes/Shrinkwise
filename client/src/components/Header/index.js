import React, {useState, useEffect} from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi'

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-bs-theme') || 'light')
  const location = useLocation()
  const navigate = useNavigate()

  //re-check the session on every page change so the header updates after login/logout
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/user')
        const response = await res.json()
        setLoggedIn(Boolean(response.user))
      } catch (err) {
        console.error(err)
        setLoggedIn(false)
      }
    }
    fetchUser()
  }, [location.pathname])

  //the inline script in public/index.html applies the saved theme before first paint
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-bs-theme', next)
    try {
      localStorage.setItem('sw-theme', next)
    } catch (err) {
      console.error(err)
    }
    setTheme(next)
  }

  async function handleLogout(){
    await fetch('/logout')
      .then(res => {
        setLoggedIn(false)
        navigate('/login')
      })
      .catch(err => console.error(err))
  }

  return (
    <header className="sw-header">
        <div className="container sw-header-inner">
            <Link to="/" className="sw-brand">
                <span className="sw-brand-mark" aria-hidden="true"></span>
                Shrinkwise
            </Link>
            <nav className="sw-nav" aria-label="Main">
                <NavLink to="/feed">Overview</NavLink>
                <NavLink to="/logloss">Log a loss</NavLink>
                <button
                    type="button"
                    className="sw-nav-theme"
                    onClick={toggleTheme}
                    aria-label="Dark mode"
                    aria-pressed={theme === 'dark'}
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <FiSun size="18" aria-hidden="true" /> : <FiMoon size="18" aria-hidden="true" />}
                </button>
                {loggedIn && (
                    <button type="button" className="sw-nav-logout" onClick={handleLogout} aria-label="Log out">
                        <FiLogOut size="18" aria-hidden="true" />
                        <span className="sw-nav-logout-text">Log out</span>
                    </button>
                )}
            </nav>
        </div>
    </header>
  )
}

export default Header