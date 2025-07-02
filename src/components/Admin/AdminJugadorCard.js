import { Link } from 'react-router-dom';

const AdminJugadorCard = ({ jugador }) => {
  const { nom, data_naixement, nacionalitat, numero_samarreta, posicio, dni } = jugador;
  const formattedYear = new Date(data_naixement).getFullYear();
  const age = new Date().getFullYear() - formattedYear;

  // Función para obtener emoji según la posición
  const getPositionEmoji = (posicion) => {
    const pos = posicion?.toLowerCase();
    if (pos?.includes('porter') || pos?.includes('arquero')) return '🥅';
    if (pos?.includes('defens') || pos?.includes('lateral')) return '🛡️';
    if (pos?.includes('migcampista') || pos?.includes('medio')) return '⚽';
    if (pos?.includes('davanter') || pos?.includes('delantero')) return '🎯';
    return '👤';
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
      {/* Header con número de camiseta */}
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
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          #{numero_samarreta}
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
            {getPositionEmoji(posicio)}
          </span>
          <strong>{posicio}</strong>
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
      <Link to={`/admin/jugadors/${dni}`} style={{
        padding: '12px 16px',
        backgroundColor: '#3b82f6',
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
        e.target.style.backgroundColor = '#2563eb';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#3b82f6';
      }}
      >
        Ver Perfil
      </Link>
    </div>
  );
};

export default AdminJugadorCard;