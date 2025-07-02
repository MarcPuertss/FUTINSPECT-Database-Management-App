// src/components/Admin/AdminJugadorDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UpdateJugadorModal from './UpdateJugadorModal'; 
import DeleteJugadorModal from './DeleteJugadorModal';

const AdminJugadorDetails = () => {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState(null);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Nuevo estado

  useEffect(() => {
    const fetchJugador = async () => {
      try {
        const resJugador = await fetch(`http://localhost:8000/jugadors`);
        const data = await resJugador.json();
        const j = data.find(j => j.dni === dni);
        setJugador(j);
      } catch (err) {
        console.error('Error al cargar jugador:', err);
      }
    };
    
    const fetchClub = async () => {
      try {
        const res = await fetch(`http://localhost:8000/clubs`);
        const data = await res.json();
        if (data.length > 0) {
          const aleatorio = data[Math.floor(Math.random() * data.length)];
          setClub({ id: aleatorio.id_club, nom: aleatorio.nom });
        } else {
          setClub(null);
        }
      } catch (err) {
        console.error('Error al obtener club aleatorio:', err);
      }
    };

    fetchJugador();
    fetchClub();
  }, [dni]);

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

  const handleJugadorUpdated = async () => {
    // Refrescar los datos del jugador después de la actualización
    try {
      const resJugador = await fetch(`http://localhost:8000/jugadors`);
      const data = await resJugador.json();
      const j = data.find(j => j.dni === dni);
      setJugador(j);
    } catch (err) {
      console.error('Error al recargar jugador:', err);
    }
  };

  const handleJugadorDeleted = () => {
    // Función que se ejecuta después de eliminar
    // El modal ya se encarga de la navegación
  };

  if (!jugador) return (
    <div style={{ 
      padding: '32px', 
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#6b7280'
    }}>
      Cargando jugador...
    </div>
  );

  const formattedDate = new Date(jugador.data_naixement).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const age = new Date().getFullYear() - new Date(jugador.data_naixement).getFullYear();

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
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header del jugador */}
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
            {jugador.nom}
          </h1>
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            #{jugador.numero_samarreta}
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
          <span style={{ fontSize: '1.6rem' }}>
            {getPositionEmoji(jugador.posicio)}
          </span>
          {jugador.posicio}
        </div>

        <div style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginTop: '8px'
        }}>
          {age} años • {jugador.nacionalitat}
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

      {/* Información personal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ 
            marginBottom: '16px', 
            color: '#374151',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            📋 Información Personal
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>DNI:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                {jugador.dni}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Fecha de Nacimiento:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                {formattedDate}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Nacionalidad:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                {jugador.nacionalitat}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ 
            marginBottom: '16px', 
            color: '#374151',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            ⚽ Información Deportiva
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Posición:</span>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '1rem', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{getPositionEmoji(jugador.posicio)}</span>
                {jugador.posicio}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Número de Camiseta:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                #{jugador.numero_samarreta}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Edad:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                {age} años
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Club actual */}
      <div style={{
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        <h3 style={{ 
          marginBottom: '16px', 
          color: '#374151',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          🏟️ Club Actual
        </h3>
        <div style={{ fontSize: '1.1rem' }}>
          {club ? (
            <Link
              to={`/admin/clubs/${club.id}`}
              style={{ 
                color: '#2563eb', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dbeafe';
                e.target.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#eff6ff';
                e.target.style.borderColor = '#bfdbfe';
              }}
            >
              <span>🏛️</span>
              {club.nom}
            </Link>
          ) : (
            <span style={{ 
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              No disponible
            </span>
          )}
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
          Actualizar Jugador
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
          Eliminar Jugador
        </button>
      </div>

      {/* Botón de vuelta */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/admin/jugadors"
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
          ← Volver a Admin Jugadores
        </Link>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && (
        <UpdateJugadorModal
          jugador={jugador}
          onClose={handleCloseUpdateModal}
          onJugadorUpdated={handleJugadorUpdated}
        />
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <DeleteJugadorModal
          jugador={jugador}
          onClose={handleCloseDeleteModal}
          onJugadorDeleted={handleJugadorDeleted}
          redirectAfterDelete={true}
        />
      )}
    </div>
  );
};

export default AdminJugadorDetails; 