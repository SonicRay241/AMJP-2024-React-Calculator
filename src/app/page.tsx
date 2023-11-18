"use client"

import { useState } from "react"

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Calculator/>
    </div>
  )
}

type TCalcButtonParam = {
  value: string
  callback: () => void
}

const numbers = "1234567890"

type TCalcOperations = "+" | "-" | "*" | "/" | null
type TCalcState = "leftNum" | "rightNum" | "operation" | "result"

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0")
  const [history, setHistory] = useState<number[]>([])

  let numberLeft: number, numberRight: number, operation: TCalcOperations, result: number
  let calculatorState: TCalcState = "leftNum"

  const createButton: (value: string) => TCalcButtonParam = (value: string) => {
    return { value: value, callback: () => { processCalcLogic(value) } }
  }

  const processCalcLogic = (buttonValue: string) => {
    switch (buttonValue) {
      case "C":
        if (calculatorState == "result") {
          setHistory([...history, result])
        }
        setDisplayValue("0")
        calculatorState = "leftNum"
        break;
      case "DEL":
        setDisplayValue(displayValue.replace(/.$/, ""))
        if (displayValue == "") setDisplayValue("0")
        break;
      default:
        if (numbers.includes(buttonValue)) {
          setDisplayValue((+(displayValue+buttonValue)).toString())
        }
        break;
    }
  }

  const buttons: string[] = ["C", "DEL", "?", "/", "1", "2", "3", "x", "4", "5", "6", "-", "7", "8", "9", "+", "0", "="]

  return (
    <div>
      {
        history.map((value, _) => {
          return <h1>{value}</h1>
        })
      }
      <h1>{displayValue}</h1>
      
      <div className="grid grid-cols-4 grid-rows-4 gap-4">
        {
          buttons.map((value, _) => {
            const button: TCalcButtonParam = createButton(value)
            return <CalcButtonComponent value={button.value} callback={button.callback}/>
          })
        }
      </div>
    </div>
  )
}


const CalcButtonComponent = ({ value, callback }: TCalcButtonParam) => {
  return (
    <div>
      <button onClick={callback}>{value}</button>
    </div>
  )
}

export default Home