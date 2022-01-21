import React, {useState, useEffect} from 'react' 


type types = {
  target_type: number, 
  generate_target_type: number | number[]
}

interface coord_1_prop {
  x: types["target_type"] 
  y: types["target_type"]  
  generate_fn?: (x: coord_1_prop["x"], 
                 y: coord_1_prop["y"]) => types["generate_target_type"]  
}

interface coord_2_prop {
  x: types["target_type"] 
  y: types["target_type"]  
  z: types["target_type"] 
  generate_fn?: (x: coord_2_prop["x"], 
                 y: coord_2_prop["y"], 
                 z: coord_2_prop["z"]) => types["generate_target_type"]  
}

interface coord_3_prop {
  x: types["target_type"]  
  y: types["target_type"]  
  z: types["target_type"] 
  w: types["target_type"] 
  generate_fn?: (x: coord_3_prop["x"], 
                 y: coord_3_prop["y"], 
                 z: coord_3_prop["z"], 
                 w: coord_3_prop["w"]) => types["generate_target_type"]   
}



interface universe_prop {
  list_cords: coord_1_prop | coord_2_prop | coord_3_prop
}

export default function App_solve2() {
  const [coordinate_one_x, set_coordinate_one_x] = useState<coord_1_prop["x"]>(0)
  const [coordinate_one_y, set_coordinate_one_y] = useState<coord_1_prop["y"]>(0)
  const [coordinate_two_x, set_coordinate_two_x] = useState<coord_2_prop["x"]>(0)
  const [coordinate_two_y, set_coordinate_two_y] = useState<coord_2_prop["y"]>(0)
  const [coordinate_two_z, set_coordinate_two_z] = useState<coord_2_prop["z"]>(0)
  const [coordinate_three_x, set_coordinate_three_x] = useState<coord_3_prop["x"]>(0)
  const [coordinate_three_y, set_coordinate_three_y] = useState<coord_3_prop["y"]>(0)
  const [coordinate_three_z, set_coordinate_three_z] = useState<coord_3_prop["z"]>(0)
  const [coordinate_three_w, set_coordinate_three_w] = useState<coord_3_prop["w"]>(0)


  return (
    <div className="App">
      
    </div>
  );
}