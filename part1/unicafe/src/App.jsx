import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>
const Button = ({state, text}) => <button onClick={state}>{text}</button>
const StatisticLine  = ({text,variable}) => <p>{text} {variable}</p>
const Estadistica = ({good,neutral,bad,total,text}) => {

  const average = ((good * 1) + (neutral * 0) + (bad - 1)) / total 
  const positivo = good * 100 / total

  return (total===0)
  ? (
    <>
    <p>{text.nohayvotoText}</p>
    </>
  ) : (
    <>
    <StatisticLine text={text.goodText} variable={good}/>
    <StatisticLine text={text.neutralText} variable={neutral}/>
    <StatisticLine text={text.badText} variable={bad}/>
    <StatisticLine text={text.allText} variable={total}/>
    <StatisticLine text={text.averageText} variable={average}/>
    <StatisticLine text={text.positiveText} variable={positivo + " %"}/>
    </>

  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const unicafes = {
      titulo1: "give feedback",
      titulo2: "statistics",
      goodText: "good",
      neutralText: "neutral",
      badText: "bad",
      allText: "all",
      averageText: "average",
      positiveText: "positive",
      nohayvotoText: "No hay ningun voto"
  };

  const handleGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
  }

  const handleBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
  }

  return (
    <div>
      <Header header={unicafes.titulo1}/>

      <Button state={handleGood} text={unicafes.goodText}/>
      <Button state={handleNeutral} text={unicafes.neutralText}/>
      <Button state={handleBad} text={unicafes.badText}/>

      <Header header={unicafes.titulo2}/>

      <Estadistica good={good} neutral={neutral} bad={bad} total={total} text={unicafes}/>
    </div>
  );
}
export default App