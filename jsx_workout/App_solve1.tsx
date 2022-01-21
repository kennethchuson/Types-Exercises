import React, {useState} from 'react' 



interface props {
  counting: {
    counting2: {
      count: number, 
      info: string
      list_count: number[] 
    }
  }
}

export default function App_solve1() {
  const [counter, setCounter] = useState<props["counting"]["counting2"]>({count: 0, info: "", list_count: []}) 
  const func_click = () => {
    setCounter({
      count: counter.count + 1, 
      info: "has been clicked", 
      list_count: [...counter.list_count, counter.list_count.length + 1]
    })
  }
  return (
    <div className="App">
      <h1>{counter.count}</h1> 
      <h1>{counter.info}</h1> 
      <h1>{counter.list_count}</h1> 
      <button onClick={func_click}>+</button> 
      <div>
        {
          counter.count >= 5 && counter.count <= 10? <h1 style={{color: "yellow"}}>medium high</h1> : null
        }
        {
          counter.count >= 10? <h1 style={{color: "red"}}>high</h1> : null
        }
      </div>
    </div>
  );
}
