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

            <table class="table table-striped">
                <thead>
                    <tr>
                    <th scope="col"></th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Feed