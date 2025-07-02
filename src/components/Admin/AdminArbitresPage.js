// src/components/Admin/AdminArbitresPage.js
import React, { useState, useEffect } from 'react';
import { getArbitres } from '../../api/apiService';
import AdminArbitreCard from './/AdminArbitreCard';
import Loading from '../Common/Loading';
import CreateArbitreModal from './CreateArbitreModal';

const AdminArbitresPage = () => {
  const [arbitres, setArbitres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadArbitres = async () => {
    setLoading(true);
    try {
      const data = await getArbitres();
      setArbitres(data);
    } catch (error) {
      console.error('Error al cargar árbitros:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArbitres();
  }, []);

  // Función para manejar la creación de un nuevo árbitro
  const handleArbitreCreated = () => {
    loadArbitres(); // Recargar la lista de árbitros
    setShowCreateModal(false); // Cerrar el modal
  };

  // Función para filtrar árbitros
  const filteredArbitres = arbitres.filter(arbitre => {
    const nom = typeof arbitre.nom === 'string' ? arbitre.nom : '';
    const dni = typeof arbitre.dni === 'string' ? arbitre.dni : '';
    const rang = typeof arbitre.rang_arbitre === 'string' ? arbitre.rang_arbitre : '';
    const nacionalitat = typeof arbitre.nacionalitat === 'string' ? arbitre.nacionalitat : '';
    
    const matchesSearch = 
      nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dni.includes(searchTerm);
    
    const matchesRank = selectedRank === '' || rang === selectedRank;
    const matchesNationality = selectedNationality === '' || nacionalitat === selectedNationality;
    
    return matchesSearch && matchesRank && matchesNationality;
  });

  // Obtener valores únicos para los filtros
  const uniqueRanks = [...new Set(arbitres.map(arbitre => arbitre.rang_arbitre))].filter(Boolean);
  const uniqueNationalities = [...new Set(arbitres.map(arbitre => arbitre.nacionalitat))].filter(Boolean);

  // Función para obtener estadísticas
  const getStats = () => {
    const totalArbitres = arbitres.length;
    const rankStats = uniqueRanks.reduce((acc, rank) => {
      acc[rank] = arbitres.filter(a => a.rang_arbitre === rank).length;
      return acc;
    }, {});
    
    const nationalityStats = uniqueNationalities.reduce((acc, nationality) => {
      acc[nationality] = arbitres.filter(a => a.nacionalitat === nationality).length;
      return acc;
    }, {});
    
    return { 
      totalArbitres, 
      rankStats,
      nationalityStats,
      totalRanks: uniqueRanks.length,
      totalNationalities: uniqueNationalities.length
    };
  };

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
          ⚖️ Admin - Árbitros
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0 0 24px 0'
        }}>
          Gestiona todos los árbitros del sistema
        </p>
        
        {/* Botón de crear árbitro */}
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#3b82f6',
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
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
          }}
        >
          ➕ Crear Nuevo Árbitro
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
              placeholder="🔍 Buscar por nombre o DNI..."
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
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Filtro por rango */}
          <div>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
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
              <option value="">Todos los rangos</option>
              {uniqueRanks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>

          {/* Filtro por nacionalidad */}
          <div>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '180px'
              }}
            >
              <option value="">Todas las nacionalidades</option>
              {uniqueNationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
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
            {filteredArbitres.length} árbitros
          </div>

          {/* Botón limpiar filtros */}
          {(searchTerm || selectedRank || selectedNationality) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRank('');
                setSelectedNationality('');
              }}
              style={{
                padding: '12px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              🗑️ Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de árbitros */}
      {filteredArbitres.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredArbitres.map((arbitre, index) => (
            <AdminArbitreCard key={`${arbitre.dni || index}`} arbitre={arbitre} />
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
            No se encontraron árbitros
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRank('');
              setSelectedNationality('');
            }}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
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

      {/* Modal de crear árbitro */}
      {showCreateModal && (
        <CreateArbitreModal
          onClose={() => setShowCreateModal(false)}
          onArbitreCreated={handleArbitreCreated}
        />
      )}
    </div>
  );
};

export default AdminArbitresPage;