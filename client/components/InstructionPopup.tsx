import { prisma } from '@/lib/prisma.';
import CloseIcon from '@/public/icons/CloseIcon'
import InfoIcon from '@/public/icons/InfoIcon';
import MedicalCheckupSteps from '@/public/images/MedicalCheckupSteps'
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react'

const InstructionPopup = ({ setInstructionPopup, setSensorReadings}) => {
  const { data: session } = useSession();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentData, setCurrentData] = useState<number[]>([]);

  const [isFetchSuccessful, setIsFetchSuccessful] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataFinished, setIsDataFinished] = useState<boolean>(false);

  const sensor: string[] = [
    "Height",
    "Weight",
    "Temperature",
    "Oxymeter",
    "Tensimeter"
  ] as const;

  const sendToDB = async(data: number[]) => {
    try {
      const res = await fetch("http://localhost:3000/api/sensors/store", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: session.user.name,
            email: session.user.email,
            data: data,
        })
      })
    } catch (error) {
      console.log("An error has occured on client side: ", error)
    }
  }

  const handleStartAssesment = async (step: number, sensor: string) => {
      // console.log("Session inside handleStart function", session);
      setIsLoading(true);
      try {
          const res = await fetch("http://localhost:3000/api/sensors/fetch", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  sensor: sensor,
                  step: step
              })
          });

          if (!res.ok) {
              console.error("Failed to fetch sensor data:", res.statusText);
              return;
          }
          const data = await res.json();
          const sensorsData = data.data;
          
          if (sensorsData === null) {
            setIsFetchSuccessful(false);
            return;
          }
          else {
            setIsFetchSuccessful(true);
          }

          console.log("Current Sensor", sensor);
          if (sensor === "Oxymeter"){
            setCurrentData((prev) => [...prev, sensorsData[0]]);
            setCurrentData((prev) => [...prev, sensorsData[1]]);
          }
          else {
            setCurrentData((prev) => [...prev, sensorsData]);
          }

          setCurrentStep(step + 1);
      } catch (error) {
          console.error(error);
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    console.log("Current Data", currentData);
    console.log("Current Step", currentStep);

    // If all of the 6 data is present then add bmi as the last element in the array
    if (currentData.length == 6){
      let bmi: number = currentData[1] / ((currentData[0]/100)**2);
      setCurrentData((prev) => [...prev, bmi]);
      setCurrentStep(currentStep + 1);
    }
    else if (currentData.length == 7){
      setSensorReadings(currentData);
      setIsDataFinished(true);
      sendToDB(currentData);
      setCurrentData([]);
    };
  }, [currentData])
  

  return (
    <div className='h-full w-full absolute bg-transparent flex items-center justify-center'>
      <div className='h-4/5 w-1/2 bg-white border-2 border-sky-300 rounded-xl flex flex-col'>
        
        <div className='flex justify-end m-4'>
          <CloseIcon onClick={
            () => {
              setInstructionPopup(false);
              setIsDataFinished(false);
            }
          } className='hover:cursor-pointer' />
        </div>

        <div className='flex flex-col flex-grow items-center justify-between px-8 pb-6'>

          <div className='text-center'>
            <h1 className='flex justify-center items-center gap-x-3 font-inter font-bold text-3xl'>
                <InfoIcon/>
                Instruksi
            </h1>
            <p className='font-inter font-semibold text-gray-600'>
              Please start the assessment of each sensors when the sensors are ready
            </p>
          </div>

          <div className='flex-grow flex items-center'>
            <MedicalCheckupSteps className='w-full' />
          </div>

          { isFetchSuccessful ? "" : (
                <p className='text-red-500'>Sensor fetch failed, please try again</p>
          ) }

          {isDataFinished? 
            <p>The data collection process has been finished, please close this window</p>
          : sensor
            .filter((_, index) => index + 1 === currentStep)
            .map((element, _) => (
            <button 
              key={currentStep}
              onClick={() => handleStartAssesment(currentStep, element)} 
              disabled={isLoading} // Prevent multiple clicks
              className={`w-72 h-20 rounded-2xl text-white font-bold font-inter 
                text-2xl transition ease-in bg-blue-700 hover:bg-blue-500 flex items-center justify-center 
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `Mulai Pengecekan Sensor ${element}`
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructionPopup;
