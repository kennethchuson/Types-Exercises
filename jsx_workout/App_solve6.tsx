import "./styles.css";
import React, {useState} from 'react'


interface type_data {
  id: number, 
  name: string, 
  score: number[] 
}
const data: type_data = [ 
  {
    id: 1, 
    name: "test1",
    score: [3,2,3,1,2]
  },
  {
    id: 2, 
    name: "test2",
    score: [9,2,5,9,10]
  },
  {
    id: 3, 
    name: "test3",
    score: [3,8,1,3,2]
  }, 
  {
    id: 4, 
    name: "test4",
    score: [5,2,1,3,2]
  }
]

export default function App_solve6() {
  const [userInput, setUserInput] = useState<string>("")
  const [choose_number, set_choose_number] = useState<string>("")
  
  return (
    <div className="App">
      {
        data.filter((val: type_data) => val.name.includes(userInput))
        .map((val: type_data) => {
          return (
            <div key={val.id}>
              <li>{val.name}</li>
              <p>[ {val.score.map(scores => scores + ",")} ]</p>
            </div>
          )
        })
      }
      <input onChange={(e) => setUserInput(e.target.value)}/>
      <br/>
      <label>Found numbers</label>
      <select className="custom-select"
        onChange={(e) => {
          set_choose_number(e.target.value)
        }}
      >
        <option value="lessThanTen"> {"< " + 10} </option>
        <option value="moreThanTen"> {"> " + 10} </option>
      </select>
      <br/>
      {
        data.filter((val: type_data) => {
          if (choose_number === "lessThanTen") {
            return val.score.map(scores => scores + 10)
          }
          if (choose_number === "moreThanTen") {
            return val.score.map(scores => scores * 10)
          }
        }).map((val: type_data) => {
          return (
            <div key={val.id}>
              <p>{ val.score }</p>
            </div> 
          )
        }) 
      }
      

    </div>
  );
}