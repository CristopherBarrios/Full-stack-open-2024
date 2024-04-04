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

export default Course