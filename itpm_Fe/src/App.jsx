import { Route, Routes } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Contact from "./routes/Contact"
import Home from "./routes/Home"
import About from "./routes/About"
import Services from "./routes/Product"
import Profile from "./routes/Profile"
import Inventory from "./pages/Inventory"
import ProductDetail from './routes/ProductDetail'
import PCBuilder from "./routes/PCBuilder"
import AdminDashboard from './routes/AdminDashboard'
import Auth from './routes/Auth'
import PCBuilderAdmin from './pages/PCBuilderAdmin'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <main className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Product" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/PCBuilder" element={<PCBuilder />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pc-builder-admin" element={<PCBuilderAdmin />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
