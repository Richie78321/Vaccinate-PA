import React from 'react'

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between flex-wrap p-6 bg-black">
            <div className="flex items-center flex-shrink-0 text-yellow-400 mr-6">
                <a href="/" className="font-bold text-3xl">💬 VaccinatePA</a>
            </div>
            <div className="">
                <a href="/" className="block mt-4 sm:inline-block text-yellow-400 sm:mt-0 hover:text-white mr-4">
                    Contribute
                </a>
            </div>
        </nav>
    )
}
