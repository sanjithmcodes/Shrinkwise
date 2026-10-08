import React, {useState, useEffect} from 'react'
import Post from '../Post'
import {Navigate, useNavigate} from 'react-router-dom'
import LossEventForm from '../LossEventForm'

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


    async function handleLogout(){
        await fetch('/logout')
            .then(res => {
                navigate('/login')
            })
            .catch(err => console.error(err))
    }
    
    //checks if user is logged in
    if(email === '' || userName === ''){
        navigate('/login')
    }else{
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <div>
                            <p><strong>User Name</strong>: {userName}</p>
                            <p><strong>Email</strong>: {email}</p>
                            <a onClick={handleLogout} className="col-3 btn btn-primary">Logout</a>
                        </div>
                        
                        
                        <LossEventForm onSaved = {fetchProfile}/>
                    
                    </div>
                    
                    <div className="col-6">
                        <ul className="row list-unstyled">
                            {
                                posts.map((e,i) => {
                                    return (
                                        <Post key={"post-"+i} ID={e._id} image={e.image}/>
                                    )
                                })
                            }
    
                        </ul>
                        <div className="row justify-content-center mt-5">
                            <a className="btn btn-primary" href="/feed">Return to Feed</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile