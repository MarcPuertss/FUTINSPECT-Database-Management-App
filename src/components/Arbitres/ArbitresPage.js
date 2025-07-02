// src/components/Arbitres/ArbitresPage.js
import React, { useEffect, useState } from 'react';
import { getArbitres } from '../../api/apiService';
import ArbitreCard from './ArbitreCard';
import Loading from '../Common/Loading';

const ArbitresPage = () => {
  const [arbitres, setArbitres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredArbitres, setFilteredArbitres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');

  useEffect(() => {
    const fetchArbitres = async () => {
      try {
        const data = await getArbitres();
        setArbitres(data);
        setFilteredArbitres(data);
      } catch (error) {
        console.error('Error al cargar árbitros:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArbitres();
  }, []);

  // Filtrar árbitros
  useEffect(() => {
    let filtered = arbitres;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(arbitre =>
        arbitre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arbitre.dni.includes(searchTerm)
      );
    }

    // Filtro por rango
    if (selectedRank) {
      filtered = filtered.filter(arbitre =>
        arbitre.rang_arbitre === selectedRank
      );
    }

    // Filtro por nacionalidad
    if (selectedNationality) {
      filtered = filtered.filter(arbitre =>
        arbitre.nacionalitat === selectedNationality
      );
    }

    setFilteredArbitres(filtered);
  }, [arbitres, searchTerm, selectedRank, selectedNationality]);

  // Obtener valores únicos para los filtros
  const uniqueRanks = [...new Set(arbitres.map(arbitre => arbitre.rang_arbitre))].filter(Boolean);
  const uniqueNationalities = [...new Set(arbitres.map(arbitre => arbitre.nacionalitat))].filter(Boolean);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRank('');
    setSelectedNationality('');
  };

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
          ⚖️ Arbitros
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0'
        }}>
          Consulta los arbitros del sistema y sus  estadisticas.
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          {/* Búsqueda */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Buscar árbitro
            </label>
            <input
              type="text"
              placeholder="Nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Filtro por nacionalidad */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
               Nacionalidad
            </label>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Todas las nacionalidades</option>
              {uniqueNationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <button
            onClick={clearFilters}
            style={{
              padding: '12px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
             Limpiar filtros
          </button>
        </div>
      </div>

      
      {/* Lista de árbitros */}
      {filteredArbitres.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>
            No se encontraron árbitros
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={clearFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredArbitres.map((arbitre) => (
            <ArbitreCard key={arbitre.dni} arbitre={arbitre} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArbitresPage;