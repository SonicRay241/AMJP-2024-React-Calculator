"use client"
import { useState } from "react"

const Home = () => {
  return (
    <div className="flex justify-center items-center">
      <Calculator/>
    </div>
  )
}

const Calculator = () => {
  const [num, setNum] = useState(0)
  const numbers = Array.from({length: 9}, (_, i) => i + 1)

  return (
    <div>
      <h1>{num}</h1>
      
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {numbers.map((item, _)=>{
          return <CalcButtonComponent value={item} callback={()=>setNum(num + 1)}/>
        })}
        {/* <CalcButtonComponent value={2} callback={()=>setNum(num + 1)}/> */}
      </div>
    </div>
  )
}

type CalcButtonParam = {
  value: number
  callback: () => void
}

const CalcButtonComponent = ({ value, callback }: CalcButtonParam) => {
  return (
    <div>
      <button onClick={callback}>{value}</button>
    </div>
  )
}

export default Home