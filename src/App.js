import "./App.css"
import Button from "react-bootstrap/Button"

function App() {
  return (
    <div className="App">
      <div
        size="xxl"
        bg="primary"
        style={{ width: "360px", height: "200px" }}
      ></div>
      <h1>Todo</h1>
      <div className="d-grid gap-2">
        <Button variant="primary" size="lg">
          Block level button
        </Button>
        <Button variant="secondary" size="lg">
          Block level button
        </Button>
      </div>
    </div>
  )
}

export default App
