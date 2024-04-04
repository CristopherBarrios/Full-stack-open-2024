
const Header = (titu) => <h1>{titu.nombre}</h1>
const Part = (props) => <p>{props.parte} {props.ejercicio}</p>
const Content = (props) => {
  return( 
  <div>
    <Part parte={props.parte[0].name} ejercicio={props.parte[0].exercises}/>
    <Part parte={props.parte[1].name} ejercicio={props.parte[1].exercises}/>
    <Part parte={props.parte[2].name} ejercicio={props.parte[2].exercises}/>
    <Part parte={props.parte[3].name} ejercicio={props.parte[3].exercises}/>
  </div>
  )
}
const Total = (props) =>  <strong>Total of {props.parte[0].exercises + props.parte[1].exercises + props.parte[2].exercises + props.parte[3].exercises} exercises</strong>

const Course = ({course}) => {
  return(
    <>
  <Header nombre={course.name}/>
  <Content parte={course.parts}/>
  <Total parte={course.parts}/>
  </>
  )
} 

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App