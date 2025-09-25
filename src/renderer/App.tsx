import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { IdeasInventory } from './ideasInventory';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IdeasInventory />} />
      </Routes>
    </Router>
  );
}
