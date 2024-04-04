
const Header = ({course}) => <h1>{course.name}</h1>
const Part = (props) => <p>{props.parte} {props.ejercicio}</p>
const Content = ({course}) => {
  return( 
  <div>
    {course.parts.map(part => <Part key={part.id} parte={part.name} ejercicio={part.exercises} />)}
    <Total course={course}/>
  </div>
  )
}
const Total = ({course}) =>  {
  const total = course.parts.reduce((s, p) =>  s + p.exercises, 0)
  return <strong>Total of {total} exercises</strong> 
}

const Course = ({course}) => {
  return(
  <>
  <Header course={course}/>
  <Content course={course}/>
  </>
  )
} 

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return(<>{courses.map(course => <Course key={course.id} course={course} />)}</>)
}

export default App