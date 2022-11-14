import React from 'react'

import { navLinks, menu} from '../constants'
const Navbar = () => {
  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
        <h1 className="font-poppins font-extrabold text-white text-4xl">
            IVT
        </h1>

        <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
            {menu.map((nav, index)=>(
                <li
                key = {nav.id}
                className = {`font-poppins mr-10 text-white`}
                >
                    {nav.title}

                </li>
            ))}

        </ul>

        <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
            {navLinks.map((nav, index)=>(
                <li
                key = {nav.id}
                className = {`font-poppins mr-10 text-white`}
                >
                    {nav.title}

                </li>
            ))}

        </ul>

    </nav>
  )
}

export default Navbar