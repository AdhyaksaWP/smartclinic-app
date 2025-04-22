'use client';
import React, { useEffect, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import ChatbotIcon from '@/public/icons/ChatbotIcon';
import InstructionPopup from './InstructionPopup';
import ChatbotPopup from './ChatbotPopup';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    PointElement
} from 'chart.js';
import { JsonObject } from '@prisma/client/runtime/library';

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    PointElement
);

const Dashboard = () => {
    const [sensorReadings, setSensorReadings] = useState<number[]>([]);
    const [instructionPopup, setInstructionPopup] = useState<boolean>(false);
    const [chatbotPopup, setChatbotPopup] = useState<boolean>(false);

    const { data: session } = useSession();

    const chartRef = useRef<HTMLCanvasElement>(null);
    let chartInstance = useRef<ChartJS>(null);

    const sensorVariables: string[] = [
        "Height",
        "Weight",
        "BMI",
        "Heartbeat",
        "Temperature",
        "Blood Pressure",
        "Oxygen",
    ] as const;

    useEffect(() => {
        let initChart = async () => {
            if (!session) {
                console.error("No available session");
                return;
            }

            // Fetch some datas from the Database
            const res = await fetch("/api/chart/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: session.user.name,
                    email: session.user.email
                })
            })

            if (!res.ok){
                throw new Error("An error has happened whilst fetching data")
            }            
            const json = await res.json()
            const sensorData = json.message;

            // Check for previous charts
            if (!chartRef.current) return;
            const ctx = chartRef.current.getContext('2d');

            // Destroy the previous chart if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            console.log("Data: ", sensorData);
            sensorData.map((element: JsonObject) => {
                console.log(element.bloodPressure);
            })

            /*
                The code below will assign sensor readings from 
                the fetched sensor data with the order as below:
                1. BMI
                2. Heartbeat
                3. Temperature
                4. Blood Pressure
                5. Oxygen
            */
            const chart_data = [
                { measurement: sensorVariables[2], readings: sensorData.map((element: JsonObject) => {
                    return element.bmi;
                })},
                { measurement: sensorVariables[3], readings: sensorData.map((element: JsonObject) => {
                    return element.heartbeat;
                })},
                { measurement: sensorVariables[4], readings: sensorData.map((element: JsonObject) => {
                    return element.temperature;
                })},
                { measurement: sensorVariables[5], readings: sensorData.map((element: JsonObject) => {
                    return element.bloodPressure;
                })},
                { measurement: sensorVariables[6], readings: sensorData.map((element: JsonObject) => {
                    return element.oxygenLevel;
                })},
            ];

            const backgroundColors = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ];
            
            const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ];

            chartInstance.current = new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: sensorData.map((element: JsonObject) => {
                        return element.createdAt;
                    }),
                    datasets: chart_data.map((item, index) => ({
                        label: item.measurement,
                        data: item.readings,
                        backgroundColor: backgroundColors[index],
                        borderColor: borderColors[index],
                        borderWidth: 1
                    }))
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        initChart();
    }, [session]);

    useEffect(() => {
        console.log("Sensor readings changed:", sensorReadings);
    }, [sensorReadings]);

    return (
        <>
            <main className={`w-full h-full flex flex-row justify-center items-center gap-x-5 ${instructionPopup || chatbotPopup ? 'blur-sm' : ''}`}>
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
                            <div className='bg-white rounded-3xl h-full flex items-center justify-center'>
                                <div className='w-11/12'>
                                    <h2 className='font-inter text-2xl font-bold'>Recent Check-ups</h2>
                                    <div className='w-full h-3/6 my-4 bg-white rounded-3xl flex items-center justify-center'>
                                        <canvas
                                            width={400}
                                            height={120}
                                            ref={chartRef} id="myChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Start assessment button*/}
                        <div className='w-full h-2/6'>
                            <button onClick={() => setInstructionPopup(true)} className=' w-full h-1/2 rounded-2xl text-white font-bold font-inter text-2xl bg-blue-700 hover:bg-blue-500 transition ease-in'>
                                Mulai Pengecekan
                            </button>
                            <button onClick={() => setChatbotPopup(true)} className=' w-full h-1/2 rounded-2xl text-white font-bold font-inter text-2xl bg-black hover:bg-gray-800 flex items-center justify-center gap-x-5 transition ease-in'>
                                <ChatbotIcon />
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
                                    Height
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
                                Detak <br />
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
                                Temperature
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
                                    Blood pressure
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
                                    Oxygen
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
            {instructionPopup ? <InstructionPopup setInstructionPopup={setInstructionPopup} setSensorReadings={setSensorReadings} /> : ""}
            {chatbotPopup ? <ChatbotPopup chatbotPopup={chatbotPopup} setChatbotPopup={setChatbotPopup} /> : ""}
        </>
    );
};

export default Dashboard;
