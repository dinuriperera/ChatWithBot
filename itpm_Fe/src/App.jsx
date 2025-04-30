import { BrowserRouter, Route } from "react-router"
import Navbar from "./Components/Navbar"
import Contact from "./routes/Contact"
import Home from "./routes/Home"
import About from "./routes/About"
import Services from "./routes/Product"
import { Routes } from "react-router-dom"
import Profile from "./routes/Profile"
import Inventory from "./Pages/Inventory"
import ProductDetail from './routes/ProductDetail'
import PCBuilder from "./routes/PCBuilder"
import AdminDashboard from './routes/AdminDashboard'
import Auth from './routes/Auth'

function App() {
  return (
    <>
    <Navbar />
    
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
    </Routes>
    
    </>
  )
}

export default App
