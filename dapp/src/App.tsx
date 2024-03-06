import { Body } from "./components/body"
import { Header } from "./components/header"

function App() {
  return (
    <div className="bg-gray-800 flex flex-col w-screen h-screen">
      <Header />

      <Body />
    </div>
  )
}

export default App
