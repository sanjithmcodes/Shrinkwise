import React from 'react'

function PeriodPicker({ options, value, selectOption }) {
    return (
        <div className="sw-segmented" role="group" aria-label="Time period">
            {options.map(option => (
                <button
                    key={option}
                    type="button"
                    aria-pressed={option === value}
                    onClick={() => selectOption(option)}
                >
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                </button>
            ))}
        </div>
    )
}

export default PeriodPicker
