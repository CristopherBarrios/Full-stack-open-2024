import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>
const Button = ({state, text}) => <button onClick={state}>{text}</button>
const Estadistica = ({good,neutral,bad,total,averageText,positiveText}) => {

  const average = ((good * 1) + (neutral * 0) + (bad - 1)) / total 
  const positivo = good * 100 / total

  return (total===0)
  ? (
    <>
    <p>{averageText} No hay ningun voto</p>
    <p>{positiveText} No hay ningun voto</p>
    </>
  ) : (
    <>
    <p>{averageText} {average}</p>
    <p>{positiveText} {positivo} %</p>
    </>

  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const titulo1 = "give feedback"
  const titulo2 = "statistics"
  const goodText = "good"
  const neutralText = "neutral"
  const badText = "bad"
  const allText = "all"
  const averageText = "average"
  const positiveText = "positive"


  const handleGood = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }
  const handleBad = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }


  return (
    <div>
      <Header header={titulo1}/>

      <Button state={handleGood} text={goodText}/>
      <Button state={handleNeutral} text={neutralText}/>
      <Button state={handleBad} text={badText}/>

      <Header header={titulo2}/>

      <p>{goodText} {good}</p>
      <p>{neutralText} {neutral}</p>
      <p>{badText} {bad}</p>
      <p>{allText} {total}</p>
      <Estadistica good={good} neutral={neutral} bad={bad} total={total} averageText={averageText} positiveText={positiveText}/>


    </div>
  )
}

export default App