import React from 'react'
import { TYPE_LABELS, CATEGORY_LABELS, formatMoney, lossTotal } from '../../lossFormat'

function Breakdown({ title, totals, labels }) {
    const rows = Object.entries(totals).sort((a, b) => b[1] - a[1])
    const max = rows.length ? rows[0][1] : 0

    return (
        <section className="sw-breakdown sw-panel">
            <h2>{title}</h2>
            {rows.length === 0 ? (
                <p className="sw-muted mb-0">Nothing logged yet.</p>
            ) : (
                <ul>
                    {rows.map(([key, amount]) => (
                        <li key={key}>
                            <div className="sw-bar-row">
                                <span>{labels[key] || key}</span>
                                <span className="sw-num">{formatMoney(amount)}</span>
                            </div>
                            <div className="sw-bar" aria-hidden="true">
                                <span style={{ width: `${max ? (amount / max) * 100 : 0}%` }}></span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

function SummaryCards({filteredPosts, period}) {

    const postsBreakdown = {
        totalLoss: 0,
        type: {},
        category: {}
    }

    filteredPosts.forEach(e => {
        const loss = Number(lossTotal(e).toFixed(2))
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

    const count = filteredPosts.length

    return (
        <div className="sw-summary">
            <section className="sw-summary-total">
                {/* keyed by period so the tag re-stamps when the period changes */}
                <div key={period} className="sw-tag is-stamped">
                    <span className="sw-tag-label">Total lost, {period.toLowerCase()}</span>
                    <span className="sw-tag-amount">{formatMoney(postsBreakdown.totalLoss)}</span>
                </div>
                <p className="sw-muted">Across {count} {count === 1 ? 'logged loss' : 'logged losses'}.</p>
            </section>
            <Breakdown title="By type" totals={postsBreakdown.type} labels={TYPE_LABELS} />
            <Breakdown title="By category" totals={postsBreakdown.category} labels={CATEGORY_LABELS} />
        </div>
    )

}

export default SummaryCards