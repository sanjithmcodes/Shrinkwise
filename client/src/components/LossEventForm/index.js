import React, {useState, useEffect} from 'react'
import { TYPE_LABELS, CATEGORY_LABELS } from '../../lossFormat'

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
            <h2 className="h3 mb-3">{isEdit ? 'Edit loss' : 'Log a loss'}</h2>

            {errors.map((err,i) => {
                return <span key={i} className="sw-alert" role="alert">{err}</span>
            })}

            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="sw-form-grid">
                    <div>
                        <label htmlFor="type" className="form-label">Type</label>
                        <select required value={type} onChange={handleType} className="form-select" id="type" name="type">
                            <option value='' disabled>Choose a type</option>
                            {Object.entries(TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="category" className="form-label">Category</label>
                        <select required value={category} onChange={handleCategory} className="form-select" id="category" name="category">
                            <option disabled value=''>Choose a category</option>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="cost" className="form-label">Cost per unit (£)</label>
                        <input value={cost} onChange={handleCost} required type="number" step=".01" inputMode="decimal" className="form-control" id="cost" name="cost" />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input value={quantity} onChange={handleQuantity} type="number" inputMode="numeric" className="form-control" id="quantity" name="quantity" aria-describedby="quantityHelp" />
                        <div id="quantityHelp" className="form-text">Leave empty for a single item.</div>
                    </div>
                    <div>
                        <label htmlFor="date" className="form-label">Date</label>
                        <input value={date} onChange={handleDate} required type="date" max = {new Date().toISOString().split('T')[0]} className="form-control" id="date" name="date" />
                    </div>
                    <div className="is-wide">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea value={description} onChange={handleDescription} className="form-control" id="description" name="description" rows="2" placeholder="What happened? e.g. milk past its date"></textarea>
                    </div>
                    <div className="is-wide">
                        <label htmlFor="imageUpload" className="form-label">Photo</label>
                        <input type="file" className="form-control" id="imageUpload" name="file" onChange={handleFile} accept="image/*" aria-describedby="imageHelp"></input>
                        <div id="imageHelp" className="form-text">
                            {isEdit ? 'Leave empty to keep the current photo.' : 'Optional. JPG or PNG.'}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4" value="Upload">{isEdit ? 'Save changes' : 'Save loss'}</button>
            </form>
        </>
    )
}

export default LossEventForm
