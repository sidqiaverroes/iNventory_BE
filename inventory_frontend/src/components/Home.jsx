import React from 'react'
import styles from '../style'

import {linkedin, facebook, instagram, twitter} from "../assets"
import HomeIMG from '../assets/HomeIMG.png'

const Home = () =>  (
    <section id='home' className={`flex md:flex flex-col h-screen ${styles.paddingY}`}>
        <div className="flex flex-row justify-between items-center w-full text-poppins align-top">
            <div>
                <h1 className='text-[64px] text-white text-poppins pt-[10px] pb-8 break-normal leading-tight'>
                    Let's <br></br> Manage Your Stuff
                </h1>
                <p className='text-white leading-5 text-[12px] pb-[50px] text-justify'>
                Manage your items more easily and regularly through the inventory you create. <br/>
                You can add new items to the inventory, update, and delete them when they are no longer needed. <br/>Manage your items more easily and regularly through the inventory you create.<br/>
                You can add new items to the inventory, update, and delete them when they are no longer needed.<br/>
                Use the filter and sorting features to make it faster and easier to find your inventory and items.<br/>
                Details, starting from the category, item name, and date will be recorded.<br/>
                You can also view activity reports that you do in your inventory.<br/>
                </p>
                <div className="bg-red-button rounded-xl py-2 px-2 w-max text-center space-x-6">
                    <span className='text-white tab'>Learn more</span>
                </div>
                <div className='flex flex-row justify-between pt-[50px] w-max space-x-5'>
                    <img src={linkedin} alt='Linkedin'/>
                    <img src={facebook} alt='facebook'/>
                    <img src={instagram} alt='Instagram' />
                    <img src={twitter} alt='Twitter' />
                </div>
            </div>
            <div className='w-[50%]'>
                <div className='flex justify-center items-center  '>
                    <img src={HomeIMG} alt='Home Logo' className='h-[360px]' />
                </div>
            </div>
            
        </div>

    </section>
  )


export default Home