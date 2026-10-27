import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <main className="container sw-hero">
            <div>
                <h1>See what your shop is losing.</h1>
                <p>Log waste, till discrepancies and missing stock as they happen, then see where the money goes each week.</p>
                <div className="sw-hero-actions">
                    <Link to="/signup" className="btn btn-primary btn-lg">Create an account</Link>
                    <Link to="/login" className="btn btn-outline-primary btn-lg">Log in</Link>
                </div>
            </div>

            <div className="sw-hero-tags" aria-hidden="true">
                <div className="sw-tag">
                    <span className="sw-tag-label">Dairy, out of date</span>
                    <span className="sw-tag-amount">£12.40</span>
                </div>
                <div className="sw-tag">
                    <span className="sw-tag-label">Till short</span>
                    <span className="sw-tag-amount">£5.00</span>
                </div>
                <div className="sw-tag">
                    <span className="sw-tag-label">Missing from shelf</span>
                    <span className="sw-tag-amount">£8.99</span>
                </div>
            </div>
        </main>
    )
}

export default Home