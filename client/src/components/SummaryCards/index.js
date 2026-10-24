import React from 'react'


function SummaryCards({filteredPosts, period}) {

    const postsBreakdown = {
        totalLoss: 0,
        type: {},
        category: {}
    }

    filteredPosts.forEach(e => {
        const loss = Number((e.cost * (e.quantity ? e.quantity : 1)).toFixed(2))
        postsBreakdown.totalLoss += loss
        
        if (postsBreakdown.type[e.type]) {
            postsBreakdown.type[e.type] += loss
        } else {
            postsBreakdown.type[e.type] = loss
        }

        if (postsBreakdown.category[e.category]) {
            postsBreakdown.category[e.category] += loss
        } else {
            postsBreakdown.category[e.category] = loss
        }
    })
    
    return (
        <div className="card-group">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Total Loss</h2>
                    <span className="card-text">£{postsBreakdown.totalLoss.toFixed(2)}</span>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Breakdown by Type</h5>
                    <ul className="card-text">
                       {Object.keys(postsBreakdown.type).map(e => {
                        return <li className='tw-uppercase tw-list-none' key={e}>{e}: £{postsBreakdown.type[e].toFixed(2)}</li>
                        })
                        } 
                    </ul>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Breakdown by Category</h5>
                    <ul className="card-text">
                       {Object.keys(postsBreakdown.category).map(e => {
                        return <li className='tw-uppercase tw-list-none' key={e}>{e}: £{postsBreakdown.category[e].toFixed(2)}</li>
                        })
                        } 
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default SummaryCards