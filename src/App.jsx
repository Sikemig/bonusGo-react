import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index'



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}