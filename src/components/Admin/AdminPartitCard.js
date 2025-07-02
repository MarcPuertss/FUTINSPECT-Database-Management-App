// src/components/Partits/PartitCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PartitCard = ({ partit }) => {
  const { equip_local, equip_visitant, data, hora, resultat, nom_estadi, nom_competicio, id_partit } = partit;
  const formattedDate = new Date(data).toLocaleDateString('es-ES');

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      maxWidth: '350px',
      margin: '10px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ 
          fontSize: '1.3rem', 
          color: '#1e293b', 
          marginBottom: '8px',
          fontWeight: '600'
        }}>
          {equip_local} vs {equip_visitant}
        </h3>
        
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          color: '#059669',
          marginBottom: '12px'
        }}>
          {resultat || 'Por jugar'}
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '12px' }}>
        <div style={{ marginBottom: '6px' }}>
          📅 <strong>{formattedDate}</strong> a las <strong>{hora}</strong>
        </div>
        <div style={{ marginBottom: '6px' }}>
          🏟️ {nom_estadi}
        </div>
        <div style={{ color: '#94a3b8' }}>
          🏆 {nom_competicio}
        </div>
      </div>

      <Link to={`/admin/partits/${id_partit}`} style={{
        marginTop: '12px',
        padding: '10px 16px',
        backgroundColor: '#059669',
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'background-color 0.2s'
      }}>
        Ver Detalles
      </Link>
    </div>
  );
};

export default PartitCard;