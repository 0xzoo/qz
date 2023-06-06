import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
// import { Q } from './pages/Q';
// import { A } from './pages/A';


export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      {/* <Route path='/q/:id' element={<Q />} /> */}
      {/* <Route path='/a/:username/:id' element={<A />} /> */}
    </Routes>
  )
};