'use client';
import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import ChatbotIcon from '@/public/icons/ChatbotIcon';
import InstructionPopup from './InstructionPopup';
import ChatbotPopup from './ChatbotPopup';

const Dashboard = () => {
    const [sensorReadings, setSensorReadings] = useState<number[]>([]);
    const [instructionPopup, setInstructionPopup] = useState<boolean>(false);
    const [chatbotPopup, setChatbotPopup] = useState<boolean>(false);
    const { data: session } = useSession(); 
    // useEffect(() => {
    //     console.log('Session:', session);
    // }, [session]);
    useEffect(() => {
        console.log("Sensor readings changed:", sensorReadings);
    }, [sensorReadings]);

    return (
        <>
            <main className={`w-full h-full flex flex-row justify-center items-center gap-x-5 ${instructionPopup || chatbotPopup ? 'blur-sm' : ''}` }>
                {/* Activities Section */}
                <section className='dashboard-section'>

                    <div className='w-full h-full flex flex-col'>

                        {/* Name section */}
                        <div className='w-full h-1/6 flex flex-row justify-between items-end'>
                            <h1 className='font-inter text-2xl font-bold py-2'>
                                Hello, <br></br>
                                <span className='text-2xl font-normal'>{session?.user?.name}</span>
                            </h1>
                            <button onClick={() => signOut()} className='bg-red-600 hover:bg-red-500 text-white py-2 rounded-2xl w-1/4 h-3/5 transition ease-in'>
                                Log Out
                            </button>
                        </div>

                        {/* User Reports section */}
                        <div className='w-full h-3/6 my-4'>
                            <div className='bg-white rounded-3xl h-64 flex items-center justify-center'>
                                <div className='w-9/12'>
                                    <h2 className='font-inter text-2xl font-bold mb-4'>Recent Check-ups</h2>
                                </div>
                            </div>
                        </div>

                        {/* Start assessment button*/}
                        <div className='w-full h-2/6'>
                            <button onClick={() => setInstructionPopup(true)} className=' w-full h-1/2 rounded-2xl text-white font-bold font-inter text-2xl bg-blue-700 hover:bg-blue-500 transition ease-in'>
                                Mulai Pengecekan
                            </button>
                            <button onClick={() => setChatbotPopup(true)} className=' w-full h-1/2 rounded-2xl text-white font-bold font-inter text-2xl bg-black hover:bg-gray-800 flex items-center justify-center gap-x-5 transition ease-in'>
                                <ChatbotIcon/>
                                Send to Chatbot
                            </button>
                        </div>
                    </div>
                </section>

                <section className='dashboard-section justify-center items-center gap-y-2 mt-5'>

                    <div className='small-section'>
                        <div className='small-section-inside'>
                            <div className='h1-container'>
                                <h1 className='h1-text'>
                                    Tinggi Badan
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[0] : "No data"}
                                </p>
                            </div>
                        </div>
                        <div className='small-section-inside'>
                            <div className='h1-container'>
                                <h1 className='h1-text'>
                                    Berat Badan
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[1] : "No data"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='big-section'>
                        <div className='h1-container'>
                                <h1 className='h1-text'>
                                    BMI
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[6] : "No data"}
                                </p>
                        </div>
                    </div>

                    <div className='big-section'>
                        <div className='h1-container'>
                                <h1 className='h1-text'>
                                    Detak <br/>
                                    Jantung
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[2] : "No data"}
                                </p>
                        </div>
                    </div>

                    <div className='big-section'>
                        <div className='h1-container'>
                                <h1 className='h1-text'>
                                    Suhu
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[3] : "No data"}
                                </p>
                        </div>
                    </div>

                    <div className='small-section'>
                        <div className='small-section-inside'>
                            <div className='h1-container'>
                                <h1 className='h1-text'>
                                    Tensi
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[4] : "No data"}
                                </p>
                            </div>
                        </div>
                        <div className='small-section-inside'>
                            <div className='h1-container'>
                                <h1 className='h1-text'>
                                    Level Oksigen
                                </h1>
                            </div>
                            <div className='p-container'>
                                <p className={`p-text ${sensorReadings.length > 0 ? '' : 'text-gray-300'}`}>
                                    {sensorReadings.length > 0 ? sensorReadings[5] : "No data"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {instructionPopup ? <InstructionPopup setInstructionPopup={setInstructionPopup} setSensorReadings={setSensorReadings}/> : ""}
            {chatbotPopup ? <ChatbotPopup chatbotPopup={chatbotPopup} setChatbotPopup={setChatbotPopup}/> : ""}
        </>
    );
};

export default Dashboard;
