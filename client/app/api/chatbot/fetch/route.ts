import { prisma } from "@/lib/prisma.";
import { NextResponse } from "next/server";

interface RequestBody {
    name: string,
    email: string,
}

export async function POST(req: Request){
    const body: RequestBody = await req.json();

    if (!body.name || body.email) {
        return NextResponse.json({
            success: false,
            error: "Missing json content"
        }, {status: 400})
    }

    const { name, email } = body;

    const userdb = await prisma.user.findFirst({
        where: {
            fullName: name,
            email: email
        }
    })

    if (!userdb){
        console.log("Userdb: ", userdb);
        return NextResponse.json({ 
            success: false,
            error: "Internal Server Error"
        }, { status: 500 })
    }

    console.log("Userdb id: ", userdb.id);
    
    const sensordb = await prisma.sensorReadings.findFirst({
        where:{
            userId: userdb.id
        }
    });

    if (!sensordb){
        console.log("Sensordb: ", sensordb);
        return NextResponse.json({ 
            success: false,
            error: "Internal Server Error"
        }, { status: 500 })
    }

    let sensors_data: Object = {}
    for (let key in sensordb){
        if (sensordb.hasOwnProperty(key) && 
            key != "id" && 
            key != "height" && 
            key != "weight" && 
            key != "userId"
        ){
            sensors_data[key] = sensordb[key];
        }
    }

    console.log(sensors_data);
    
    return NextResponse.json({ 
        success: true,
        data: sensors_data
    }, { status: 200 })
}