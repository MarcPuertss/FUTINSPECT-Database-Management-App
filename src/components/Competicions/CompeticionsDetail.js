// src/components/Competicions/CompeticionsDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCompeticions } from '../../api/apiService';
import Loading from '../Common/Loading';

const CompeticionsDetail = () => {
  const { id_competicio } = useParams();
  const navigate = useNavigate();
  const [competicion, setCompeticion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompeticion = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching competicion with ID:', id_competicio);
        
        const { getCompeticions } = await import('../../api/apiService');
        const allCompeticions = await getCompeticions();
        const data = allCompeticions.find(comp => 
          comp.id_competicio?.toString() === id_competicio
        );
        
        if (!data) {
          throw new Error(`Competición con ID ${id_competicio} no encontrada`);
        }
        console.log('Competicion data:', data);
        setCompeticion(data);
      } catch (error) {
        console.error('Error al cargar competición:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_competicio) {
      fetchCompeticion();
    } else {
      setError('ID de competición no válido');
      setLoading(false);
    }
  }, [id_competicio]);

  const handleGoBack = () => {
    navigate('/competicions');
  };

  // Función para obtener emoji según el tipo de competición
  const getCompetitionEmoji = (tipus) => {
    const tipo = tipus?.toLowerCase();
    if (tipo?.includes('liga')) return '🏆';
    if (tipo?.includes('copa')) return '🥇';
    if (tipo?.includes('torneo')) return '⚽';
    if (tipo?.includes('mundial')) return '🌍';
    if (tipo?.includes('europeo')) return '🇪🇺';
    if (tipo?.includes('nacional')) return '🏴';
    return '🏟️';
  };

  // Función para obtener color según la categoría
  const getCategoryColor = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat?.includes('profesional')) return '#10b981';
    if (cat?.includes('amateur')) return '#3b82f6';
    if (cat?.includes('juvenil')) return '#f59e0b';
    if (cat?.includes('infantil')) return '#ef4444';
    return '#6b7280';
  };

  if (loading) return <Loading />;

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
            Error al cargar la competición
          </h2>
          <p style={{ color: '#991b1b', marginBottom: '24px', fontSize: '1.1rem' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleGoBack}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              ← Volver a Competiciones
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!competicion) {
    return (
      <div style={{ 
        padding: '32px', 
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ marginBottom: '16px' }}>Competición no encontrada</h2>
        <button
          onClick={handleGoBack}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Volver a Competiciones
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header principal de la competición */}
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
            {competicion.nom}
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
            {getCompetitionEmoji(competicion.tipus)}
          </div>
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
          <span>📅 {competicion._any || 'Año no especificado'}</span>
          {competicion.pais && (
            <>
              <span>•</span>
              <span>🌍 {competicion.pais}</span>
            </>
          )}
          {competicion.temporada && (
            <>
              <span>•</span>
              <span>⏰ {competicion.temporada}</span>
            </>
          )}
        </div>
      </div>

      {/* Información detallada */}
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
            📋 Información Básica
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                ID de Competición:
              </span>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#1f2937'
              }}>
                #{competicion.id_competicio}
              </p>
            </div>
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
                {competicion._any || 'No especificado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del organizador */}
      {(competicion.organitzador_nom || competicion.dni_organitzador) && (
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
            👤 Organizador
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {competicion.organitzador_nom && (
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
                  {competicion.organitzador_nom}
                </p>
              </div>
            )}
            {competicion.dni_organitzador && (
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                  DNI:
                </span>
                <p style={{ 
                  margin: '6px 0 0 0', 
                  fontSize: '1.1rem', 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {competicion.dni_organitzador}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón de vuelta */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleGoBack}
          style={{
            padding: '16px 32px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
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
          ← Volver a Competiciones
        </button>
      </div>
    </div>
  );
};

export default CompeticionsDetail;