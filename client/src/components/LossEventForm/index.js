import React, {useState, useEffect} from 'react'

const LossEventForm = (props) => {
    //form states
    const [type, setType] = useState('')
    const [category, setCategory] = useState('')
    const [cost, setCost] = useState('')
    const [quantity, setQuantity] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState(undefined)

    //Error states
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState([])

    function handleQuantity(e){
        setQuantity(e.target.value)
    }
    function handleCost(e) {
        setCost(e.target.value)
    }
    function handleDate(e) {
        setDate(e.target.value)
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

    async function handleSubmit(e){
        e.preventDefault()
        // action="/post/createPost" encType="multipart/form-data" method="POST"
        let temp = []
        if(type === '' || category === '' || cost === '' || date === '') {
            temp = [...temp, 'Please fill in all fields']
        }else {
            setSubmitted(true);
            setErrors([]);

            const formData = new FormData()
            formData.append("type", type)
            formData.append("category", category)
            formData.append("cost", cost)
            formData.append("date", date)

            if (description) {
                formData.append("description", description)
            }
            if (quantity) {
                formData.append("quantity", quantity)
            }
            if (selectedFile) {
                formData.append("file", selectedFile)
            }

            const options = {
                method: 'POST',
                body: formData
            }
            const formObject = Object.fromEntries(formData.entries())
            console.log(formObject)

            await fetch('/lossEvent/createLossEvent', options)
                .then(res => {
                    props.onSaved()
                    
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

    return (
        <>

            <div className="mt-5">
                {errors.map((err,i) => {
                    return <span key={i} className="alert alert-danger">{err}</span>
                })}
            </div>


            <div className="mt-5">
                <h2>Add a Loss Event</h2>
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Type</label>
                        <select required defaultValue='' onChange={handleType} type="text" className="form-control" id="type" name="type">
                            <option value='' disabled> -- select an option -- </option>
                            <option value='waste'>Waste/Spoilage</option>
                            <option value='discrepancy'>Till discrepancy</option>
                            <option value='unaccounted'>Unaccounted Stock</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select required defaultValue='' onChange={handleCategory} type="text" className="form-control" id="category" name="category">
                            <option disabled value=''> -- select an option -- </option>
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
                        <label htmlFor="cost" className="form-label">Cost per unit</label>
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

        </>
    )
}

export default LossEventForm
