import "./styles.css";
import axios from 'axios'
import React, {useState, useEffect} from 'react'


type apiData = any 

export default function App_solve4() {
  const [titles, setTitles] = useState<apiData>([]) 
  const [ids, setIds] = useState<apiData>(0) 



  const fetchData = async () => {
      let response = await axios.get("https://jsonplaceholder.typicode.com/albums/2/photos")
      const getTitle = response.data.map((x: apiData) => {
        return x.title
      })
      const getId = response.data.map((x: apiData) => {
        return x.id
      })

    
      setTitles(getTitle) 
      setIds(getId)
      return response.data
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="App">
      <h1>{titles}</h1> 
      <h4>{ids}</h4> 
    </div>
  );
}
