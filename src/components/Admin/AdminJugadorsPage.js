// src/components/Admin/AdminJugadorsPage.js
import React, { useEffect, useState } from 'react';
import { getJugadors } from '../../api/apiService';
import AdminJugadorCard from './AdminJugadorCard';
import Loading from '../Common/Loading';
import CreateJugadorModal from './CreateJugadorModal';

const AdminJugadorsPage = () => {
  const [jugadors, setJugadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterClub, setFilterClub] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadJugadors = async () => {
    setLoading(true);
    try {
      const data = await getJugadors();
      setJugadors(data);
    } catch (error) {
      console.error('Error al cargar jugadores:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJugadors();
  }, []);

  // Función para manejar la creación de un nuevo jugador
  const handleJugadorCreated = () => {
    loadJugadors(); // Recargar la lista de jugadores
    setShowCreateModal(false); // Cerrar el modal
  };

  // Función para filtrar jugadores
  const filteredJugadors = jugadors.filter(jugador => {
    const matchesSearch = jugador.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jugador.cognoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jugador.club?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filterPosition === 'all' || jugador.posicio === filterPosition;
    
    const matchesAge = filterAge === 'all' || getAgeRange(jugador.edat) === filterAge;
    
    const matchesClub = filterClub === 'all' || jugador.club === filterClub;
    
    return matchesSearch && matchesPosition && matchesAge && matchesClub;
  });

  // Función para obtener rango de edad
  const getAgeRange = (age) => {
    if (age < 20) return 'sub20';
    if (age < 25) return '20-24';
    if (age < 30) return '25-29';
    if (age < 35) return '30-34';
    return '35+';
  };

  // Función para obtener posiciones únicas
  const getUniquePositions = () => {
    const positions = [...new Set(jugadors.map(jugador => jugador.posicio).filter(pos => pos))];
    return positions.sort();
  };

  // Función para obtener clubes únicos
  const getUniqueClubs = () => {
    const clubs = [...new Set(jugadors.map(jugador => jugador.club).filter(club => club))];
    return clubs.sort();
  };

  // Función para obtener estadísticas
  const getStats = () => {
    const totalJugadors = jugadors.length;
    const uniquePositions = getUniquePositions().length;
    const uniqueClubs = getUniqueClubs().length;
    const averageAge = jugadors.reduce((sum, jugador) => sum + (jugador.edat || 0), 0) / jugadors.length;
    
    const mostPopularPosition = jugadors.reduce((acc, jugador) => {
      if (jugador.posicio) {
        acc[jugador.posicio] = (acc[jugador.posicio] || 0) + 1;
      }
      return acc;
    }, {});
    
    const topPosition = Object.entries(mostPopularPosition).reduce((a, b) => 
      mostPopularPosition[a[0]] > mostPopularPosition[b[0]] ? a : b, ['', 0]
    );
    
    return { 
      totalJugadors, 
      uniquePositions, 
      uniqueClubs,
      averageAge: Math.round(averageAge), 
      topPosition: topPosition[0], 
      topPositionCount: topPosition[1] 
    };
  };

  const stats = getStats();
  const uniquePositions = getUniquePositions();
  const uniqueClubs = getUniqueClubs();

  if (loading) return <Loading />;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header con botón de crear */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '32px',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#1e293b',
          marginBottom: '16px',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          ⚽ Admin - Jugadores
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0 0 24px 0'
        }}>
          Gestiona todos los jugadores de la liga
        </p>
        
        {/* Botón de crear jugador */}
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#059669';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#10b981';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
          }}
        >
          ➕ Crear Nuevo Jugador
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Buscador */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, apellido o club..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Filtro por posición */}
          <div>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '150px'
              }}
            >
              <option value="all">Todas las posiciones</option>
              {uniquePositions.map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por club */}
          <div>
            <select
              value={filterClub}
              onChange={(e) => setFilterClub(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '150px'
              }}
            >
              <option value="all">Todos los clubes</option>
              {uniqueClubs.map(club => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por edad */}
          <div>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '120px'
              }}
            >
              <option value="all">Todas las edades</option>
              <option value="sub20">Menos de 20</option>
              <option value="20-24">20-24 años</option>
              <option value="25-29">25-29 años</option>
              <option value="30-34">30-34 años</option>
              <option value="35+">35+ años</option>
            </select>
          </div>

          {/* Contador de resultados */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
            fontSize: '0.9rem',
            color: '#475569',
            fontWeight: '500'
          }}>
            {filteredJugadors.length} de {jugadors.length} jugadores
          </div>
        </div>
      </div>

      {/* Grid de jugadores */}
      {filteredJugadors.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredJugadors.map((jugador) => (
            <AdminJugadorCard key={jugador.id_jugador || `${jugador.nom}-${jugador.cognoms}`} jugador={jugador} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            No se encontraron jugadores
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterPosition('all');
              setFilterAge('all');
              setFilterClub('all');
            }}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Modal de crear jugador */}
      {showCreateModal && (
        <CreateJugadorModal
          onClose={() => setShowCreateModal(false)}
          onJugadorCreated={handleJugadorCreated}
        />
      )}
    </div>
  );
};

export default AdminJugadorsPage;