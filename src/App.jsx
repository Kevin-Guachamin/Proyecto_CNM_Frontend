import './App.css'
import Login from './components/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from './vistas/Inicio.jsx';

function App() {
  return (
    <div className="App-container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </div>
  );
}
export default App;
