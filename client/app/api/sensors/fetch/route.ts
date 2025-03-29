import { NextResponse } from "next/server";

interface RequestBody {
  sensor: string,
  step: number
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json();  

  if (!body.sensor || !body.step) {
    return NextResponse.json({
        success: false,
        error: "Missing json content"
      }, {status: 400})
  }
  
  const { sensor, step } = body;
  
  try {
    const res = await fetch("http://127.0.0.1:8000/api/serial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        current_sensor: sensor,
        current_step: step
      })
    });
    
    if (!res.ok) return NextResponse.json({ success: false, error: "Internal Server Error " }, { status: 500 });

    const data = await res.json();
    const sensorsData = data.sensors_data;

    return NextResponse.json({ success: true, data: sensorsData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
