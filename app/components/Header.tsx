'use client'
import { useContext } from 'react'
import Image from 'next/image'
import {assets} from '../assets/assets'
import { AppContent } from '../context/AppContent'
const Header = () => {
  const { userData } = useContext(AppContent)
  return (
    <div className='flex flex-col justify-center items-center'>
        <Image src={assets.header_img} alt='' className='w-36 rounded-full mb-0'/>
        <h1 className='flex items-center gap-2 mb-2 text-xl sm:text3xl'>Hey <span className='font-semibold'>{userData? userData.name : 'Developer'}</span><Image src={assets.hand_wave} alt='' className='w-8'/></h1>
        <h2 className='text-3xl mb-2'>Welcome to our app</h2>
        <p className='mb-4'>Lets start with a quick product tour and we will have you up and running in no time!</p>
        <button className='border rounded-full px-4 py-2 bg-black text-white hover:bg-white hover:text-black cursor-pointer'>Get Started</button>
    </div>
  )
}

export default Header