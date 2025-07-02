// src/components/Admin/AdminClubDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UpdateClubModal from './UpdateClubModal'; // Asegúrate de que la ruta sea correcta
import DeleteClubModal from './DeleteClubModal'; // Nueva importación

const AdminClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [partits, setPartits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch('http://localhost:8000/clubs');
        const data = await res.json();
        const c = data.find(club => club.id_club === parseInt(id));
        setClub(c);
      } catch (err) {
        console.error('Error al cargar club:', err);
      }
    };

    const fetchPartits = async () => {
      try {
        const res = await fetch('http://localhost:8000/partits');
        const data = await res.json();
        
        const filtered = data.filter(p =>
          p.club_local === parseInt(id) || p.club_visitant === parseInt(id)
        );
        
        const sorted = filtered.sort((a, b) => new Date(b.data) - new Date(a.data));
        setPartits(sorted.slice(0, 5));
      } catch (err) {
        console.error('Error al cargar partidos:', err);
      }
    };

    fetchClub();
    fetchPartits();
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

  const handleClubUpdated = async () => {
    // Refrescar los datos del club después de la actualización
    try {
      const res = await fetch('http://localhost:8000/clubs');
      const data = await res.json();
      const c = data.find(club => club.id_club === parseInt(id));
      setClub(c);
    } catch (err) {
      console.error('Error al recargar club:', err);
    }
  };

  const handleClubDeleted = () => {
    // Función que se ejecuta después de eliminar
    // El modal ya se encarga de la navegación
  };

  if (!club) return (
    <div style={{ 
      padding: '32px', 
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#6b7280'
    }}>
      Cargando club...
    </div>
  );

  // Función para obtener emoji según la ciudad o nombre del club
  const getClubEmoji = (nom, ciutat) => {
    const name = nom?.toLowerCase();
    const city = ciutat?.toLowerCase();
    
    return '⚽';
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para determinar el resultado del partido
  const getMatchResult = (partit) => {
    if (!partit.resultat) return 'Sin resultado';
    
    const [goalsLocal, goalsVisitant] = partit.resultat.split('-').map(g => parseInt(g.trim()));
    const isLocalClub = partit.club_local === parseInt(id);
    
    if (goalsLocal > goalsVisitant) {
      return isLocalClub ? '🟢 Victoria' : '🔴 Derrota';
    } else if (goalsLocal < goalsVisitant) {
      return isLocalClub ? '🔴 Derrota' : '🟢 Victoria';
    } else {
      return '🟡 Empate';
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header del club */}
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
          marginBottom: '16px'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            color: '#1e293b',
            margin: '0',
            fontWeight: '800'
          }}>
            {club.nom}
          </h1>
          <div style={{
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {getClubEmoji(club.nom, club.ciutat)}
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
          {club.ciutat}
        </div>

        <div style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginTop: '8px'
        }}>
          Club ID: #{club.id_club}
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

      {/* Información del club */}
      <div style={{
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '32px',
        maxWidth: '500px',
        margin: '0 auto 32px auto'
      }}>
        <h3 style={{ 
          marginBottom: '16px', 
          color: '#374151',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          📋 Información del Club
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Nombre:</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
              {club.nom}
            </p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Ciudad:</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
              📍 {club.ciutat}
            </p>
          </div>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>ID Club:</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
              #{club.id_club}
            </p>
          </div>
        </div>
      </div>

      {/* Últimos partidos */}
      <div style={{
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#374151',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          ⚽ Últimos Partidos
        </h3>
        
        {partits.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {partits.map((partit, index) => (
              <Link
                key={partit.id_partit || index}
                to={`/admin/partits/${partit.id_partit}`}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
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
                    marginBottom: '4px'
                  }}>
                    {formatDate(partit.data)}
                  </div>
                  <div style={{ 
                    fontSize: '1.1rem', 
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
                    fontSize: '1.2rem', 
                    fontWeight: '700',
                    color: '#1e293b',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {partit.resultat || 'TBD'}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    {getMatchResult(partit)}
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
            fontStyle: 'italic'
          }}>
            No hay partidos registrados para este club
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
          Actualizar Club
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
          Eliminar Club
        </button>
      </div>

      {/* Botón de vuelta */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/admin/clubs"
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
          ← Volver a Admin Clubes
        </Link>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && (
        <UpdateClubModal
          club={club}
          onClose={handleCloseUpdateModal}
          onClubUpdated={handleClubUpdated}
        />
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <DeleteClubModal
          club={club}
          onClose={handleCloseDeleteModal}
          onClubDeleted={handleClubDeleted}
          redirectAfterDelete={true}
        />
      )}
    </div>
  );
};

export default AdminClubDetails;