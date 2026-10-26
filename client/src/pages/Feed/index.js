import React, {useState, useEffect} from 'react'
import DeleteButton from '../../components/DeleteButton';
import BasicDropdown from '../../components/BasicDropdown';
import SummaryCards from '../../components/SummaryCards';


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
        <>

        <BasicDropdown selectOption={selectOption} toggle='Select time period' select={[
            {option: 'Today'},
            {option: 'Last 7 Days'}, 
            {option: 'Last 30 Days'}, 
            {option: 'All Time'}
            ]}
        />
        
        <SummaryCards filteredPosts={filteredPosts} period={period}/>
        
        <div className="container">

            <table className="tw-mt-20 table table-striped tw-text-center">
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
                        filteredPosts.map((e,i)=>{
                            return (
                                <tr key={e._id} className='align-middle'>
                                        <th scope="row">{i}</th>
                                        <td>{e.date.slice(0,10).split('-').reverse().join('/')}</td>
                                        <td>{e.type.toUpperCase()}</td>
                                        <td>{e.category.toUpperCase()}</td>
                                        <td>{e.description || '-'}</td>
                                        <td>{e.quantity || '-'}</td>
                                        <td>£{e.cost.toFixed(2)}</td>
                                        <td>£{(e.cost * (e.quantity ? e.quantity : 1)).toFixed(2)}</td>
                                        <td><img className="img-fluid tw-h-16 tw-w-16 tw-object-cover" src={e.image} alt='Loss Thumbnail'></img></td>
                                        <td>
                                            <DeleteButton ID={e._id} setPosts={setPosts}/>
                                        </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
        </>
    )
}

export default Feed