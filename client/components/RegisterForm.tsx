'use client';
// import { useRouter } from 'next/navigation'
import { FocusEvent, useState } from 'react'
import React from 'react'
import Link from 'next/link'

const RegistrationForm = () => {
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("")

    const handleSubmit = async (e: FocusEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fullName || !email || !password || !birthDate){
            alert("Semuanya harus diisi!");
            return;
        }

        try {
            const resUserExists = await fetch ("api/auth/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const { user } = await resUserExists.json();

            if (user) {
                alert("User already exists.");
                return;
            }

            const res = await fetch('api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName, email, password, birthDate
                })
            })

            if (res.ok) {
                const form = e.target;
                form.reset();
            } else {
                console.log("User registration failed");
            }
        } catch (error) {
            console.log("Error during registration", error);
        }
    }

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => e.target.type = 'date';
    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => e.target.type = 'text';

    return (
        <div className='bg-white relative h-96 w-1/3 rounded-3xl flex flex-col justify-center items-center'>
            {/* Register section */}
            <section className='w-full h-full flex flex-col justify-center items-center'>
                <div className='w-9/12 h-64 bg-light-sky-blue rounded-xl flex flex-col items-center justify-center mb-7'>
                    <form onSubmit={handleSubmit} className='w-full h-full flex flex-col items-center justify-center pt-4'>
                        <input onChange ={(e) => {setFullName(e.target.value)}} type='text' className=' border-gray-500 ' placeholder='Nama Lengkap'></input>
                        <input onChange ={(e) => {setEmail(e.target.value)}} type='email' className=' border-gray-500 ' placeholder='Email/ID'></input>
                        <input onChange ={(e) => {setPassword(e.target.value)}} type='password' className=' border-gray-500' placeholder='Kata Sandi'></input>
                        <input onChange={(e) => {setBirthDate(e.target.value)}} type='text' className=' border-gray-500 ' placeholder='Tanggal Lahir (dd/mm/yy)'
                        onFocus={onFocusHandler} onBlur={onBlurHandler}></input>

                        <button className='bg-white h-8 rounded-sm font-roboto font-semibold cursor-pointer'>Register</button>
                    </form>
                </div>
                <Link href={"/"} className='w-full flex items-center justify-center font-roboto'>
                    Sudah punya akun?&nbsp;<span className='text-blue-500'> Login</span>
                </Link>
            </section>
        </div>
    )
}

export default RegistrationForm