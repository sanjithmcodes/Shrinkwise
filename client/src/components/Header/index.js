import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sw-header">
        <div className="container sw-header-inner">
            <Link to="/" className="sw-brand">
                <span className="sw-brand-mark" aria-hidden="true"></span>
                Shrinkwise
            </Link>
            <nav className="sw-nav" aria-label="Main">
                <NavLink to="/feed">Overview</NavLink>
                <NavLink to="/profile">Log a loss</NavLink>
            </nav>
        </div>
    </header>
  )
}

export default Header