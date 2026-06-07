'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Navbar from '../components/Navbar'

const Page = () => {
  const [profileImage, setProfileImage] = useState<string>('https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-upload-icon-png-image_4267359.jpg')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('Profile updated successfully.')
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '720px', margin: '40px auto', padding: '0 16px' }}>
        <section style={{ display: 'grid', gap: '24px', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={profileImage}
              alt="Profile"
              style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ddd' }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{name}</h1>
              <p style={{ margin: '8px 0 0', color: '#555' }}>{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label htmlFor="profileImage" style={{ fontWeight: 600 }}>Profile Picture</label>
             <label
              htmlFor="profileImage"
              className="inline-block bg-blue-500 w-30 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
              Choose File
            </label>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <label htmlFor="name" style={{ fontWeight: 600 }}>Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <label htmlFor="email" style={{ fontWeight: 600 }}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <button type="submit" style={{ padding: '12px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
              Update Profile
            </button>
          </form>

          {message && (
            <div style={{ padding: '14px', background: '#ecfdf5', color: '#166534', borderRadius: '8px' }}>
              {message}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default Page