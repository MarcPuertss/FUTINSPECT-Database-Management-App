// src/components/Competicions/CompeticionsCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const CompeticionsCard = ({ competicion }) => {
  // Usar la misma nomenclatura que en CompeticionsPage
  const { nom, _any, temporada, pais, categoria, tipus, id_competicio } = competicion;
  
  // Debug: verificar que tenemos el id_competicio
  console.log('CompeticionsCard - competicion:', competicion);
  console.log('CompeticionsCard - id_competicio:', id_competicio);
  
  // Función para obtener emoji según el tipo de competición
  const getCompetitionEmoji = (tipus) => {
    const tipo = tipus?.toLowerCase();
  return '⚽';
  };

  // Función para obtener color según la categoría
  const getCategoryColor = (categoria) => {
    const cat = categoria?.toLowerCase();
   return '#6b7280';
  };

  // Si no hay id_competicio, mostrar error o usar un identificador alternativo
  const competicionId = id_competicio || `${nom}-${_any}`.replace(/\s+/g, '-').toLowerCase();

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
      cursor: 'pointer'
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
      {/* Header con año */}
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
          lineHeight: '1.2'
        }}>
          {nom || 'Sin nombre'}
        </h2>
        <div style={{
          backgroundColor: getCategoryColor(categoria),
          color: 'white',
          borderRadius: '12px',
          padding: '4px 12px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {_any || 'N/A'}
        </div>
      </div>

     

      {/* Botón de acción */}
      {id_competicio ? (
        <Link 
          to={`/competicions/${id_competicio}`} 
          style={{
            padding: '12px 16px',
            backgroundColor: getCategoryColor(categoria),
            color: 'white',
            borderRadius: '10px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
            display: 'block'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          Ver Detalles
        </Link>
      ) : (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#9ca3af',
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '0.95rem',
          opacity: '0.6'
        }}>
          ID no disponible
        </div>
      )}

      {/* Debug info (eliminar en producción) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          fontSize: '0.7rem',
          color: '#6b7280'
        }}>
          ID: {id_competicio || 'undefined'}
        </div>
      )}
    </div>
  );
};

export default CompeticionsCard;