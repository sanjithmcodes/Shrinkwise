import React, {useState, useRef, useId} from 'react'
import { Link } from 'react-router-dom'
import { FiCamera, FiCheckCircle } from 'react-icons/fi'
import { TYPE_LABELS, CATEGORY_LABELS, formatMoney } from '../../lossFormat'

function today() {
    return new Date().toISOString().split('T')[0]
}

const LossEventForm = (props) => {
    //when a lossEvent is passed in, the form edits it instead of creating a new one
    const lossEvent = props.lossEvent
    const isEdit = Boolean(lossEvent)

    //unique ids so several forms (e.g. edit modals) can't clash
    const id = useId()
    const fileInput = useRef(null)

    //form states
    const [type, setType] = useState(isEdit ? lossEvent.type : '')
    const [category, setCategory] = useState(isEdit ? lossEvent.category : '')
    const [cost, setCost] = useState(isEdit ? lossEvent.cost : '')
    const [quantity, setQuantity] = useState(isEdit ? lossEvent.quantity ?? '' : '')
    const [date, setDate] = useState(isEdit ? lossEvent.date.slice(0,10) : today())
    const [description, setDescription] = useState(isEdit ? lossEvent.description ?? '' : '')
    const [selectedFile, setSelectedFile] = useState(undefined)

    //Error and success states
    const [errors, setErrors] = useState([])
    //details of the last new loss saved, for the confirmation message
    const [saved, setSaved] = useState(null)

    const total = cost === '' ? null : Number(cost) * (quantity ? Number(quantity) : 1)

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

    function resetForm() {
        setType('')
        setCategory('')
        setCost('')
        setQuantity('')
        setDate(today())
        setDescription('')
        setSelectedFile(undefined)
        if (fileInput.current) fileInput.current.value = ''
    }

    async function handleSubmit(e){
        e.preventDefault()
        setSaved(null)
        let temp = []
        if(type === '' || category === '' || cost === '' || date === '') {
            temp = [...temp, 'Fill in the type, category, cost and date.']
        }else {
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
                        setSaved({ total, category })
                        resetForm()
                        props.onSaved()
                    }
                })
                .catch(err => {
                    console.error(err)
                    temp = [...temp, "Couldn't save the loss. Try again."]
                })

        }
        setErrors(temp)
    }


    function handleFile(e){
        setSelectedFile(e.target.files[0])
    }

    return (
        //starting the next loss hides the last confirmation
        <form className="sw-log-form" encType="multipart/form-data" onSubmit={handleSubmit} onChange={() => saved && setSaved(null)}>
            {isEdit && <h2 className="h3 mb-3">Edit loss</h2>}

            <fieldset className="sw-fieldset">
                <legend>What happened</legend>

                <div className="sw-type-picker" role="radiogroup" aria-label="Type">
                    {Object.entries(TYPE_LABELS).map(([value, label]) => (
                        <div key={value} className={`sw-type-option is-${value}`}>
                            <input
                                type="radio"
                                id={`${id}-type-${value}`}
                                name="type"
                                value={value}
                                checked={type === value}
                                onChange={handleType}
                            />
                            <label htmlFor={`${id}-type-${value}`}>{label}</label>
                        </div>
                    ))}
                </div>

                <div className="sw-form-grid">
                    <div>
                        <label htmlFor={`${id}-category`} className="form-label">Category</label>
                        <select required value={category} onChange={handleCategory} className="form-select" id={`${id}-category`} name="category">
                            <option disabled value=''>Choose a category</option>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`${id}-date`} className="form-label">Date</label>
                        <input value={date} onChange={handleDate} required type="date" max={today()} className="form-control" id={`${id}-date`} name="date" />
                    </div>
                    <div className="is-wide">
                        <label htmlFor={`${id}-description`} className="form-label">Description <span className="sw-optional">optional</span></label>
                        <textarea value={description} onChange={handleDescription} className="form-control" id={`${id}-description`} name="description" rows="2" placeholder="e.g. milk past its date"></textarea>
                    </div>
                </div>
            </fieldset>

            <fieldset className="sw-fieldset">
                <legend>How much</legend>
                <div className="sw-form-grid">
                    <div>
                        <label htmlFor={`${id}-cost`} className="form-label">Cost per unit</label>
                        <div className="sw-money-input">
                            <span aria-hidden="true">£</span>
                            <input value={cost} onChange={handleCost} required type="number" step=".01" inputMode="decimal" className="form-control" id={`${id}-cost`} name="cost" placeholder="0.00" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor={`${id}-quantity`} className="form-label">Quantity <span className="sw-optional">optional</span></label>
                        <input value={quantity} onChange={handleQuantity} type="number" inputMode="numeric" className="form-control" id={`${id}-quantity`} name="quantity" placeholder="1" />
                    </div>
                </div>
            </fieldset>

            <fieldset className="sw-fieldset">
                <legend>Photo <span className="sw-optional">optional</span></legend>
                <input ref={fileInput} type="file" className="sw-file-input" id={`${id}-file`} name="file" onChange={handleFile} accept="image/*" />
                <label htmlFor={`${id}-file`} className="sw-file">
                    <FiCamera size="22" aria-hidden="true" />
                    <span>
                        <strong>{selectedFile ? selectedFile.name : 'Add a photo'}</strong>
                        <span className="sw-muted d-block">
                            {selectedFile
                                ? 'Choose a different photo'
                                : isEdit ? 'Leave empty to keep the current photo' : 'JPG or PNG'}
                        </span>
                    </span>
                </label>
            </fieldset>

            <div className="sw-form-footer">
                <div className="sw-form-footer-status" role="status">
                    {errors.map((err,i) => {
                        return <span key={i} className="sw-alert mb-0" role="alert">{err}</span>
                    })}
                    {errors.length === 0 && saved && (
                        <p className="sw-saved">
                            <FiCheckCircle size="20" aria-hidden="true" />
                            <span>
                                <strong>Loss saved.</strong> {formatMoney(saved.total)} for {(CATEGORY_LABELS[saved.category] || saved.category).toLowerCase()}. <Link to="/feed">View in overview</Link>
                            </span>
                        </p>
                    )}
                    {errors.length === 0 && !saved && (
                        <p className="sw-form-total">
                            <span className="sw-muted">Total loss</span>
                            <span className="sw-sticker">{total === null || !isFinite(total) ? '£–' : formatMoney(total)}</span>
                        </p>
                    )}
                </div>
                <button type="submit" className="btn btn-primary btn-lg">{isEdit ? 'Save changes' : 'Save loss'}</button>
            </div>
        </form>
    )
}

export default LossEventForm
