import "./styles.css";
import React from 'react'



const HeadingTwopart1 = ({ title2, name2 }: { title2: string, name2: string }) => {
  return (
      <h3>{title2} {name2}!</h3>
  )
}

const HeadingTwopart2 = ({ title3, name3 }: { title3: string, name3: string }) => {
  return (
      <h3>{title3} {name3} <h3 style={{color: "purple"}}>and I see you next time!</h3></h3>
  )
}

const HeadingOne = ({ title, name }: {title: string, name: string}) => {
  const greetings_list: string[] = [
    "hello", "hi", "hi there", "yo", "hey" 
  ]
  return (
    <>
    {
      greetings_list.find(greeting => { 

        return (greeting.includes(title))? true : false

      })? <HeadingTwopart1 title2={title} name2={name} /> : <HeadingTwopart2 title3={title} name3={name}/>
    }
    </>
  )
}





export default function App_solve5() {
  return (
    <div className="App">
        <HeadingOne title="there" name="testName" />

    </div>
  );
}
