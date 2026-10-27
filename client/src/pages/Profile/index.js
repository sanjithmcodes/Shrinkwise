import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import LossEventForm from '../../components/LossEventForm'

const Profile = () => {
    const navigate = useNavigate()


    //User states
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')


    async function fetchProfile() {
            const res = await fetch('/profile')
            const response = await res.json()
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
                    <div className="sw-page-head">
                        <h1>Log a loss</h1>
                        <div className="sw-user">
                            <span className="sw-avatar" aria-hidden="true">{userName.charAt(0).toUpperCase()}</span>
                            <div className="sw-user-text">
                                <strong>{userName}</strong>
                                <span>{email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="sw-panel sw-log-panel">
                        <LossEventForm onSaved = {fetchProfile}/>
                    </div>
                </div>
            </main>
        )
    }
}

export default Profile