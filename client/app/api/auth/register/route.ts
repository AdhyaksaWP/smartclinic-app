import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.";
import bcrypt from "bcryptjs";

interface RequestBody {
    fullName: string, email: string, password: string, birthDate: Date
}

export async function POST(req: Request) {
    try {
        const body: RequestBody = await req.json();
        // console.log(body);

        if (!body.fullName || !body.email || !body.password || !body.birthDate) {
            return NextResponse.json({
                success: false,
                error: "Missing json content"
            }, {status: 400})
        }

        const { fullName, email, password, birthDate } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const register = await prisma.user.create({
            data: { 
                fullName: fullName, 
                email: email, 
                password: hashedPassword, 
                birthDate: new Date(birthDate),
                // patientNumber, receiptsId, and timeStamp will be handled later
            }
        });

        if (!register){
            console.log("User not registered!", register);
            return NextResponse.json({ message: "An error has happened while registering" }, { status: 500 });    
        }

        return NextResponse.json({ message: "User Registered" }, { status: 201 });
    } catch (error) {
        console.error("Error during registration", error);
        return NextResponse.json({ message: "An error has happened while registering" }, { status: 500 });
    }
}
