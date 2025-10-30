import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Freelance from './pages/Freelance';
import Modules from './pages/Modules';
import LearningUnit from './pages/LearningUint';
// import Quiz from './pages/Quiz';
import ClientForm from './pages/ClientFrom';
import CourseCreation from './pages/CourseCreation';

import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';

import { AuthProvider } from './AuthContext';

import ClientDashboard from './pages/ClientDash/ClientDashboard';

import ProposalsPage from './pages/ClientDash/ProposalPage';
import ChatPage from './pages/Messaging/ChatPage';
// import MessagingPage from './pages/MessagingPage';  
// import Message from  './pages/freelancerDashboard/Message'

import FreelancerDash from './pages/freelancerDashboard/FreelancerDashboard';
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
            {/* <Route path="/quiz" element={<Quiz/>} /> */}
            <Route path="/clientForm" element={<ClientForm/>} />
            <Route path="/clientForm/:id" element={<ClientForm/>} />
            <Route path="/clientDashBoard" element={<ClientDashboard/>} />
            <Route path="/courseCreation" element={<CourseCreation/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile/:userId" element={<PublicProfile/>} />
            <Route path="/projects/:projectId/" element={<ProposalsPage />} />
            <Route path="/freelancerDashboard" element={<FreelancerDash />} />
            <Route path="/messages/chat/:proposalId" element={<ChatPage />} />
             {/* <Route path="/messages" element={<Message />} /> */}
            
          </Routes>

        </Router>
        </AuthProvider>
    </>
  )
}

export default App
