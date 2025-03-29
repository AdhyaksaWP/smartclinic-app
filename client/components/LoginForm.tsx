'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // This prevents page refresh
        console.log("Submitting form..."); // Debugging log
    
        try {
            const result = await signIn("credentials", {
                redirect: false,  // Avoid automatic redirect
                email,
                password,
            });
    
            console.log("Result after login attempt:", result); // Debugging log
    
            if (result?.error) {
                setError(result.error);
                console.error("Login error:", result.error);
            } else {
                console.log("Login successful! Redirecting...");
                router.push('/dashboard'); // Use push instead of replace
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className='bg-white relative h-2/3 w-1/3 rounded-3xl flex flex-col justify-center items-center'>
            {/* Website logo & Welcome */}
            <section className='mb-14 flex flex-row'>
                <h1 className='font-roboto text-4xl font-bold'>
                    Selamat <br></br>
                    Datang
                </h1>
                <h1 className='text-7xl'>👋</h1>
            </section>

            {/* Sign In and Sign Up section */}
            <section className='w-full flex flex-col items-center justify-center'>
                <div className='w-2/3 h-52 bg-light-sky-blue rounded-xl flex flex-col items-center justify-center'>
                    <form onSubmit={handleSubmit} className='w-full h-full flex flex-col flex-1 items-center justify-center'>
                        <input 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                            type='email' 
                            className='border-gray-500' 
                            placeholder='Email/ID' 
                            value={email}
                        />
                        <input 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                            type='password' 
                            className='border-gray-500' 
                            placeholder='Password' 
                            value={password}
                        />
                        <button type='submit' className='bg-white h-8 rounded-sm font-roboto font-semibold cursor-pointer'>Login</button>
                    </form>
                </div>
                {error && <p className='text-red-500'>{error}</p>}
                <Link href="/register" className='w-full flex items-center justify-center font-roboto'>
                    Belum punya akun?&nbsp;<span className='text-blue-500'>Register</span>
                </Link>
            </section>
        </div>
    );
};

export default LoginForm;
