import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";
import { TYPE_LABELS, CATEGORY_LABELS, formatMoney, formatDate, lossTotal } from "../../lossFormat";

export default function PostPage() {
    let { id } = useParams();
    //post state
    const [post, setPost] = useState({})

    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`/post/${id}`)
            const response = await res.json()
            setPost(response.post)
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
        <main className="container sw-page">
            <div className="sw-detail">
                <div>
                    {post.image
                        ? <img className="sw-detail-img" src={post.image} alt="Photo of the loss" />
                        : <div className="sw-empty sw-muted">No photo for this loss.</div>}
                </div>
                <div>
                    {post.cost !== undefined && (
                        <div className="sw-tag">
                            <span className="sw-tag-label">{CATEGORY_LABELS[post.category] || post.category}</span>
                            <span className="sw-tag-amount">{formatMoney(lossTotal(post))}</span>
                        </div>
                    )}
                    <dl>
                        <dt>Type</dt>
                        <dd>{post.type && <span className={`sw-chip is-${post.type}`}>{TYPE_LABELS[post.type] || post.type}</span>}</dd>
                        <dt>Date</dt>
                        <dd>{formatDate(post.date)}</dd>
                        <dt>Quantity</dt>
                        <dd className="sw-num">{post.quantity || 1} × {formatMoney(post.cost)}</dd>
                        {post.description && <>
                            <dt>Description</dt>
                            <dd>{post.description}</dd>
                        </>}
                    </dl>
                    <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-primary" to="/feed">Back to overview</Link>
                        <Link className="btn btn-outline-primary" to="/profile">Back to profile</Link>
                        <form onSubmit={handleDelete}>
                            <button className="btn btn-link sw-danger-link" type="submit">Delete loss</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
