// src/components/Partits/PartitDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PartitDetail = () => {
  const { id_partit } = useParams();
  const [partit, setPartit] = useState(null);
  const [estadistics, setEstadistics] = useState([]);

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

  if (!partit) return <div style={{ padding: '32px' }}>Cargando partido...</div>;

  // DEBUG: Ver qué propiedades tiene el partit
  console.log('Partit completo:', partit);
  console.log('Propiedades del partit:', Object.keys(partit));

  const formattedDate = new Date(partit.data).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header del partido */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        padding: '24px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '16px', 
          color: '#1e293b' 
        }}>
          {partit.equip_local} vs {partit.equip_visitant}
        </h1>
        
        <div style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#059669',
          marginBottom: '16px'
        }}>
          {partit.resultat || 'Por jugar'}
        </div>

        <div style={{ fontSize: '1.1rem', color: '#64748b' }}>
          {formattedDate} • {partit.hora}
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

      {/* Botón de vuelta */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link
          to="/partits"
          style={{
            padding: '12px 24px',
            backgroundColor: '#6b7280',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          ← Volver a Partidos
        </Link>
      </div>
    </div>
  );
};

export default PartitDetail;