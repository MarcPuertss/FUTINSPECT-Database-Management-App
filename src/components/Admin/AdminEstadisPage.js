// src/components/Admin/AdminEstadisPage.js
import React, { useEffect, useState } from 'react';
import { getEstadis } from '../../api/apiService';
import AdminEstadisCard from './AdminEstadisCard';
import Loading from '../Common/Loading';
import CreateEstadiModal from './CreateEstadiModal';

const AdminEstadisPage = () => {
  const [estadis, setEstadis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadEstadis = async () => {
    setLoading(true);
    try {
      const data = await getEstadis();
      setEstadis(data);
    } catch (error) {
      console.error('Error al cargar estadios:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstadis();
  }, []);

  // Función para manejar la creación de un nuevo estadio
  const handleEstadiCreated = () => {
    loadEstadis(); // Recargar la lista de estadios
    setShowCreateModal(false); // Cerrar el modal
  };

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
          🏟️ Admin - Estadios
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0 0 24px 0'
        }}>
          Gestiona todos los estadios de la liga
        </p>
        
        {/* Botón de crear estadio */}
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
          ➕ Crear Nuevo Estadio
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
            <AdminEstadisCard 
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

      {/* Modal de crear estadio */}
      {showCreateModal && (
        <CreateEstadiModal
          onClose={() => setShowCreateModal(false)}
          onEstadiCreated={handleEstadiCreated}
        />
      )}
    </div>
  );
};

export default AdminEstadisPage;