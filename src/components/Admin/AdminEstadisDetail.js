// src/components/Admin/AdminEstadisDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UpdateEstadiModal from './UpdateEstadiModal'; // Asegúrate de que la ruta sea correcta
import DeleteEstadiModal from './DeleteEstadiModal'; // Nueva importación

const AdminEstadisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estadi, setEstadi] = useState(null);
  const [partits, setPartits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Nuevo estado
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstadi = async () => {
      try {
        setError(null);
        console.log('Fetching estadi with ID:', id);
        
        const { getEstadis } = await import('../../api/apiService');
        const allEstadis = await getEstadis();
        const data = allEstadis.find(estadi => 
          estadi.id_estadi?.toString() === id
        );
        
        if (!data) {
          throw new Error(`Estadio con ID ${id} no encontrado`);
        }
        console.log('Estadi data:', data);
        setEstadi(data);
      } catch (error) {
        console.error('Error al cargar estadio:', error);
        setError(error.message);
      }
    };

    const fetchPartits = async () => {
      try {
        const res = await fetch('http://localhost:8000/partits');
        const data = await res.json();
        
        const filtered = data.filter(p => p.id_estadi === parseInt(id));
        const sorted = filtered.sort((a, b) => new Date(b.data) - new Date(a.data));
        setPartits(sorted.slice(0, 5));
      } catch (err) {
        console.error('Error al cargar partidos:', err);
        // No establecemos error aquí porque los partidos no son críticos
      }
    };

    if (id) {
      fetchEstadi();
      fetchPartits();
    } else {
      setError('ID de estadio no válido');
    }
  }, [id]);

  // Función simplificada para mostrar el modal de eliminación
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleUpdate = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleEstadiUpdated = async () => {
    // Refrescar los datos del estadio después de la actualización
    try {
      const { getEstadis } = await import('../../api/apiService');
      const allEstadis = await getEstadis();
      const data = allEstadis.find(estadi => 
        estadi.id_estadi?.toString() === id
      );
      setEstadi(data);
    } catch (err) {
      console.error('Error al recargar estadio:', err);
    }
  };

  const handleEstadiDeleted = () => {
    // Función que se ejecuta después de eliminar
    // El modal ya se encarga de la navegación
  };

  // Función para obtener emoji según la capacidad
  const getEstadiEmoji = (capacitat) => {
    if (capacitat > 50000) return '🏟️';
    if (capacitat > 20000) return '🏛️';
    return '⚽';
  };

  // Función para formatear la capacidad
  const formatCapacity = (capacity) => {
    return capacity?.toLocaleString('es-ES') || 'N/A';
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para obtener categoría por capacidad
  const getCapacityCategory = (capacitat) => {
    if (capacitat > 50000) return '🏆 Gran Estadio';
    if (capacitat > 20000) return '🏅 Estadio Medio';
    if (capacitat > 5000) return '⚽ Estadio Pequeño';
    return '🏟️ Campo Local';
  };

  if (error) {
    return (
      <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(239,68,68,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
          <h2 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '1.5rem' }}>
            Error al cargar el estadio
          </h2>
          <p style={{ color: '#991b1b', marginBottom: '24px', fontSize: '1.1rem' }}>
            {error}
          </p>
          <Link
            to="/admin/estadis"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            ← Volver a Admin Estadios
          </Link>
        </div>
      </div>
    );
  }

  if (!estadi) return (
    <div style={{ 
      padding: '32px', 
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#6b7280'
    }}>
      Cargando estadio...
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header del estadio */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '40px',
        backgroundColor: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            color: '#1e293b',
            margin: '0',
            fontWeight: '800',
            textAlign: 'center'
          }}>
            {estadi.nom}
          </h1>
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 16px rgba(59,130,246,0.3)'
          }}>
            {getEstadiEmoji(estadi.capacitat)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '1.4rem',
          color: '#475569',
          fontWeight: '600'
        }}>
          <span style={{ fontSize: '1.6rem' }}>🏙️</span>
          {estadi.ciutat}
        </div>

        <div style={{
          fontSize: '1.2rem',
          color: '#64748b',
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <span>📊 ID: #{estadi.id_estadi}</span>
          {estadi._any && (
            <>
              <span>•</span>
              <span>📅 {estadi._any}</span>
            </>
          )}
          <span>•</span>
          <span>👥 {formatCapacity(estadi.capacitat)}</span>
        </div>

        {/* Badge de Admin */}
        <div style={{
          marginTop: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: '1px solid #fcd34d'
        }}>
          <span>👑</span>
          Panel de Administración
        </div>
      </div>

      {/* Información del estadio */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Información básica */}
        <div style={{
          padding: '28px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ 
            marginBottom: '20px', 
            color: '#374151',
            fontSize: '1.3rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏟️ Información del Estadio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                Nombre:
              </span>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '1.2rem', 
                fontWeight: '600',
                color: '#2563eb'
              }}>
                {estadi.nom}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                Ciudad:
              </span>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                📍 {estadi.ciutat}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                Capacidad:
              </span>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                👥 {formatCapacity(estadi.capacitat)} personas
              </p>
            </div>
            {estadi._any && (
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                  Año:
                </span>
                <p style={{ 
                  margin: '6px 0 0 0', 
                  fontSize: '1.1rem', 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  📅 {estadi._any}
                </p>
              </div>
            )}
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                Categoría:
              </span>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {getCapacityCategory(estadi.capacitat)}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                ID Estadio:
              </span>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                #{estadi.id_estadi}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos partidos en este estadio */}
      <div style={{
        padding: '28px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#374151',
          fontSize: '1.3rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚽ Últimos Partidos en este Estadio
        </h3>
        
        {partits.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {partits.map((partit, index) => (
              <Link
                key={partit.id_partit || index}
                to={`/admin/partits/${partit.id_partit}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    {formatDate(partit.data)}
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    {partit.equip_local} vs {partit.equip_visitant}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '700',
                    color: '#1e293b',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {partit.resultat || 'TBD'}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Ver detalles →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: '#6b7280',
            fontStyle: 'italic',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚽</div>
            No hay partidos registrados en este estadio
          </div>
        )}
      </div>

      {/* Botones de administración */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleUpdate}
          disabled={loading}
          style={{
            padding: '14px 28px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#059669';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#10b981';
            }
          }}
        >
          <span>✏️</span>
          Actualizar Estadio
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: '14px 28px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#dc2626';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#ef4444';
            }
          }}
        >
          <span>🗑️</span>
          Eliminar Estadio
        </button>
      </div>

      {/* Botón de vuelta */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/admin/estadis"
          style={{
            padding: '16px 32px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1.1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(107,114,128,0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#4b5563';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(107,114,128,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6b7280';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(107,114,128,0.2)';
          }}
        >
          ← Volver a Admin Estadios
        </Link>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && (
        <UpdateEstadiModal
          estadi={estadi}
          onClose={handleCloseUpdateModal}
          onEstadiUpdated={handleEstadiUpdated}
        />
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <DeleteEstadiModal
          estadi={estadi}
          onClose={handleCloseDeleteModal}
          onEstadiDeleted={handleEstadiDeleted}
          redirectAfterDelete={true}
        />
      )}
    </div>
  );
};

export default AdminEstadisDetail;