import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Freelance from './pages/Freelance';
import Modules from './pages/Modules';
import LearningUnit from './pages/LearningUint';
import Quiz from './pages/Quiz';
import ClientForm from './pages/ClientFrom';
import CourseCreation from './pages/CourseCreation';

import { AuthProvider } from './AuthProvider';

import ClientDashboard from './pages/ClientDashboard';

function App() {
 

  return (
    <>
        <AuthProvider>
      <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={< Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/freelance" element={<Freelance/>} />
            <Route path="/modules" element={<Modules/>} />
            <Route path="/learning" element={<LearningUnit/>} />
            <Route path="/quiz" element={<Quiz/>} />
            <Route path="/clientForm" element={<ClientForm/>} />
            <Route path="/clientDashBoard" element={<ClientDashboard/>} />
            <Route path="/courseCreation" element={<CourseCreation/>} />
          </Routes>

        </Router>
        </AuthProvider>
    </>
  )
}

export default App
