import React from 'react'

export default function SearchMachines({searchTerm, setSearchTerm, placeholder, id, icon}) {
    return (
        <div className="py-2 px-4 bg-[#9CB6DA] rounded-full flex items-center gap-2 border-[#1A1616]">
            {icon}
            <input
            type="text"
            id={id}
            className="block w-full rounded-md outline-none sm:text-sm"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}
