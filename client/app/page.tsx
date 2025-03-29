import '@/styles/global.css'
import React from 'react'
import LoginForm from '@/components/LoginForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './api/auth/[...nextauth]/route'
import LoginBackground from '@/public/images/LoginBackground'

const Home = async () => {
  const session = await getServerSession(authOptions);

  if (session){
    console.log("Current Session: ", session);
    redirect('/dashboard')
  }
  
  return (
    <main  className='bg-gradient-to-b from-sky-300 to-sky-100 h-screen w-full flex justify-center items-center gap-x-48'>
        <div className='flex flex-col transition-opacity ease-in'>
          <p className='font-inter text-4xl'><span className='font-bold'>Smart</span>Clinic</p>
          <p className='font-inter text-xl'>Medical Checkup</p>
          <LoginBackground size={100}/>
        </div>
        <LoginForm></LoginForm>
    </main>
  )
}

export default Home