import { useState, useEffect } from 'react'
import axios from 'axios'
// npx json-server --port 3001 --watch db.json
// npm install axios
// npm install json-server --save-dev

const Filter = ({text,value,change}) => <div>{text} <input value={value} onChange={change}/></div>

const PersonForm  = ({addName,valueName,handleNewName,valueNumber,handleNewNumber}) => {
  return(
  <form onSubmit={addName}>
    <div>name: <input value={valueName} onChange={handleNewName} /></div>
    <div>number: <input value={valueNumber} onChange={handleNewNumber} /></div>
    <div><button type="submit">add</button></div>
  </form>
  )
}
const Persons = ({filteredPersons}) => {
  return(
    <>
    {filteredPersons.map((person) => (<p key={person.id}>{person.name} {person.number}</p>))}
    </>
    )}


const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const addName = (event) => {
    event.preventDefault();
    const nameObject = { name: newName, number: newNumber, id: persons.length + 1 };

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`);
    } else {
      setPersons(persons.concat(nameObject));
      setNewName('');
      setNewNumber('');
    }
  };

  const handleNewName = (event) => setNewName(event.target.value);
  const handleNewNumber = (event) => setNewNumber(event.target.value);
  const handleSearchTerm = (event) => setSearchTerm(event.target.value);

  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text={"filter shown with:"} value={searchTerm} change={handleSearchTerm}/>
      
      <h2>add a new</h2>
      <PersonForm addName={addName} valueName={newName} handleNewName={handleNewName} valueNumber={newNumber} handleNewNumber={handleNewNumber}/>


      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>

    </div>
  );
};

export default App;
