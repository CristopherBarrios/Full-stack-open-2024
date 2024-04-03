import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>
const Button = ({state, text}) => <button onClick={state}>{text}</button>

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const titulo1 = "give feedback"
  const titulo2 = "statistics"
  const goodText = "good"
  const neutralText = "neutral"
  const badText = "bad"

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)


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

    </div>
  )
}

export default App