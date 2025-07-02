import { Link, useLocation } from 'react-router-dom';

function AdminNavigation() {
  const location = useLocation();
  
  // Solo mostrar la navegación si la ruta actual comienza con /admin y no es la página de login
  if (!location.pathname.startsWith('/admin') || location.pathname === '/admin') {
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

  const logoutButtonStyle = {
    ...linkStyle,
    marginRight: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem'
  };

  const handleLogout = () => {
    // Eliminar el token de autenticación
    localStorage.removeItem('adminToken');
    // Redirigir a la página de login
    window.location.href = '/admin';
  };

  return (
    <nav style={navStyle}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link 
          to="/admin/futinspect" 
          style={logoStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚽ FUTINSPECT ADMIN
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link 
            to="/admin/partits" 
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
            to="/admin/jugadors" 
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
            to="/admin/arbitres" 
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
            to="/admin/clubs" 
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
            to="/admin/estadis" 
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
        </div>
      </div>
    </nav>
  );
}

export default AdminNavigation;