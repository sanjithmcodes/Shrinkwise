import React, {useState, useEffect} from 'react'
import Post from '../../components/Post'
import {Link, useNavigate} from 'react-router-dom'
import LossEventForm from '../../components/LossEventForm'

const Profile = () => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()


    //User states
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')


    async function fetchProfile() {
            const res = await fetch('/profile')
            const response = await res.json()
            setPosts(response.posts)
            setEmail(response.email)
            setUserName(response.userName)
    }
    
    useEffect(() => {
        fetchProfile();
        return;
    }, []) 


    //checks if user is logged in
    if(email === '' || userName === ''){
        navigate('/login')
    }else{
        return (
            <main className="container sw-page">
                <div className="sw-profile">
                    <div>
                        <div className="sw-user">
                            <span className="sw-avatar" aria-hidden="true">{userName.charAt(0).toUpperCase()}</span>
                            <div className="sw-user-text">
                                <strong>{userName}</strong>
                                <span>{email}</span>
                            </div>
                        </div>

                        <div className="sw-panel">
                            <LossEventForm onSaved = {fetchProfile}/>
                        </div>
                    </div>

                    <section>
                        <h2 className="h3 mb-3">Your logged losses</h2>
                        {posts.length === 0 ? (
                            <p className="sw-muted">Nothing logged yet. Losses you save will show up here.</p>
                        ) : (
                            <ul className="sw-grid">
                                {
                                    posts.map((e,i) => {
                                        return (
                                            <Post key={e._id} lossEvent={e}/>
                                        )
                                    })
                                }
                            </ul>
                        )}
                        <Link className="btn btn-outline-primary" to="/feed">See the overview</Link>
                    </section>
                </div>
            </main>
        )
    }
}

export default Profile