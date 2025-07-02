// src/components/Clubs/ClubsPage.js
import React, { useEffect, useState } from 'react';
import { getClubs } from '../../api/apiService';
import ClubCard from './ClubCard';
import Loading from '../Common/Loading';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await getClubs();
        setClubs(data);
      } catch (error) {
        console.error('Error al cargar clubes:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  // Función para filtrar clubes
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.ciutat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === 'all' || club.ciutat === filterCity;
    
    return matchesSearch && matchesCity;
  });

  // Función para obtener ciudades únicas
  const getUniqueCities = () => {
    const cities = [...new Set(clubs.map(club => club.ciutat))];
    return cities.sort();
  };

  // Función para obtener estadísticas
  const getStats = () => {
    const totalClubs = clubs.length;
    const uniqueCities = getUniqueCities().length;
    const mostPopularCity = clubs.reduce((acc, club) => {
      acc[club.ciutat] = (acc[club.ciutat] || 0) + 1;
      return acc;
    }, {});
    
    const topCity = Object.entries(mostPopularCity).reduce((a, b) => 
      mostPopularCity[a[0]] > mostPopularCity[b[0]] ? a : b, ['', 0]
    );
    
    return { totalClubs, uniqueCities, topCity: topCity[0], topCityCount: topCity[1] };
  };

  const stats = getStats();
  const uniqueCities = getUniqueCities();

  if (loading) return <Loading />;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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
          ⚽ Clubes
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0'
        }}>
          Explora todos los clubes de fútbol de la liga
        </p>
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
              placeholder="🔍 Buscar por nombre o ciudad..."
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

          {/* Filtro por ciudad */}
          <div>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
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
              <option value="all">Todas las ciudades</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
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
            {filteredClubs.length} de {clubs.length} clubes
          </div>
        </div>
      </div>

      {/* Grid de clubes */}
      {filteredClubs.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredClubs.map((club) => (
            <ClubCard key={club.id_club} club={club} />
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
            No se encontraron clubes
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCity('all');
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
    </div>
  );
};

export default ClubsPage;