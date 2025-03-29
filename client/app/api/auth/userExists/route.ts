import { prisma } from "@/lib/prisma.";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const body: { email: string } = await req.json();

        if (!body.email) {
            return NextResponse.json({
                success: false,
                error: "Missing json content"
            }, {status: 400})
        }
        
        const { email } = body;
        
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        // console.log("user: ", user);
        return NextResponse.json({user});
    } catch (error) {
        console.log(error);
    }
}
