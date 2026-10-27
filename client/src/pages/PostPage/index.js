import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";
import { TYPE_LABELS, CATEGORY_LABELS, formatMoney, formatDate, lossTotal } from "../../lossFormat";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";

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
    //EditButton/DeleteButton update a list via setPosts(prev => ...). Run their updater on a
    //one-item list: an edit swaps in the updated loss, a delete empties it, so go back to the overview.
    function setPosts(updater) {
        const [next] = updater([post])
        if (next) {
            setPost(next)
        } else {
            navigate('/feed')
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
                        <div className="sw-detail-head">
                            <div className="sw-tag">
                                <span className="sw-tag-label">{CATEGORY_LABELS[post.category] || post.category}</span>
                                <span className="sw-tag-amount">{formatMoney(lossTotal(post))}</span>
                            </div>
                            <div className="sw-detail-actions">
                                <EditButton lossEvent={post} setPosts={setPosts}/>
                                <DeleteButton ID={post._id} setPosts={setPosts}/>
                            </div>
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
                    <Link className="btn btn-primary" to="/feed">Back to overview</Link>
                </div>
            </div>
        </main>
    )
}
