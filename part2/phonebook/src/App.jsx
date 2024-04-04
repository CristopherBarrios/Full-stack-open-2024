import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    const nameObject = {
      name: newName
    }

    event.preventDefault()
    persons.some((persons) => persons.name === nameObject.name)
    ? alert(`${newName} is already added to the phonebook`)
    : setPersons(persons.concat(nameObject))
     setNewName('')
  }

  const handleNewname = (event) => {
    setNewName(event.target.value)
    console.log(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNewname}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((nombre, index) => (<p key={index}>{nombre.name}</p>))}

      {/* <div>debug: {newName}</div> */}
    </div>
  )
}

export default App