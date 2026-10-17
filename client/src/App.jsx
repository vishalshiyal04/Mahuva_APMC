
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getAuth } from './api.js';
import { PAGES } from './constants.js';
import useMaintenance from './hooks/useMaintenance.js';
import Navbar from './components/Navbar.jsx';
import SubNav from './components/SubNav.jsx';
import Footer from './components/Footer.jsx';
import Guard from './components/Guard.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Farmer from './pages/Farmer.jsx';
import Trader from './pages/Trader.jsx';
import Admin from './pages/Admin.jsx';
import AgentDash from './pages/AgentDash.jsx';
import News from './pages/News.jsx';
import Arrivals from './pages/Arrivals.jsx';
import Licensees from './pages/Licensees.jsx';
import Gallery from './pages/Gallery.jsx';
import Videos from './pages/Videos.jsx';
import Info from './pages/Info.jsx';
import Profile from './pages/Profile.jsx';
import Maintenance from './pages/Maintenance.jsx';
import FarmerAssistant from './components/FarmerAssistant.jsx';
import './assistant.css';

export default function App() {
  const m = useMaintenance();
  const { pathname } = useLocation();
  const isAdmin = getAuth()?.user?.role === 'admin';
if (m.ready && isAdmin && pathname === '/maintenance-preview') return <Maintenance m={{ ...m, down: false, retry: () => {} }} preview />;
  if (m.down) return <Maintenance m={m} />;                                    // સર્વર સમસ્યા: બધા માટે
  if (m.on && !isAdmin) {                                                       // મેન્ટેનન્સ: એડમિન સિવાય બધા માટે
    return pathname === '/login'
      ? <div className="mt"><div className="mt-login"><Auth mode="login" /><Link className="mt-back" to="/">← પાછા</Link></div></div>
      : <Maintenance m={m} />;
  }

  return (
    <>
   {m.on && (
  <div className="mt-banner">
    🚧 મેન્ટેનન્સ મોડ ચાલુ છે. તમે એડમિન તરીકે સાઇટ જોઈ રહ્યા છો, બાકી બધાને મેન્ટેનન્સ પેજ દેખાય છે.{' '}
    <Link to="/maintenance-preview">👁 યુઝર વ્યૂ જુઓ</Link> <Link to="/admin">બંધ કરો →</Link>
  </div>
)}
      <Navbar />
      <SubNav />
      <main className={pathname.startsWith('/admin') ? 'admin-page' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/arrivals" element={<Arrivals />} />
          <Route path="/licensees" element={<Licensees />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          {PAGES.map(p => <Route key={p.slug} path={'/' + p.slug} element={<Info key={p.slug} slug={p.slug} />} />)}
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/farmer" element={<Guard role="farmer"><Farmer /></Guard>} />
          <Route path="/trader" element={<Guard role="trader"><Trader /></Guard>} />
          <Route path="/agent" element={<Guard role="agent"><AgentDash /></Guard>} />
          <Route path="/admin/*" element={<Guard role="admin"><Admin /></Guard>} />
        </Routes>
        
      </main>
      <FarmerAssistant />
      <Footer />
    </>
  );
}