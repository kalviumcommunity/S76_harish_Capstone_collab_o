import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Freelance from './pages/Freelance';
import Modules from './pages/Modules';
import LearningUnit from './pages/LearningUint';

function App() {
 

  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={< Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/freelance" element={<Freelance/>} />
            <Route path="/modules" element={<Modules/>} />
            <Route path="/learning" element={<LearningUnit/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
