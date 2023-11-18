"use client"

import { useRouter } from 'next/navigation';
import { useState } from "react"

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Calculator/>
    </div>
  )
}

const numbers = "1234567890"
const operations = "+-x/"
type TCalcOperations = "+" | "-" | "x" | "/" | null
type TCalcState = "leftNum" | "rightNum" | "operation" | "result"
type TButtonColor = "gray" | "orange" | "brown"

type TCalcButtonParam = {
  value: string
  callback: () => void
  width: number
  color: TButtonColor
}

let numberLeft: number = 0, numberRight: number, operation: TCalcOperations, result: string

const Calculator = () => {
  const { push } = useRouter()

  const [displayValue, setDisplayValue] = useState("0")
  const [history, setHistory] = useState<string[]>([])
  const [calculatorState, setCalculatorState] = useState<TCalcState>("leftNum")

  const createButton = (value: string, width: number = 1, color: TButtonColor = "gray") => {
    return { value: value, callback: () => { processCalcLogic(value) }, width: width, color }
  }

  const calculate: () => string = () => {
    let result: string
    switch (operation) {
      case "+": 
        result = (+(numberLeft + numberRight)).toString()
        break

      case "-": 
        result = (+(numberLeft - numberRight)).toString()
        break

      case "x": 
        result = (+(numberLeft * numberRight)).toString()
        break

      case "/": 
        result = (+(numberLeft / numberRight)).toString()
        break

        

      default:
        return "Err"
    }
    if (result == "Infinity" || result == "NaN") return "Err"
    return result
  }

  const processCalcLogic = (buttonValue: string) => {
    switch (buttonValue) {
      case "C":
        if (calculatorState == "result") {
          setHistory([...history, result])
        }
        setDisplayValue("0")
        // calculatorState = "leftNum"
        setCalculatorState("leftNum")
        break

      case "DEL":
        if (calculatorState == "result") {
          setHistory([...history, result])
          setCalculatorState("leftNum")
        }
        const display = displayValue.replace(/.$/, "")
        setDisplayValue(display == "" ? "0" : display)
        break

      case "=":
        if (calculatorState == "rightNum") {
          result = calculate()
          setCalculatorState("result")
          setDisplayValue(result)
        }
        break

      case "?":
        push("/support")
        break

      default:
        if (numbers.includes(buttonValue)) {
          if (calculatorState == "result") {
            setHistory([...history, result])
            setDisplayValue(buttonValue)
            numberLeft = +buttonValue
            setCalculatorState("leftNum")
          }
          if (calculatorState == "leftNum") {
            numberLeft = +(displayValue+buttonValue)
            numberRight = +(displayValue+buttonValue)
            setDisplayValue(numberLeft.toString())
          }
          if (calculatorState == "operation") setCalculatorState("rightNum")

          if (operations.includes(displayValue[0]) && calculatorState == "operation") {
            numberRight = +buttonValue
            setDisplayValue(numberRight.toString())
          } else {
            numberRight = +(displayValue+buttonValue)
            setDisplayValue(numberRight.toString())
          }
          
        }
        if (operations.includes(buttonValue)) {
          if (calculatorState == "leftNum") setCalculatorState("operation")
          // if calculatorstate == rightnum, calculate first and move the result to firstnum then return to operation state
          if (calculatorState == "rightNum" || calculatorState == "result") {
            let calculation = calculate()
            if (calculation == "Err") {
              numberLeft = 0
            } else numberLeft = +calculation
            if (calculatorState == "result") setHistory([...history, calculation])
            setCalculatorState("operation")
          }
          operation = buttonValue as TCalcOperations
          setDisplayValue(buttonValue)
        }

        break
    }

    // console.log(numberLeft);
    // console.log(numberRight);
    // console.log(operation);
    
  }

  const buttons: string[] = ["C", "DEL", "?", "/", "1", "2", "3", "x", "4", "5", "6", "-", "7", "8", "9", "+", "0", "="]

  return (
    <div className="rounded-3xl pb-4">
      <div className="bg-zinc-600 h-30 rounded-t-3xl">
        <div className="h-20 pt-4 px-4 text-2xl overflow-auto no-scrollbar">
          {
            history.map((value, _) => {
              return <h1>{value}</h1>
            })
          }
        </div>
        
        {/* <h1>{calculatorState}</h1> */}
        <h1 className="text-end text-6xl px-4 pb-2">{displayValue}</h1>
      </div>
      <div className="grid grid-cols-4 gap-4 relative w-80 h-96 bg-black p-4 rounded-b-3xl">
        {
          buttons.map((value, idx) => {
            const button: TCalcButtonParam = createButton(value, idx < 16 ? 1 : 2, ((idx+1) % 4 == 0 || idx == 17) ? "orange" : idx == 2 ? "brown" : "gray")
            return <CalcButtonComponent value={button.value} callback={button.callback} width={button.width} color={button.color}/>
          })
        }
      </div>
    </div>
  )
}


const CalcButtonComponent = ({ value, callback, width, color }: TCalcButtonParam) => {
  let elementWidth = `col-span-1`
  if (width == 2) {
    elementWidth = `col-span-2`
  }
  let btnColor: string
  switch (color) {
    case "gray": btnColor = "bg-gray-500"; break
    case "brown": btnColor = "bg-[#866242]"; break
    case "orange": btnColor = "bg-amber-500"; break
  }
  return (
      <button className={`${elementWidth} rounded-full text-xl ${btnColor}`} onClick={callback}>{value}</button>
  )
}

export default Home