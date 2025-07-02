import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import PartitsPage from './components/Partits/PartitsPage';
import JugadorsPage from './components/Jugadors/JugadorsPage';
import ArbitresPage from './components/Arbitres/ArbitresPage';
import ClubsPage from './components/Clubs/ClubsPage';
import EstadisPage from './components/Estadis/EstadisPage';
import CompeticionsPage from './components/Competicions/CompeticionsPage';
import JugadorDetail from './components/Jugadors/JugadorDetail';
import ClubDetail from './components/Clubs/ClubDetail';
import PartitDetail from './components/Partits/PartitDetail';
import EstadisDetail from './components/Estadis/EstadisDetails';
import CompeticionsDetail from './components/Competicions/CompeticionsDetail';
import ArbitreDetail from './components/Arbitres/ArbitreDetail';
import AdminLogin from "./components/Admin/AdminLogin";
import FutInspect from "./components/Admin/FutInspect";
import AdminNavigation from "./components/Admin/AdminNavigation"; 
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPartitsPage from './components/Admin/AdminPartitsPage';
import AdminJugadorsPage from './components/Admin/AdminJugadorsPage';
import AdminArbitresPage from './components/Admin/AdminArbitresPage';
import AdminClubsPage from './components/Admin/AdminClubsPage';
import AdminEstadisPage from './components/Admin/AdminEstadisPage';
import AdminJugadorDetail from './components/Admin/AdminJugadorDetail';
import AdminArbitreDetail from './components/Admin/AdminArbitreDetail';
import AdminClubDetail from './components/Admin/AdminClubDetail';
import AdminEstadisDetail from './components/Admin/AdminEstadisDetail';
import AdminPartitDetail from './components/Admin/AdminPartitDetail';

function Navigation() {
  const location = useLocation();
  
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navStyle = {
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const linkStyle = {
    marginRight: '30px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  };

  const logoStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
    marginRight: '40px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <nav style={navStyle}>
      <div style={{
        maxWidth: '1250px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link 
          to="/" 
          style={logoStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚽ FUTINSPECT
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link 
            to="/partits" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏆 Partidos
          </Link>
          <Link 
            to="/jugadors" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ⭐ Jugadores
          </Link>
          <Link 
            to="/arbitres" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🟨 Árbitros
          </Link>
          <Link 
            to="/clubs" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏛️ Clubes
          </Link>
          <Link 
            to="/estadis" 
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏟️ Estadios
          </Link>
          <Link 
            to="/competicions" 
            style={{...linkStyle, marginRight: 0}}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏅 Competiciones
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <AdminNavigation /> {/* Añadir la navegación de admin */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/partits" element={<PartitsPage />} />
        <Route path="/jugadors" element={<JugadorsPage />} />
        <Route path="/arbitres" element={<ArbitresPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/estadis" element={<EstadisPage />} />
        <Route path="/competicions" element={<CompeticionsPage />} />
        <Route path="/jugadors/:dni" element={<JugadorDetail />} />
        <Route path="/clubs/:id" element={<ClubDetail />} />
        <Route path="/partits/:id_partit" element={<PartitDetail />} />
        <Route path="/estadis/:id" element={<EstadisDetail />} />
        <Route path="/competicions/:id_competicio" element={<CompeticionsDetail />} />
        <Route path="/arbitres/:dni" element={<ArbitreDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/futinspect"
          element={
            <ProtectedRoute>
              <FutInspect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partits"
          element={
            <ProtectedRoute>
              <AdminPartitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jugadors"
          element={
            <ProtectedRoute>
              <AdminJugadorsPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/arbitres"
          element={
            <ProtectedRoute>
              <AdminArbitresPage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute>
              <AdminClubsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/estadis"
          element={
            <ProtectedRoute>
              <AdminEstadisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jugadors/:dni" 
          element={
            <ProtectedRoute>
              <AdminJugadorDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/arbitres/:dni" 
          element={
            <ProtectedRoute>
              <AdminArbitreDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clubs/:id" 
          element={
            <ProtectedRoute>
              <AdminClubDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/estadis/:id" 
          element={
            <ProtectedRoute>
              <AdminEstadisDetail />
            </ProtectedRoute>
          }
        />
                <Route
          path="/admin/partits/:id_partit" 
          element={
            <ProtectedRoute>
              <AdminPartitDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;