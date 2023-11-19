const Page = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0">
            <Form/>
        </div>
    )
}

const Form = () => {
    return (
        <div className="">
            <h1 className="text-4xl">Support Ticket Form</h1>
            <hr />
            <div className="flex">
                <div className="">
                    <h2>Name</h2>
                    <label htmlFor="first-name">First</label>
                    <input type="text" name="first-name" id="first-name" />
                    <label htmlFor="last-name">Last</label>
                    <input type="text" name="last-name" id="last-name" />
                </div>
            </div>
        </div>
    )
}

export default Page