import React from 'react'
import ArtistCard from './_components/ArtistCard'

const layout = ({ children }) => {
    return (
        <div>
            <ArtistCard />
            <section className='max-w-6xl mx-4 md:mx-auto mt-4 '>
                {children}
            </section>
        </div>
    )
}

export default layout