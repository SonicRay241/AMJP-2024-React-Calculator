"use client"

import { useSearchParams } from "next/navigation"
import { decode as base64_decode } from "base-64"

const Page = () => {
    const searchParams = useSearchParams()
    const ticketNumberB64 = searchParams.get("ticketID")
    
    let ticketNumber: number | null = null

    try {
        ticketNumber = (+base64_decode(ticketNumberB64!) - 942) / 696969 
    } catch (error) {
        console.log(ticketNumber);
    }

    if (!ticketNumber || ticketNumber < 0 || ticketNumber % 1 != 0) {
        return (
            <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0">
            <div className="bg-black rounded-lg text-white p-4 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] max-w-xl">
                <h1 className="text-3xl font-semibold mb-2">Support Ticket Form</h1>
                <hr className="border-white mb-4" />
                <div className="text-center py-16">
                    <h2 className="text-amber-500 font-semibold text-2xl">Ticket not found</h2>
                </div>
            </div>
        </div> 
        )
    }
    return (
        <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0">
            <div className="bg-black rounded-lg text-white p-4 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] max-w-xl">
                <h1 className="text-3xl font-semibold mb-2">Support Ticket Form</h1>
                <hr className="border-white mb-4" />
                <div className="text-center py-16">
                    <h2 className="text-amber-500 font-semibold text-2xl">Thank you for sending us your report, we will track the problem now</h2>
                    <br />
                    <p>Ticket number: {ticketNumber}</p>
                </div>
            </div>
        </div>
    )
}

export default Page