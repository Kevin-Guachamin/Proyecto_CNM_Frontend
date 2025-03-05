import './App.css'
import Login from './components/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App-container">
      <Routes>
        <Route path="/" element={<Login />} />
        
      </Routes>
    </div>
  );
}
export default App;
