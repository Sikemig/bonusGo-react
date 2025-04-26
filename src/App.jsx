import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index'
//import Login from './components/Login';
import Register from './components/Register';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}