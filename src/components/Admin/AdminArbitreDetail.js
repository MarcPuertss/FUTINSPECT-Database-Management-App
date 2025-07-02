// src/components/Admin/AdminArbitreDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UpdateArbitreModal from './UpdateArbitreModal'; // Asegúrate de que la ruta sea correcta
import DeleteArbitreModal from './DeleteArbitreModal'; // Nueva importación

const AdminArbitreDetail = () => {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [arbitre, setArbitre] = useState(null);
  const [partitsArbitrats, setPartitsArbitrats] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Nuevo estado

  useEffect(() => {
    const fetchArbitre = async () => {
      try {
        const resArbitre = await fetch(`http://localhost:8000/arbitres`);
        const data = await resArbitre.json();
        const a = data.find(a => a.dni === dni);
        setArbitre(a);
      } catch (err) {
        console.error('Error al cargar árbitro:', err);
      }
    };
    
    const fetchPartitsArbitrats = async () => {
      try {
        // Simulamos un número aleatorio de partidos arbitrados
        const partidosAleatorios = Math.floor(Math.random() * 50) + 10;
        setPartitsArbitrats(partidosAleatorios);
      } catch (err) {
        console.error('Error al obtener partidos arbitrados:', err);
      }
    };

    fetchArbitre();
    fetchPartitsArbitrats();
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

  const handleArbitreUpdated = async () => {
    // Refrescar los datos del árbitro después de la actualización
    try {
      const resArbitre = await fetch(`http://localhost:8000/arbitres`);
      const data = await resArbitre.json();
      const a = data.find(a => a.dni === dni);
      setArbitre(a);
    } catch (err) {
      console.error('Error al recargar árbitro:', err);
    }
  };

  const handleArbitreDeleted = () => {
    // Función que se ejecuta después de eliminar
    // El modal ya se encarga de la navegación
  };

  if (!arbitre) return (
    <div style={{ 
      padding: '32px', 
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#6b7280'
    }}>
      Cargando árbitro...
    </div>
  );

  const formattedDate = new Date(arbitre.data_naixement).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const age = new Date().getFullYear() - new Date(arbitre.data_naixement).getFullYear();

  // Función para obtener emoji según el rango del árbitro
  const getRankEmoji = (rang) => {
    if (!rang || typeof rang !== 'string') return '⚖️';
    const rango = rang.toLowerCase();
    return '⚖️';
  };

  // Función para obtener color según el rango
  const getRankColor = (rang) => {
    if (!rang || typeof rang !== 'string') return '#3b82f6';
    const rango = rang.toLowerCase();
    return '#3b82f6';
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header del árbitro */}
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
            {arbitre.nom}
          </h1>
          <div style={{
            backgroundColor: getRankColor(arbitre.rang_arbitre),
            color: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem'
          }}>
            {getRankEmoji(arbitre.rang_arbitre)}
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
            {getRankEmoji(arbitre.rang_arbitre)}
          </span>
          {arbitre.rang_arbitre || 'Sin rango'}
        </div>

        <div style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginTop: '8px'
        }}>
          {age} años • {arbitre.nacionalitat}
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
                {arbitre.dni}
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
                {arbitre.nacionalitat}
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
            ⚖️ Información Profesional
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Rango:</span>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '1rem', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{getRankEmoji(arbitre.rang_arbitre)}</span>
                {arbitre.rang_arbitre || 'Sin rango'}
              </p>
            </div>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Partidos Arbitrados:</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                {partitsArbitrats} partidos
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

      {/* Estadísticas adicionales */}
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
          📊 Estadísticas de Arbitraje
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #fcd34d'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🟨</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#92400e' }}>
              {Math.floor(partitsArbitrats * 0.8)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#92400e' }}>Tarjetas Amarillas</div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #fca5a5'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🟥</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#991b1b' }}>
              {Math.floor(partitsArbitrats * 0.1)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#991b1b' }}>Tarjetas Rojas</div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: '#e0f2fe',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #7dd3fc'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>⚽</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0c4a6e' }}>
              {Math.floor(partitsArbitrats * 2.3)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#0c4a6e' }}>Goles Validados</div>
          </div>
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
          Actualizar Árbitro
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
          Eliminar Árbitro
        </button>
      </div>

      {/* Botón de vuelta */}
      <div style={{ textAlign: 'center' }}>
        <Link
          to="/admin/arbitres"
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
          ← Volver a Admin Árbitros
        </Link>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && (
        <UpdateArbitreModal
          arbitre={arbitre}
          onClose={handleCloseUpdateModal}
          onArbitreUpdated={handleArbitreUpdated}
        />
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <DeleteArbitreModal
          arbitre={arbitre}
          onClose={handleCloseDeleteModal}
          onArbitreDeleted={handleArbitreDeleted}
          redirectAfterDelete={true}
        />
      )}
    </div>
  );
};

export default AdminArbitreDetail;