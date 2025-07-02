// src/components/Admin/AdminPartitDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UpdatePartitModal from './UpdatePartitModal'; // Asegúrate de que la ruta sea correcta
import DeletePartitModal from './DeletePartitModal'; // Nueva importación

const AdminPartitDetails = () => {
  const { id_partit } = useParams();
  const navigate = useNavigate();
  const [partit, setPartit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPartit = async () => {
      try {
        const resPartit = await fetch(`http://localhost:8000/partits`);
        const data = await resPartit.json();
        const p = data.find(p => p.id_partit.toString() === id_partit);
        setPartit(p);
      } catch (err) {
        console.error('Error al cargar partido:', err);
      }
    };

    fetchPartit();
  }, [id_partit]);

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

  const handlePartitUpdated = async () => {
    // Refrescar los datos del partido después de la actualización
    try {
      const resPartit = await fetch(`http://localhost:8000/partits`);
      const data = await resPartit.json();
      const p = data.find(p => p.id_partit.toString() === id_partit);
      setPartit(p);
    } catch (err) {
      console.error('Error al recargar partido:', err);
    }
  };

  const handlePartitDeleted = () => {
    // Función que se ejecuta después de eliminar
    // El modal ya se encarga de la navegación
  };

  if (!partit) return (
    <div style={{ 
      padding: '32px', 
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#6b7280'
    }}>
      Cargando partido...
    </div>
  );

  const formattedDate = new Date(partit.data).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Función para obtener emoji según el estado del partido
  const getPartitStatusEmoji = (resultat) => {
    if (!resultat || resultat === 'Por jugar') return '⏳';
    return '✅';
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header del partido */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '32px',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#1e293b',
            margin: '0',
            fontWeight: '800',
            textAlign: 'center'
          }}>
            {partit.equip_local} vs {partit.equip_visitant}
          </h1>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '1.8rem',
          color: '#059669',
          fontWeight: '700',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '1.6rem' }}>
            {getPartitStatusEmoji(partit.resultat)}
          </span>
          {partit.resultat || 'Por jugar'}
        </div>

        <div style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginBottom: '8px'
        }}>
          {formattedDate} 
        </div>

        <div style={{
          fontSize: '1rem',
          color: '#6b7280'
        }}>
          🏟️ {partit.nom_estadi} • 🏆 {partit.nom_competicio}
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
      
            {/* Equipos enfrentados */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <Link
                to={`/clubs/${partit.club_local}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ marginBottom: '12px', color: '#374151' }}>🏠 Equipo Local</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                  {partit.equip_local}
                </p>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#6b7280', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  Ver equipo →
                </div>
              </Link>
      
              <Link
                to={`/clubs/${partit.club_visitant}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ marginBottom: '12px', color: '#374151' }}>✈️ Equipo Visitante</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                  {partit.equip_visitant}
                </p>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#6b7280', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  Ver equipo →
                </div>
              </Link>
            </div>
      
            {/* Información del partido */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <Link
                to={`/estadis/${partit.id_estadi}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ marginBottom: '12px', color: '#374151' }}>🏟️ Estadio</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{partit.nom_estadi}</p>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#6b7280', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  Ver estadio →
                </div>
              </Link>
      
              <Link
                to={`/competicions/${partit.id_competicio}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ marginBottom: '12px', color: '#374151' }}>🏆 Competición</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{partit.nom_competicio}</p>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#6b7280', 
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  Ver competición →
                </div>
              </Link>
      
              <div style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ marginBottom: '12px', color: '#374151' }}>📅 Fecha</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{partit.data}</p>
              </div>
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
          Actualizar Partido
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
          Eliminar Partido
        </button>
      </div>

      {/* Botón de vuelta */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/admin/partits"
          style={{
            padding: '12px 24px',
            backgroundColor: '#6b7280',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6b7280';
          }}
        >
          ← Volver a Admin Partidos
        </Link>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && (
        <UpdatePartitModal
          partit={partit}
          onClose={handleCloseUpdateModal}
          onPartitUpdated={handlePartitUpdated}
        />
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <DeletePartitModal
          partit={partit}
          onClose={handleCloseDeleteModal}
          onPartitDeleted={handlePartitDeleted}
          redirectAfterDelete={true}
        />
      )}
    </div>
  );
};

export default AdminPartitDetails;