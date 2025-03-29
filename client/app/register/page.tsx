import '@/styles/global.css'
import RegisterForm from '@/components/RegisterForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import React from 'react'

const RegisterPage = async () => {
  const session = await getServerSession(authOptions)
  if (session){
    redirect('/')
  }
  return (
    <main  className='bg-light-sky-blue h-screen w-full flex justify-center items-center'>
        <RegisterForm></RegisterForm>
    </main>
  )
}

export default RegisterPage