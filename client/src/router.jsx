import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Requirements from './pages/Requirements'
import ResetPassword from './pages/ResetPassword'

export default function App({ Protected }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/requirements" element={<Protected><Requirements /></Protected>} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}
