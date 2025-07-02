// src/components/Estadis/EstadisPage.js
import React, { useEffect, useState } from 'react';
import { getEstadis } from '../../api/apiService';
import EstadisCard from './EstadisCard';
import Loading from '../Common/Loading';

const EstadisPage = () => {
  const [estadis, setEstadis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('all');

  useEffect(() => {
    const fetchEstadis = async () => {
      try {
        const data = await getEstadis();
        setEstadis(data);
      } catch (error) {
        console.error('Error al cargar estadios:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEstadis();
  }, []);

  // Función para filtrar estadios
  const filteredEstadis = estadis.filter(estadi => {
    const matchesSearch = estadi.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estadi.ciutat.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCapacity = true;
    if (filterCapacity === 'large') matchesCapacity = estadi.capacitat > 50000;
    else if (filterCapacity === 'medium') matchesCapacity = estadi.capacitat > 20000 && estadi.capacitat <= 50000;
    else if (filterCapacity === 'small') matchesCapacity = estadi.capacitat <= 20000;
    
    return matchesSearch && matchesCapacity;
  });

  // Función para obtener estadísticas
  const getStats = () => {
    const totalEstadis = estadis.length;
    const totalCapacity = estadis.reduce((sum, estadi) => sum + (estadi.capacitat || 0), 0);
    const avgCapacity = totalEstadis > 0 ? Math.round(totalCapacity / totalEstadis) : 0;
    const largeStadiums = estadis.filter(e => e.capacitat > 50000).length;
    
    return { totalEstadis, totalCapacity, avgCapacity, largeStadiums };
  };

  const stats = getStats();

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
          🏟️ Estadios
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0'
        }}>
          Descubre todos los estadios donde se juegan los partidos
        </p>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏟️</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b' }}>
            {stats.totalEstadis}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total Estadios</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b' }}>
            {stats.largeStadiums}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Grandes Estadios</div>
        </div>
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
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Filtro por capacidad */}
          <div>
            <select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">Todas las capacidades</option>
              <option value="large">Grandes (+50,000)</option>
              <option value="medium">Medianos (20,000-50,000)</option>
              <option value="small">Pequeños (-20,000)</option>
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
            {filteredEstadis.length} de {estadis.length} estadios
          </div>
        </div>
      </div>

      {/* Grid de estadios */}
      {filteredEstadis.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredEstadis.map(estadi => (
            <EstadisCard 
              key={estadi.id_estadi} 
              estadi={estadi} 
            />
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
            No se encontraron estadios
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCapacity('all');
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
    </div>
  );
};

export default EstadisPage;