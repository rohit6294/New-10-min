import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useScrollReveal from './useScrollReveal'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Trust from './components/Trust'
import Comparison from './components/Comparison'
import Demo from './components/Demo'
import CTA from './components/CTA'
import Footer from './components/Footer'
import StickyBar from './components/StickyBar'
import ResumeBanner from './components/ResumeBanner'
import HospitalLogin from './pages/HospitalLogin'
import HospitalDashboard from './pages/HospitalDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SosPage from './pages/SosPage'
import CallbackPage from './pages/CallbackPage'
import TrackPage from './pages/TrackPage'
import FleetLogin from './pages/FleetLogin'
import FleetDashboard from './pages/FleetDashboard'

function LandingPage() {
  useScrollReveal()
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <ResumeBanner />
      <Hero />
      <HowItWorks />
      <Features />
      <Trust />
      <Comparison />
      <Demo />
      <CTA />
      <Footer />
      <StickyBar />
      <div className="h-20 md:hidden" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hospital" element={<HospitalLogin />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/fleet" element={<FleetLogin />} />
        <Route path="/fleet/dashboard" element={<FleetDashboard />} />
        <Route path="/sos" element={<SosPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/track/:requestId" element={<TrackPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
