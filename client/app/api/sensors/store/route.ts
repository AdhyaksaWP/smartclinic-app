import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.";

interface RequestBody {
  name: string;
  email: string;
  data: number[];
}

export async function POST(req: Request){
  const body: RequestBody = await req.json();

  if (!body.name || !body.email || !body.data) {
    return NextResponse.json({
        success: false,
        error: "Missing json content"
    }, {status: 400})
  }

  const { name, email, data } = body;
  // Check if the user is authenticated
  const userdb = await prisma.user.findFirst({
    where: {
      fullName: name,
      email: email
    }
  })

  if (!userdb) {
    return NextResponse.json({ success: false, error: "Internal Server Error"}, { status: 500 });
  }

  try{
      const sensordb = await prisma.sensorReadings.create({
      data: {
        height: data[0],
        weight: data[1],
        temperature: data[2],
        heartbeat: data[3],
        oxygenLevel: data[4],
        bloodPresuure: data[5],
        bmi: data[6],
        userId: userdb.id
      }
    })

    if (!sensordb){
      return NextResponse.json({ success: false, error: "Internal Server Error"}, { status: 500 });
    }
    // console.log("Sensors Data Response: ", data);
    return NextResponse.json({ success: true, data: sensordb }, { status: 200 });
  }
  catch (error){
      return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}