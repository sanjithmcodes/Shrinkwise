import React, {useState, useEffect} from 'react'
import Post from '../../components/Post'

const Feed = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch('/feed')
            const response = await res.json()
            setPosts(response.posts)
        }
        fetchPosts();
        return;
    }, []) 


    return (
        <div class="container">
            <div class="row justify-content-center mt-5">
                <ul class="row list-unstyled">
                    {
                        posts.map((e,i) => {
                            return (
                                <Post ID={e._id} image={e.image} />
                            )
                        })
                    }
                </ul>
            </div>

            <table class="table table-striped tw-text-center">
                <thead>
                    <tr>
                    <th scope="col"></th>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Category</th>
                    <th scope="col">Description</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Unit Cost</th>
                    <th scope="col">Total Loss</th>
                    <th scope="col">Photo</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.map((e,i)=>{
                            return (
                                <tr className='align-middle'>
                                    <th scope="row">{i}</th>
                                    <td>{e.createdAt.slice(0,10)}</td>
                                    <td>{e.type.toUpperCase()}</td>
                                    <td>{e.category.toUpperCase()}</td>
                                    <td>{e.description || '-'}</td>
                                    <td>{e.quantity || '-'}</td>
                                    <td>£{e.cost}</td>
                                    <td>£{e.cost * (e.quantity ? e.quantity : 1)}</td>
                                    <td><img className="img-fluid tw-h-16 tw-w-16 tw-object-cover" src={e.image} alt='Loss Thumbnail'></img></td>
                                    <td></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Feed