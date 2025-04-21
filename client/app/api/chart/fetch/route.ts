import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.";

interface RequestBody {
    name: string,
    email: string
}

export async function POST(req: Request){
    const body: RequestBody = await req.json();

    if (!body.name || !body.email) {
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

    if (!userdb) {
        return NextResponse.json({ success: false, error: "Internal Server Error"}, { status: 500 });
    }

    try{
        const results = await prisma.sensorReadings.findMany({
            where: {
                userId: userdb.id
            },
            take: 4
        })
        // console.log(results);
        return NextResponse.json({message: results}, {status: 200})
    }
    catch {
        return NextResponse.json({message: "An Error has Happened"}, {status: 400})
    }
}