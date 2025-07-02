// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [featuredData, setFeaturedData] = useState({
    partits: [],
    jugadors: [],
    arbitres: [],
    competicions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data
        const [partitsRes, jugadorsRes, arbitresRes, competicionsRes] = await Promise.all([
          fetch('http://localhost:8000/partits'),
          fetch('http://localhost:8000/jugadors'),
          fetch('http://localhost:8000/arbitres'),
          fetch('http://localhost:8000/competicions')
        ]);

        const [partitsData, jugadorsData, arbitresData, competicionsData] = await Promise.all([
          partitsRes.json(),
          jugadorsRes.json(),
          arbitresRes.json(),
          competicionsRes.json()
        ]);

        // Shuffle and select random items
        const shuffleArray = (array) => {
          const shuffled = [...array];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };

        setFeaturedData({
          partits: shuffleArray(partitsData).slice(0, 9),
          jugadors: shuffleArray(jugadorsData).slice(0, 3),
          arbitres: shuffleArray(arbitresData).slice(0, 3),
          competicions: shuffleArray(competicionsData).slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching featured data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  // Función para obtener emoji según la posición
  const getPositionEmoji = (posicion) => {
    const pos = posicion?.toLowerCase();
    if (pos?.includes('porter') || pos?.includes('arquero')) return '🥅';
    if (pos?.includes('defens') || pos?.includes('lateral')) return '🛡️';
    if (pos?.includes('migcampista') || pos?.includes('medio')) return '⚽';
    if (pos?.includes('davanter') || pos?.includes('delantero')) return '🎯';
    return '👤';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        Cargando contenido destacado...
      </div>
    );
  }

  const sectionStyle = {
    marginBottom: '100px'
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '50px',
    textAlign: 'center',
    color: '#1e293b',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  const cardHoverStyle = {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '120px',
          padding: '60px 0'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            FUTINSPECT
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Descubre el mundo del fútbol: partidos emocionantes, jugadores estrella, 
            árbitros profesionales y las mejores competiciones.
          </p>
        </div>

        {/* Partidos Destacados */}
        <section style={sectionStyle}>
          <h2 style={headerStyle}>🏆 Partidos Destacados</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            {featuredData.partits.map((partit) => (
              <Link
                key={partit.id_partit}
                to={`/partits/${partit.id_partit}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      PARTIDO
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {new Date(partit.data).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#1e293b',
                    textAlign: 'center'
                  }}>
                    {partit.equip_local} vs {partit.equip_visitant}
                  </h3>
                  
                  <div style={{
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: partit.resultat ? '#059669' : '#f59e0b',
                    marginBottom: '12px'
                  }}>
                    {partit.resultat || 'Por jugar'}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: '#64748b',
                    marginTop: 'auto'
                  }}>
                    <span>🏟️ {partit.nom_estadi}</span>
                    <span>🏆 {partit.nom_competicio}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/partits"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#667eea',
                color: 'white',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5a67d8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ver todos los partidos →
            </Link>
          </div>
        </section>

        {/* Jugadores Estrella - ACTUALIZADA */}
        <section style={sectionStyle}>
          <h2 style={headerStyle}>⭐ Jugadores Estrella</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            {featuredData.jugadors.map((jugador) => {
              const formattedYear = jugador.data_naixement ? new Date(jugador.data_naixement).getFullYear() : 'N/A';
              
              return (
                <Link
                  key={jugador.dni}
                  to={`/jugadors/${jugador.dni}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={cardStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, cardHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Header con número de camiseta y etiqueta */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        JUGADOR
                      </span>
                      <div style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        #{jugador.numero_samarreta || jugador.dorsal || 'N/A'}
                      </div>
                    </div>
                    
                    {/* Nombre del jugador */}
                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#1e293b',
                      lineHeight: '1.2'
                    }}>
                      {jugador.nom}
                    </h3>
                    
                    {/* Posición con emoji */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '16px',
                      fontSize: '1rem',
                      color: '#475569'
                    }}>
                      <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>
                        {getPositionEmoji(jugador.posicio)}
                      </span>
                      <strong>{jugador.posicio}</strong>
                    </div>
                    
                    {/* Información en dos columnas */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '0.8rem' }}>
                          NACIONALIDAD
                        </div>
                        <div style={{ fontWeight: '600', color: '#334155' }}>
                          {jugador.nacionalitat || 'N/A'}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.9rem', textAlign: 'right' }}>
                        <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '0.8rem' }}>
                          AÑO NACIMIENTO
                        </div>
                        <div style={{ fontWeight: '600', color: '#334155' }}>
                          {formattedYear}
                        </div>
                      </div>
                    </div>
                    
                    {/* Botón de acción */}
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '16px'
                    }}>
                      <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        transition: 'background-color 0.2s'
                      }}>
                        Ver Perfil Completo
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/jugadors"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7c3aed';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ver todos los jugadores →
            </Link>
          </div>
        </section>

        {/* Árbitros Destacados */}
        <section style={sectionStyle}>
          <h2 style={headerStyle}>🟨 Árbitros Destacados</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            {featuredData.arbitres.map((arbitre) => (
              <Link
                key={arbitre.dni}
                to={`/arbitres/${arbitre.dni}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      ÁRBITRO
                    </span>
                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {arbitre.categoria || 'Profesional'}
                    </span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#1e293b'
                  }}>
                    {arbitre.nom}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: '#64748b',
                    marginTop: 'auto'
                  }}>
                    <span>📅 {arbitre.data_naixement ? new Date(arbitre.data_naixement).getFullYear() : 'N/A'}</span>
                    <span>🏆 Experiencia</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/arbitres"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d97706';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ver todos los árbitros →
            </Link>
          </div>
        </section>

        {/* Las Mejores Competiciones */}
        <section style={sectionStyle}>
          <h2 style={headerStyle}>🏅 Las Mejores Competiciones</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}>
            {featuredData.competicions.map((competicio) => (
              <Link
                key={competicio.id_competicio}
                to={`/competicions/${competicio.id_competicio}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    ...cardStyle,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      COMPETICIÓN
                    </span>
                    <span style={{ fontSize: '2rem' }}>🏆</span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: 'white'
                  }}>
                    {competicio.nom}
                  </h3>
                  
                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1rem',
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    Una de las competiciones más prestigiosas del fútbol mundial.
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: 'auto'
                  }}>
                    <span>📅 Temporada actual</span>
                    <span>⚽ Emocionante</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/competicions"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#667eea',
                color: 'white',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5a67d8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ver todas las competiciones →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;