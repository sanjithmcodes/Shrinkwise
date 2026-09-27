import React, {useState, useEffect} from 'react'
import Post from '../Post'
import {Navigate, useNavigate} from 'react-router-dom'

const Profile = () => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    //Error states
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState([])

    //User states
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')

    //form states
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [caption, setCaption] = useState('')
    const [category, setCategory] = useState('')
    const [cost, setCost] = useState('')
    const [quantity, setQuantity] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState(undefined)
    
    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch('/profile')
            const response = await res.json()
            setPosts(response.posts)
            setEmail(response.email)
            setUserName(response.userName)
        }
        fetchProfile();
        return;
    }, []) 

    function handleFile(e){
        // let reader = new FileReader()
        // reader.readAsDataURL(e.target.files[0])
        // reader.onload = () => {
        //     setSelectedFile(reader.result)
        // }
        // reader.onerror = (error) => {
        //     console.log('Error: ', error)
        // }
        setSelectedFile(e.target.files[0])
    }

    function handleTitle(e){
        setTitle(e.target.value)
    }
    function handleQuantity(e){
        setQuantity(e.target.value)
    }
    function handleCost(e) {
        setCost(e.target.value)
    }
    function handleDate(e) {
        setCost(e.target.value)
    }
    function handleType(e){
        setType(e.target.value)
    }
    function handleCategory(e){
        setCategory(e.target.value)
    }

    function handleDescription(e){
        setDescription(e.target.value)
    }

    function handleCaption(e){
        setCaption(e.target.value)
    }

    async function handleSubmit(e){
        
        e.preventDefault()
        // action="/post/createPost" encType="multipart/form-data" method="POST"
        let temp = []
        if(title === '' || caption === '' || selectedFile === undefined) {
            temp = [...temp, 'Please fill in all fields']
        }else {
            setSubmitted(true);
            setErrors([]);

            const formData = new FormData()
            formData.append("title", title)
            formData.append("caption", caption)
            formData.append("file", selectedFile)

            const options = {
                method: 'POST',
                body: formData
            }

            await fetch('/post/createPost', options)
                .then(res => {
                    window.location.reload()
                    // fetch('/profile')
                    //     .then(res => res.json())
                    //     .then(response => {
                    //         setPosts(response.posts)
                    //     })
                    //     .catch(err => console.error(err))
                })
                .catch(err => console.error(err))
            
        }
        setErrors(temp)

    }

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
                        <div className="mt-5">
                            {errors.map((err,i) => {
                                return <span key="{i}" className="alert alert-danger">{err}</span>
                            })}
                        </div>
                        <div className="mt-5">
                            <h2>Add a post</h2>
                            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input onChange={handleTitle} type="text" className="form-control" id="title" name="title" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="caption" className="form-label">Caption</label>
                                    <textarea onChange={handleCaption} className="form-control" id="caption" name="caption"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="imgUpload" className="form-label">Image</label>
                                    <input type="file" className="form-control" id="imageUpload" name="file" onChange={handleFile} accept="image/*"></input>
                                </div>
                                <button type="submit" className="btn btn-primary" value="Upload">Submit</button>
                            </form>
                        </div>
                        
                        <div className="mt-5">
                            <h2>Add a Loss Event</h2>
                            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Type</label>
                                    <select required onChange={handleType} type="text" className="form-control" id="type" name="type">
                                        <option hidden disabled selected value> -- select an option -- </option>
                                        <option value='waste'>Waste/Spoilage</option>
                                        <option value='discrepancy'>Till discrepancy</option>
                                        <option value='unaccounted'>Unaccounted Stock</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select required onChange={handleCategory} type="text" className="form-control" id="category" name="category">
                                        <option hidden disabled selected value> -- select an option -- </option>
                                        <option value='snacks'>Snacks</option>
                                        <option value='confectionary'>Confectionary</option>
                                        <option value='beverages'>Beverages</option>
                                        <option value='dairy'>Dairy</option>
                                        <option value='frozen foods'>Frozen Foods</option>
                                        <option value='grocery'>Grocery/Packaged Foods</option>
                                        <option value='tobacco'>Tobacco</option>
                                        <option value='alcohol'>Alcohol</option>
                                        <option value='health & beauty'>Health & Beauty</option>
                                        <option value='household items'>Household Items</option>
                                        <option value='automotive'>Automotive</option>
                                        <option value='other'>Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cost" className="form-label">Cost</label>
                                    <input onChange={handleCost} required type="number" step=".01" className="form-control" id="cost" name="cost" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                    <input onChange={handleQuantity} type="number" className="form-control" id="quantity" name="quantity" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input onChange={handleDate} required type="date" className="form-control" id="date" name="date" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea onChange={handleDescription} className="form-control" id="description" name="description"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="imgUpload" className="form-label">Image</label>
                                    <input type="file" className="form-control" id="imageUpload" name="file" onChange={handleFile} accept="image/*"></input>
                                </div>
                                <button type="submit" className="btn btn-primary" value="Upload">Submit</button>
                            </form>
                        </div>
                    
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