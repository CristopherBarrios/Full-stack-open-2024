import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { 
      name: 'Arto Hellas',
      phone: '040-1234567'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    const nameObject = {
      name: newName,
      phone: newNumber
    }

    event.preventDefault()
    persons.some((persons) => persons.name === nameObject.name)
    ? alert(`${newName} is already added to the phonebook`)
    : setPersons(persons.concat(nameObject))
     setNewName('')
     setNewNumber('')
  }

  const handleNewName = (event) => setNewName(event.target.value)
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value); 
    console.log(event.target.value);}
  

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>name: <input value={newName} onChange={handleNewName}/></div>
        <div>number: <input value={newNumber} onChange={handleNewNumber}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((nombre, index) => (<p key={index}>{nombre.name} {nombre.phone}</p>))}

      {/* <div>debug: {newName}</div> */}
    </div>
  )
}

export default App