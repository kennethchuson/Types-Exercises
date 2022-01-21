import React, {useState} from 'react'


type Todo = {
  text: string, 
  complete: boolean 
}

type ToggleTodo = (selectedTodo: Todo) => void

type AddTodo = (newTodo: string) => void

const initialTodos: Array<Todo> = [
  { text: "idk what I am doing", complete: true }, 
  { text: "ok what should I do know", complete: false}
]

interface TodoListItemProps {
  todo: Todo 
  toggleTodo: ToggleTodo 
}

interface AddTodoFormProps {
  addTodo: AddTodo 
}

const TodoListItem:React.FC<TodoListItemProps> = ({ todo, toggleTodo}) => {
  return (
    <div>
      <label style={{textDecoration: todo.complete? "line-through" : "none"}}>
        <input 
          type="checkbox" 
          checked={todo.complete} 
          onChange={() => toggleTodo(todo)}/>
        <h5>{todo.text}</h5> 
      </label>
    </div> 
  )
}

interface TodoListProps {
  todos: Array<Todo>
  toggleTodo: ToggleTodo 
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo }) => {
  return <ul>
        {
          todos.map((todo) => {
            return <TodoListItem key={todo.text} todo={todo} toggleTodo={toggleTodo} />
          })
        }
  </ul>
}

const AddTodoForm:React.FC<AddTodoFormProps> = ({ addTodo }) => {
  const [newTodo, setNewTodo] = useState<string>("")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value) 
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault() 
    addTodo(newTodo) 
    setNewTodo("") 
  }
  return <form>
            <input type="text" value={newTodo} onChange={handleChange}/>
            <button type="submit" onClick={handleSubmit}>Add Todo</button> 
         </form> 
}




const App_solve3 = () => {

  const [todos, setTodos] = useState(initialTodos) 

  const toggleTodo: ToggleTodo = (selectedTodo) => {
    const newTodos = todos.map(todo => {
      if (todo === selectedTodo) {
        return {
          ...todo, 
          complete: !todo.complete 
        }
      }
      return todo 
    })
    setTodos(newTodos) 
  }

  const addTodo: AddTodo = (newTodo) => {
    newTodo.trim() !== "" && setTodos([...todos, { text: newTodo, complete: false}])
  }

  return (
    <div className="App">
       <TodoList todos={todos} toggleTodo={toggleTodo} />
       <AddTodoForm addTodo={addTodo} />
    </div>
  );
}

export default App_solve3