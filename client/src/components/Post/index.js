import React from 'react'
import { Link } from 'react-router-dom'
import { FiImage } from 'react-icons/fi'
import { CATEGORY_LABELS, formatMoney, lossTotal } from '../../lossFormat'

const Post = ({ lossEvent }) => {
    const category = CATEGORY_LABELS[lossEvent.category] || lossEvent.category

    return (
        <li className="sw-grid-item">
            <Link to={"/post/" + lossEvent._id} aria-label={`${category} loss, ${formatMoney(lossTotal(lossEvent))}`}>
                {lossEvent.image
                    ? <img src={lossEvent.image} alt="" />
                    : <span className="sw-grid-empty"><FiImage size="28" /></span>}
                <span className="sw-sticker">{formatMoney(lossTotal(lossEvent))}</span>
            </Link>
        </li>
    )
}

export default Post