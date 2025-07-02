import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteJugadorModal = ({ jugador, onClose, onJugadorDeleted, redirectAfterDelete = false }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/jugadors/${jugador.dni}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al eliminar el jugador');
      }
      
      onJugadorDeleted();
      onClose();
      
      // Si redirectAfterDelete es true, navegar a la lista de jugadores
      if (redirectAfterDelete) {
        navigate('/admin/jugadors');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!jugador) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={handleOverlayClick}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#dc2626',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🗑️ Eliminar Jugador
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Esta acción no se puede deshacer
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6b7280';
              }
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Warning Message */}
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#92400e',
                margin: 0
              }}>
                ¿Estás seguro?
              </h3>
            </div>
            <p style={{
              color: '#92400e',
              fontSize: '1rem',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Vas a eliminar permanentemente al jugador <strong>{jugador.nom}</strong> con DNI <strong>{jugador.dni}</strong>. 
              Esta acción eliminará todos sus datos del sistema y no se puede deshacer.
            </p>
          </div>

          {/* Player Info Card */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👤 Datos del jugador a eliminar:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                  🆔 DNI:
                </span>
                <p style={{ margin: '2px 0 0 0', fontWeight: '600', color: '#374151' }}>
                  {jugador.dni}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                  👕 Número:
                </span>
                <p style={{ margin: '2px 0 0 0', fontWeight: '600', color: '#374151' }}>
                  {jugador.numero_samarreta}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                  ⚽ Posición:
                </span>
                <p style={{ margin: '2px 0 0 0', fontWeight: '600', color: '#374151' }}>
                  {jugador.posicio}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                  🌍 Nacionalidad:
                </span>
                <p style={{ margin: '2px 0 0 0', fontWeight: '600', color: '#374151' }}>
                  {jugador.nacionalitat}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '160px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#b91c1c';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff40',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Eliminando...
                </>
              ) : (
                <>
                  🗑️ Sí, Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DeleteJugadorModal;