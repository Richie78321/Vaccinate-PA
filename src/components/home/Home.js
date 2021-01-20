import React from 'react'

export default function Home() {
    return (
        <div className="mt-6">
            <h1 
                className="font-semibold text-3xl"
            >
                Pennsylvania COVID-19 Vaccine Availability
            </h1>
            <p>
                The state of Pennsylvania has approved giving the COVID-19 vaccine
                to people age 65 and older. We are calling hospitals and pharmacies
                to check which are currently adminstering vaccines.

                <br />
                Find your county below 🔽
            </p>
            <iframe
            class="airtable-embed"
            title="All County Airtable Embed"
            src="https://airtable.com/embed/shr1fCiGy7sVnNixq?backgroundColor=grayLight&viewControls=on"
            frameborder="0"
            onmousewheel=""
            width="90%"
            height="533"
            className="bg-transparent border border-gray-500"
            />
        </div>
    )
}
