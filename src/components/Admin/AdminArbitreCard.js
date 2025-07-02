
import { Link } from 'react-router-dom';

const AdminArbitreCard = ({ arbitre }) => {
  const { nom, data_naixement, nacionalitat, rang_arbitre, dni } = arbitre;
  const formattedYear = new Date(data_naixement).getFullYear();
  const age = new Date().getFullYear() - formattedYear;

  // Función para obtener emoji según el rango del árbitro
  const getRankEmoji = (rang) => {
    if (!rang || typeof rang !== 'string') return '⚖️';
    const rango = rang.toLowerCase();
    return '⚖️';
  };

  // Función para obtener color según el rango
  const getRankColor = (rang) => {
    if (!rang || typeof rang !== 'string') return '#3b82f6';
    const rango = rang.toLowerCase();
    return '#3b82f6';
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      maxWidth: '320px',
      margin: '10px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    }}
    >
      {/* Header con emoji de rango */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <h2 style={{ 
          fontSize: '1.4rem', 
          color: '#1e293b', 
          marginBottom: '0',
          fontWeight: '700',
          lineHeight: '1.2'
        }}>
          {nom}
        </h2>
        <div style={{
          backgroundColor: getRankColor(rang_arbitre),
          color: 'white',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem'
        }}>
          {getRankEmoji(rang_arbitre)}
        </div>
      </div>

      {/* Información principal */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          fontSize: '0.95rem',
          color: '#475569'
        }}>
          <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
            {getRankEmoji(rang_arbitre)}
          </span>
          <strong>{rang_arbitre || 'Sin rango'}</strong>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ fontSize: '0.9rem' }}>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Edad</div>
            <div style={{ fontWeight: '600', color: '#334155' }}>{age} años</div>
          </div>
          <div style={{ fontSize: '0.9rem', textAlign: 'right' }}>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Nacionalidad</div>
            <div style={{ fontWeight: '600', color: '#334155' }}>{nacionalitat}</div>
          </div>
        </div>

        <div style={{ 
          fontSize: '0.85rem', 
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          Nacido en {formattedYear}
        </div>
      </div>

      {/* Botón de acción */}
      <Link to={`/admin/arbitres/${dni}`} style={{
        padding: '12px 16px',
        backgroundColor: getRankColor(rang_arbitre),
        color: 'white',
        borderRadius: '10px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'background-color 0.2s',
        display: 'block'
      }}
      onMouseEnter={(e) => {
        const currentBg = e.target.style.backgroundColor;
        // Oscurecer el color actual
        e.target.style.backgroundColor = `color-mix(in srgb, ${currentBg} 80%, black)`;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = getRankColor(rang_arbitre);
      }}
      >
        Ver Perfil
      </Link>
    </div>
  );
};

export default AdminArbitreCard;