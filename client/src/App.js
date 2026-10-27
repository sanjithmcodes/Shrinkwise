import React from "react"
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LogLoss from './pages/LogLoss'
import Feed from './pages/Feed'
import PostPage from './pages/PostPage'
// import [COMPONENT_NAME] from './components/[COMPONENT_NAME]'

import { Route, Routes, useParams } from 'react-router-dom'

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route exact path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup />}/>
                <Route path="/logloss" element={<LogLoss />}/>
                <Route path="/feed" element={<Feed />}/>
                <Route path="/post/:id" element={<PostPage />}/>
            </Routes>
            <Footer />
        </>
    )
}

export default App