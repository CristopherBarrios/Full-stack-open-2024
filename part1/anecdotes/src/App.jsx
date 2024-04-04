import { useState } from 'react'

const Button = ({manejo,text}) => <button onClick={manejo}>{text}</button>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const texto = {
    titulo: "Anecdote of the day",
    titulo2: "Anecdote with most votes",
    boton: "next anecdote",
    votar: "vote",
    tiene: "has",
    votos: "votes"
  }

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const numeroMayor = points.indexOf(Math.max(...points))

  const handleAleatorio = () => setSelected(Math.floor(Math.random() * ((anecdotes.length) - 0) + 0))
  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <h1>{texto.titulo}</h1>
      {anecdotes[selected]}
      <br/>
      {texto.tiene} {points[selected]} {texto.votos}
      <br/>
      <Button manejo={handleVote} text={texto.votar}/>
      <Button manejo={handleAleatorio} text={texto.boton}/>

      <h1>{texto.titulo2}</h1>
      <br/>
      {anecdotes[numeroMayor]}
    </div>
  )
}

export default App