'use client'
import Navbar from "../components/Navbar"
import type {FormEvent} from 'react'
import {AppContent} from '../context/AppContent'
import { useContext, useEffect, useState, useRef} from "react"
const Page = () => {
  const [profileImage, setProfileImage]= useState<string>('https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-upload-icon-png-image_4267359.jpg')
  const [name, setName] = useState('') 
  const [email, setEmail]= useState('')
  const [message, SendMessage]= useState('')
  const fileInputRef= useRef<HTMLInputElement | null>(null)
  const context = useContext(AppContent)
  const userData= context?.userData
  const backendUrl= context?.backendUrl
  useEffect(()=>{
  if(userData)
  {
   setName(prev => prev === userData.name ? prev : userData.name || '')
   setEmail(prev => prev ===  userData.email ? prev : userData.email || '')
  }
  },[userData?.name, userData?.email])
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const file= e.target.files?.[0]
    if(!file) return
    const imageUrl = URL.createObjectURL(file)
    setProfileImage(imageUrl)
  }
  const handlebuttonClick=()=>{
    fileInputRef.current?.click()
  }
  const token= localStorage.getItem("token")
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
   e.preventDefault()
   try{
    const res= await fetch(`${backendUrl}/update-profile`,{
      method : "PUT",
      headers :{
        "Content-Type" : "application/json",
        Authorization : `Bearer ${token}`,
      },
      body: JSON.stringify({
        name, email})
    })
    const data= await res.json()
    if(res.ok)
      SendMessage("Profile Updated Successfully")
    else
      SendMessage(data.message || "Updated failed")

   }
   catch (error) {
    console.error(error)
    SendMessage("Something went wrong")
  }
  }
  return (
    <>
      <Navbar/>
      <div className="flex items-center justify-center ">
        <div className="w-[350px] min-h-[400px] sm:w-[450px] shadow-xl">
          <div className="flex items-center gap-10 p-5">
            <img src={profileImage} alt='ProfileImage' className="w-[130px] h-[130px] object-cover rounded-full "/>
            <div className="">
              <h1 className="text-xl pt-5">{name}</h1>
              <p className="mt-2">{email}</p>
            </div>
          </div>
          <div className="ml-5">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden"/>
            <button type="button" onClick={handlebuttonClick} className="rounded bg-indigo-600 text-white font-semibold p-2 cursor-pointer">Upload Image</button></div>
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
           <div className="flex flex-col gap-2">
           <label htmlFor="name">Name</label>
           <input id="name" type='text' value={name} onChange={(e)=>setName(e.target.value)}  className="border rounded p-2 "/>
           </div> 
           <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={email} type="email" onChange={(e)=> setEmail(e.target.value)} className="border rounded p-2"/>
           </div>
            <button type="submit" className="m-2 p-2 rounded-full bg-indigo-700 hover:bg-indigo-600 cursor-pointer text-white font-semibold text-xl">Submit</button>
          </form>
          {message && <p className="text-green-600 font-semibold text-center mb-1">{message}</p>}
        </div>
      </div>
    </>
  )
}

export default Page