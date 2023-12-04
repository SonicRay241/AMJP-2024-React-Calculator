"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { encode as base64_encode } from 'base-64';
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const Page = () => {
    const { push } = useRouter()

    return (
        <div className="w-screen h-screen">
            <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0">
                <div className="bg-black rounded-lg text-white p-4 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
                    <h1 className="text-3xl font-semibold mb-2">Support Ticket Form</h1>
                    <hr className="border-white mb-4" />
                    <Form/>
                </div>
            </div>
            <button className="absolute top-4 left-3 flex items-center bg-white rounded-lg p-2 pr-3 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] border-black border-2" onClick={()=>{ push("/") }}>
                <span className="text-black">
                    <svg className="w-3 h-3 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
                    </svg>
                </span>
                <span className="text-lg ml-2 text-black">
                    Back
                </span>
            </button>
        </div>
    )
}

type TTopicSelection = "general" | "bug"

const Form = () => {
    const [firstNameValue, setFirstNameValue] = useState("")
    const [lastNameValue, setLastNameValue] = useState("")
    const [emailValue, setEmailValue] = useState("")
    const [topicValue, setTopicValue] = useState<TTopicSelection>("general")
    const [descriptionValue, setDescriptionValue] = useState("")
    const [submitButtonColor, setSubmitButtonColor] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { push } = useRouter()

    const submitButtonRef = useRef<HTMLButtonElement>(null)

    // simulates data sending
    const sendData = (firstName: string, lastName: string, email: string, topic: TTopicSelection, description: string) => {
        return new Promise<string>((resolve, reject) => {
            if (firstNameValue == "" || lastNameValue == "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailValue)){
                reject("required field is empty")
            }
            
            setTimeout(
                () => {
                    const random: boolean = Math.random() < 0.5
                    let randTicket = Math.floor(Math.random() * 10000)
                    randTicket = randTicket * 696969 + 942
                    if (random) {
                        console.log(firstName);
                        console.log(lastName);
                        console.log(email);
                        console.log(topic);
                        console.log(description);
                        resolve("sent")
                        setTimeout(() => {
                            push(`/support/ticket?ticketID=${base64_encode(randTicket.toString())}`)
                        }, 1000)
                    } else {
                        reject("failed to send")
                    }
                }
            , 3000)
        })
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        toast.promise(
            sendData(firstNameValue, lastNameValue, emailValue, topicValue, descriptionValue),
            {
                loading: "Sending ticket...",
                success: () => {
                    return "Ticket sent!"
                },
                error: () => {
                    setIsLoading(false)
                    return "Failed to send ticket!"
                },
            }
        )
    }

    useEffect(() => {
        if (firstNameValue != "" && lastNameValue != "" && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailValue)) {
            setSubmitButtonColor("bg-amber-500")
            try {
                submitButtonRef.current!.disabled = false
            } 
            catch {
                console.log("cannot find submit button");
            }
            if (isLoading) {
                setSubmitButtonColor("bg-gray-600")
                try {
                    submitButtonRef.current!.disabled = true
                } 
                catch {
                    console.log("cannot find submit button");
                }
            } else {
                setSubmitButtonColor("bg-amber-500")
                try {
                    submitButtonRef.current!.disabled = false
                } 
                catch {
                    console.log("cannot find submit button");
                }
            }
        } else {
            setSubmitButtonColor("bg-gray-600")
            try {
                submitButtonRef.current!.disabled = true
            } 
            catch {
                console.log("cannot find submit button");
            }
        }
    })
    return (
        <form className="" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12 mb-2">
                <div className="w-96 lg:w-96 sm:w-72">
                    <h2 className="text-lg">Name<span className="text-red-600">*</span></h2>
                    <div className="flex gap-4 mb-2">
                        <div className="">
                            <input type="text" name="firstName" id="firstName" 
                                className="bg-black outline-none border border-white rounded-md w-full focus:border-amber-500 p-1"
                                value={firstNameValue}
                                onChange={(e) => { setFirstNameValue(e.target.value) }}
                            />
                            <br />
                            <label htmlFor="firstName" className="text-gray-300 text-sm">First</label>
                        </div>
                        <div className="">
                            <input type="text" name="lastName" id="lastName" 
                                className="bg-black outline-none border border-white rounded-md w-full focus:border-amber-500 p-1"
                                value={lastNameValue}
                                onChange={(e) => { setLastNameValue(e.target.value) }}
                            />
                            <br />
                            <label htmlFor="lastName" className="text-gray-300 text-sm">Last</label>
                        </div>
                    </div>
                    <h2 className="text-lg">Email<span className="text-red-600">*</span></h2>
                    <input type="text" name="email" id="email" 
                        className="bg-black outline-none border border-white rounded-md w-full focus:border-amber-500 p-1 mb-4"
                        value={emailValue}
                        onChange={(e) => { setEmailValue(e.target.value) }}
                    />
                    <h2 className="text-lg">Topic<span className="text-red-600">*</span></h2>
                    <div className="w-full border border-dashed p-4 rounded-md">
                        <h2 className="text-md mb-2">What can we help you today?<span className="text-red-600">*</span></h2>
                        <input type="radio" name="radioSelection" id="radiGeneral" className="mr-2 accent-amber-500" defaultChecked
                            onClick={() => { setTopicValue("general") }}
                        />
                        <label htmlFor="radioGeneral" className="text-sm">General</label>
                        <br />
                        <input type="radio" name="radioSelection" id="radioBug" className="mr-2 accent-amber-500" 
                            onClick={() => { setTopicValue("bug") }}
                        />
                        <label htmlFor="radioBug" className="text-sm">Bug</label>
                    </div>
                </div>
                <div className="w-96 lg:w-96 sm:w-72">
                    <h2 className="text-lg">Description <sup className="text-gray-300">optional</sup></h2>
                    <textarea name="description" id="description" placeholder="Description Report" className="bg-black resize-none border border-white focus:border-amber-500 rounded-md outline-none w-full h-32 sm:h-72 p-2"
                        value={descriptionValue}
                        onChange={(e) => { setDescriptionValue(e.target.value) }}
                    />
                </div>
            </div>
            <div className="flex flex-row-reverse w-full">
                <button className={`flex justify-center py-1 ${submitButtonColor} rounded-full text-xl w-24`} ref={submitButtonRef}>
                    <SubmitButtonInnerHTML loading={ isLoading }/>
                </button>
            </div>
        </form>
    )
}
type TSubmitButtonInnerHTMLProps = {
    loading: boolean
}
const SubmitButtonInnerHTML = ({ loading }: TSubmitButtonInnerHTMLProps) => {
    if (loading) {
        return (
            <span>
                <svg aria-hidden="true" className="w-7 h-7 animate-spin text-white fill-gray-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </span>
        )
    }
    return (
        <span>SEND</span>
    )
}

export default Page