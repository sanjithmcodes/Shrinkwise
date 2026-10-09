import React, { useState, useEffect } from 'react'
import { useParams, Navigate, useNavigate } from "react-router-dom";

export default function PostPage() {
    let { id } = useParams();
    //post state
    const [post, setPost] = useState({})

    const [isFavourited, setIsFavourited] = useState(false)

    //requesting-user state
    const [user, setUser] = useState('')

    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`/post/${id}`)
            const response = await res.json()
            setPost(response.post)
            setUser(response.user)
            // setIsLiked(response.isLiked) //no serverside code to check if post is liked by requser
        }
        fetchPost()
        return
    }, [])

    const navigate = useNavigate()
    async function handleDelete(e){
        e.preventDefault()
        try{
            await fetch(`/lossEvent/deleteLossEvent/${id}?_method=DELETE`, {
            'method': "POST",
            })
            navigate('/profile')
            console.log('Loss event deleted')
        }
        catch(err) {
            console.log(err)
        }
        
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-6">
                    <h2>£{post.cost}</h2>
                    <img className="img-fluid" src={post.image} />
                    <div className="row justify-content-between">
                        <form
                            className="col-1"
                        >
                        </form>
                        {user === post.user ?
                            (
                            <form
                                className="col-3"
                                
                                onSubmit={handleDelete}
                            >
                                <button className="btn btn-primary fa fa-trash" type="submit"></button>
                            </form>
                            )
                            :
                            (
                                ""
                            )
                        }
                    </div>
                </div>
                            {/* <DeletePost userId={user} postUser={post.user} postId={post.id} /> */}
                <div className="col-3 mt-5">
                    <p>{post.description}</p>
                </div>
                <div className="col-6 mt-5">
                    <a className="btn btn-primary mx-3" href="/profile">Return to Profile</a>
                    <a className="btn btn-primary mx-3" href="/feed">Return to Feed</a>
                </div>
            </div>
        </div>
    )
}