import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import BottomNav from './components/Bottomnav/Bottomnav.tsx'
import Home from './Pages/Home/Home.tsx'
import AirQuality from './Pages/AirQuality/AirQuality.tsx'
import Transport from './Pages/Transport/Transport.tsx'
import Alerts from './Pages/Alerts/Alerts.tsx'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Rotas das outras páginas — adicionar conforme forem criadas */}
          <Route path="/transporte" element={<Transport />} />
          <Route path="/ar" element={<AirQuality />} />
          <Route path="/alertas" element={<Alerts />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App