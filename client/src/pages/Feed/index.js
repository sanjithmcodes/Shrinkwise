import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { FiImage } from 'react-icons/fi'
import { TYPE_LABELS, CATEGORY_LABELS, formatMoney, formatDate, lossTotal } from '../../lossFormat'
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';
import PeriodPicker from '../../components/PeriodPicker';
import SummaryCards from '../../components/SummaryCards';


function Thumb({ lossEvent }) {
    return lossEvent.image
        ? <img className="sw-thumb" src={lossEvent.image} alt={`Photo of ${CATEGORY_LABELS[lossEvent.category] || lossEvent.category} loss`} />
        : <span className="sw-thumb sw-thumb-empty" title="No photo"><FiImage size="20" aria-label="No photo" /></span>
}

const Feed = () => {
    const [posts, setPosts] = useState([])
    const [period, setPeriod] = useState('All Time')
    

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch('/feed')
            const response = await res.json()
            setPosts(response.posts)
        }
        fetchPosts();
    }, []) 

    function selectOption(option) {
        setPeriod(option)
    }
    

    function filterByPeriod(posts, period) {
        const DAY = 1000 * 60 * 60 * 24
        const now = new Date()
        const today = new Date().setHours(0, 0, 0, 0)           

        return posts.filter(e => {
            const date = new Date(e.date).setHours(0, 0, 0, 0)   
            const daysAgo = Math.round((today - date) / DAY)            
            return daysAgo < period
        })
    }

    let filteredPosts

    if (period == 'All Time') {
        filteredPosts = posts
    } else if (period == 'Today') {
        filteredPosts = filterByPeriod(posts, 1)
    } else if (period == 'Last 7 Days') {
        filteredPosts = filterByPeriod(posts, 7)
    } else if (period == 'Last 30 Days') {
        filteredPosts = filterByPeriod(posts, 30)
    }


    return (
        <main className="container sw-page">
            <div className="sw-page-head">
                <h1>Overview</h1>
                <PeriodPicker
                    options={['Today', 'Last 7 Days', 'Last 30 Days', 'All Time']}
                    value={period}
                    selectOption={selectOption}
                />
            </div>

            <SummaryCards filteredPosts={filteredPosts} period={period}/>

            <h2 className="h3 mb-3">Logged losses</h2>

            {filteredPosts.length === 0 ? (
                <div className="sw-empty">
                    <h2>No losses logged for this period</h2>
                    <p className="sw-muted">When something goes to waste or goes missing, log it so it shows up here.</p>
                    <Link to="/profile" className="btn btn-primary">Log a loss</Link>
                </div>
            ) : (
                <>
                    {/* Desktop: table */}
                    <div className="sw-table-wrap d-none d-md-block">
                        <div className="table-responsive">
                            <table className="table sw-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Photo</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Description</th>
                                        <th scope="col" className="is-num">Qty</th>
                                        <th scope="col" className="is-num">Unit cost</th>
                                        <th scope="col" className="is-num">Loss</th>
                                        <th scope="col"><span className="visually-hidden">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.map(e => (
                                        <tr key={e._id}>
                                            <td><Thumb lossEvent={e} /></td>
                                            <td className="text-nowrap">{formatDate(e.date)}</td>
                                            <td><span className={`sw-chip is-${e.type}`}>{TYPE_LABELS[e.type] || e.type}</span></td>
                                            <td>{CATEGORY_LABELS[e.category] || e.category}</td>
                                            <td className="sw-desc">{e.description || '–'}</td>
                                            <td className="is-num sw-num">{e.quantity || 1}</td>
                                            <td className="is-num sw-num">{formatMoney(e.cost)}</td>
                                            <td className="is-num"><span className="sw-sticker">{formatMoney(lossTotal(e))}</span></td>
                                            <td className="text-nowrap">
                                                <EditButton lossEvent={e} setPosts={setPosts}/>
                                                <DeleteButton ID={e._id} setPosts={setPosts}/>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile: cards */}
                    <ul className="sw-cards d-md-none">
                        {filteredPosts.map(e => (
                            <li key={e._id} className="sw-card">
                                <Thumb lossEvent={e} />
                                <div>
                                    <strong className="d-block">{CATEGORY_LABELS[e.category] || e.category}</strong>
                                    <span className={`sw-chip is-${e.type} my-1`}>{TYPE_LABELS[e.type] || e.type}</span>
                                    {e.description && <p className="mb-1">{e.description}</p>}
                                    <div className="sw-card-meta sw-num">
                                        {formatDate(e.date)}, {e.quantity || 1} × {formatMoney(e.cost)}
                                    </div>
                                    <div className="sw-card-actions">
                                        <EditButton lossEvent={e} setPosts={setPosts}/>
                                        <DeleteButton ID={e._id} setPosts={setPosts}/>
                                    </div>
                                </div>
                                <span className="sw-sticker">{formatMoney(lossTotal(e))}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </main>
    )
}

export default Feed