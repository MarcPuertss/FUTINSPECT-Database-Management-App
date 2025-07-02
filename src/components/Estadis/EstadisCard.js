// src/components/Estadis/EstadisCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const EstadisCard = ({ estadi }) => {
  const { id_estadi, nom, ciutat, capacitat, _any } = estadi;

  // Función para obtener emoji según la capacidad o características del estadio
  const getEstadiEmoji = (capacitat) => {
    if (capacitat > 50000) return '🏟️';
    if (capacitat > 20000) return '🏛️';
    return '⚽';
  };

  // Función para formatear la capacidad con separadores de miles
  const formatCapacity = (capacity) => {
    return capacity?.toLocaleString('es-ES') || 'N/A';
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      maxWidth: '320px',
      margin: '10px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      minHeight: '220px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    }}
    >
      {/* Header con emoji del estadio */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <h2 style={{ 
          fontSize: '1.4rem', 
          color: '#1e293b', 
          marginBottom: '0',
          fontWeight: '700',
          lineHeight: '1.2',
          flex: 1,
          marginRight: '12px'
        }}>
          {nom}
        </h2>
        <div style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          {getEstadiEmoji(capacitat)}
        </div>
      </div>

      {/* Información principal */}
      <div style={{ marginBottom: '20px', flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ fontSize: '0.9rem' }}>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>ID Estadio</div>
            <div style={{ fontWeight: '600', color: '#334155' }}>#{id_estadi}</div>
          </div>
          <div style={{ fontSize: '0.9rem', textAlign: 'right' }}>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Ubicación</div>
            <div style={{ 
              fontWeight: '600', 
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              📍 {ciutat}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ fontSize: '0.9rem' }}>
            <div style={{ color: '#94a3b8', marginBottom: '4px' }}>Capacidad</div>
            <div style={{ 
              fontWeight: '600', 
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              👥 {formatCapacity(capacitat)}
            </div>
          </div>
        </div>
      </div>

      {/* Botón de acción */}
      <Link to={`/estadis/${id_estadi}`} style={{
        padding: '12px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '10px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'background-color 0.2s',
        display: 'block'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#2563eb';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#3b82f6';
      }}
      >
        Ver Detalles
      </Link>
    </div>
  );
};

export default EstadisCard;