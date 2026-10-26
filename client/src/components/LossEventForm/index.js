import React, {useState, useEffect} from 'react'

const LossEventForm = (props) => {
    //when a lossEvent is passed in, the form edits it instead of creating a new one
    const lossEvent = props.lossEvent
    const isEdit = Boolean(lossEvent)

    //form states
    const [type, setType] = useState(isEdit ? lossEvent.type : '')
    const [category, setCategory] = useState(isEdit ? lossEvent.category : '')
    const [cost, setCost] = useState(isEdit ? lossEvent.cost : '')
    const [quantity, setQuantity] = useState(isEdit ? lossEvent.quantity ?? '' : '')
    const [date, setDate] = useState(isEdit ? lossEvent.date.slice(0,10) : '')
    const [description, setDescription] = useState(isEdit ? lossEvent.description ?? '' : '')
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

            //when editing, always send these so a cleared field gets removed
            if (description || isEdit) {
                formData.append("description", description)
            }
            if (quantity || isEdit) {
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

            const url = isEdit
                ? `/lossEvent/updateLossEvent/${lossEvent._id}?_method=PUT`
                : '/lossEvent/createLossEvent'

            await fetch(url, options)
                .then(async res => {
                    if (!res.ok) {
                        throw new Error('Failed to save loss event')
                    }
                    if (isEdit) {
                        const response = await res.json()
                        props.onSaved(response.lossEvent)
                    } else {
                        props.onSaved()
                    }

                    // fetch('/profile')
                    //     .then(res => res.json())
                    //     .then(response => {
                    //         setPosts(response.posts)
                    //     })
                    //     .catch(err => console.error(err))
                })
                .catch(err => {
                    console.error(err)
                    temp = [...temp, 'Saving failed, please try again']
                })

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
                <h2>{isEdit ? 'Edit Loss Event' : 'Add a Loss Event'}</h2>
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Type</label>
                        <select required value={type} onChange={handleType} type="text" className="form-control" id="type" name="type">
                            <option value='' disabled> -- select an option -- </option>
                            <option value='waste'>Waste/Spoilage</option>
                            <option value='discrepancy'>Till discrepancy</option>
                            <option value='unaccounted'>Unaccounted Stock</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select required value={category} onChange={handleCategory} type="text" className="form-control" id="category" name="category">
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
                        <input value={cost} onChange={handleCost} required type="number" step=".01" className="form-control" id="cost" name="cost" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input value={quantity} onChange={handleQuantity} type="number" className="form-control" id="quantity" name="quantity" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input value={date} onChange={handleDate} required type="date" max = {new Date().toISOString().split('T')[0]} className="form-control" id="date" name="date" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea value={description} onChange={handleDescription} className="form-control" id="description" name="description"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imgUpload" className="form-label">Image{isEdit && ' (leave empty to keep current image)'}</label>
                        <input type="file" className="form-control" id="imageUpload" name="file" onChange={handleFile} accept="image/*"></input>
                    </div>
                    <button type="submit" className="btn btn-primary" value="Upload">{isEdit ? 'Save' : 'Submit'}</button>
                </form>
            </div>

        </>
    )
}

export default LossEventForm
