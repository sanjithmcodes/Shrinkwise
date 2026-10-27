// Display labels and formatting shared by the loss event pages

export const TYPE_LABELS = {
    waste: 'Waste/Spoilage',
    discrepancy: 'Till discrepancy',
    unaccounted: 'Unaccounted stock',
}

export const CATEGORY_LABELS = {
    snacks: 'Snacks',
    confectionary: 'Confectionary',
    beverages: 'Beverages',
    dairy: 'Dairy',
    'frozen foods': 'Frozen foods',
    grocery: 'Grocery/Packaged foods',
    tobacco: 'Tobacco',
    alcohol: 'Alcohol',
    'health & beauty': 'Health & beauty',
    'household items': 'Household items',
    automotive: 'Automotive',
    other: 'Other',
}

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

export function formatMoney(amount) {
    return gbp.format(amount || 0)
}

export function lossTotal(lossEvent) {
    return lossEvent.cost * (lossEvent.quantity ? lossEvent.quantity : 1)
}

export function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    })
}
