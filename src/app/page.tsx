"use client"

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from "react"

const Home = () => {
  return (
    <div className="w-screen h-screen">
      <div className="absolute w-screen top-0 left-0 pt-40 text-gray-900 text-6xl text-center font-semibold">
        <h1>Calculator</h1>
      </div>
      <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0">
        <Calculator/>
      </div>
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

  // const historyBottomElementRef = useRef<HTMLDivElement>(null)
  const historyElementRef = useRef<HTMLDivElement>(null)
  const displayElementRef = useRef<HTMLDivElement>(null)

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
        const display = displayValue.replace(/.$/, "")
        if (calculatorState == "result") {
          setHistory([...history, result])
          numberLeft = +display
          setCalculatorState("leftNum")
        }
        if (calculatorState == "leftNum" || calculatorState == "rightNum") {
          numberRight = +display
          if (calculatorState == "leftNum") {
            numberLeft = +display
          }
        }
        if (calculatorState == "operation") {
          setCalculatorState("leftNum")
          setDisplayValue(numberLeft.toString())
        } else setDisplayValue(display == "" ? "0" : display)
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
        // toast("hi!")
        break

      default:
        if (numbers.includes(buttonValue)) {
          if (calculatorState == "result") {
            setHistory([...history, result])
            console.log(`buttonValue = ${buttonValue}`);
            
            setDisplayValue(buttonValue)
            numberLeft = +buttonValue
            numberRight = +buttonValue
            setCalculatorState("leftNum")
          }
          if (calculatorState == "leftNum") {
            numberLeft = +(displayValue+buttonValue)
            numberRight = +(displayValue+buttonValue)
            setDisplayValue(numberLeft.toString())
          }
          if (calculatorState == "operation") {
            setCalculatorState("rightNum")
            if (operations.includes(displayValue[0])) {
              numberRight = +buttonValue
              setDisplayValue(numberRight.toString())
            } else {
              numberRight = +(displayValue+buttonValue)
              setDisplayValue(numberRight.toString())
            }
          }
          if (calculatorState == "rightNum") {
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
  }

  const buttons: string[] = ["C", "DEL", "?", "/", "1", "2", "3", "x", "4", "5", "6", "-", "7", "8", "9", "+", "0", "="]

  useEffect(()=>{
    historyElementRef.current!.scrollTo(0, 32*history.length + 12)
    displayElementRef.current!.scrollLeft += displayElementRef.current!.clientWidth
  })

  return (
    <div className="rounded-3xl shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] w-80 text-white">
      <div className="bg-zinc-600 h-30 rounded-t-2xl">
        <div className="h-20 pt-4 px-4 text-2xl overflow-auto no-scrollbar" ref={historyElementRef}>
          {
            history.map((value, key) => {
              return <h1 key={key}>{value}</h1>
            })
          }
          <div className="h-3"></div>
        </div>
        
        {/* <h1>{calculatorState}</h1> */}
        <div className="overflow-x-auto scrollbar-translucent px-4 pb-2" ref={displayElementRef}>
          <h1 className="text-end text-6xl">{displayValue}</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 relative w-80 h-96 bg-black p-4 rounded-b-2xl">
        {
          buttons.map((value, idx) => {
            const button: TCalcButtonParam = createButton(value, idx < 16 ? 1 : 2, ((idx+1) % 4 == 0 || idx == 17) ? "orange" : idx == 2 ? "brown" : "gray")
            return <CalcButtonComponent key={idx} value={button.value} callback={button.callback} width={button.width} color={button.color}/>
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
    case "gray": btnColor = "bg-gray-500 active:text-gray-500"; break
    case "brown": btnColor = "bg-[#866242] active:text-[#866242]"; break
    case "orange": btnColor = "bg-amber-500 active:text-amber-500"; break
  }
  return (
    <button className={`${elementWidth} rounded-full text-xl ${btnColor} active:bg-white`} onClick={callback}>{value}</button>
  )
}

export default Home