import React, { useState, useEffect } from 'react';

const CreatePartitModal = ({ onClose, onPartitCreated }) => {
  const [formData, setFormData] = useState({
    data_partit: '',
    hora_partit: '',
    resultat: '',
    jornada: 1,
    club_local_id: '',
    club_visitant_id: '',
    id_estadi: '',
    id_competicio: '',
    id_fase: null
  });

  const [clubs, setClubs] = useState([]);
  const [competicions, setCompeticions] = useState([]);
  const [estadis, setEstadis] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [clubsRes, competicionsRes, estadisRes] = await Promise.all([
          fetch('http://localhost:8000/clubs').then(r => r.json()),
          fetch('http://localhost:8000/competicions').then(r => r.json()),
          fetch('http://localhost:8000/estadis').then(r => r.json())
        ]);
        setClubs(clubsRes);
        setCompeticions(competicionsRes);
        setEstadis(estadisRes);
      } catch (e) {
        setError('Error cargando datos iniciales');
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { club_local_id, club_visitant_id, data_partit, hora_partit, id_competicio, id_estadi } = formData;
    
    if (!club_local_id || !club_visitant_id || !data_partit || !hora_partit || !id_competicio || !id_estadi) {
      return 'Todos los campos marcados con * son obligatorios';
    }

    if (club_local_id === club_visitant_id) {
      return 'El club local y visitante no pueden ser el mismo';
    }

    // Validar formato de hora
    const timeRegex = /^([01]?[0-9]|2[0-3])([0-5][0-9])$|^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(hora_partit)) {
      return 'Formato de hora inválido. Use HHMM o HH:MM';
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(data_partit);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'La fecha del partido no puede ser en el pasado';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const clubLocal = clubs.find(c => c.id_club === parseInt(formData.club_local_id));
    const clubVisitant = clubs.find(c => c.id_club === parseInt(formData.club_visitant_id));

    if (!clubLocal || !clubVisitant) {
      setError('Clubes no válidos');
      return;
    }

    // Formatear hora
    let horaFormatted = formData.hora_partit;
    if (!horaFormatted.includes(':')) {
      horaFormatted = `${horaFormatted.substring(0, 2)}:${horaFormatted.substring(2)}`;
    }

    const dataToSend = {
      ...formData,
      club_local_id: parseInt(formData.club_local_id),
      club_visitant_id: parseInt(formData.club_visitant_id),
      nacio_local: clubLocal.id_nacio,
      nacio_visitant: clubVisitant.id_nacio,
      id_estadi: parseInt(formData.id_estadi),
      id_competicio: parseInt(formData.id_competicio),
      jornada: parseInt(formData.jornada),
      hora_partit: horaFormatted
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/partits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al crear el partido');
      }
      
      const result = await res.json();
      onPartitCreated(result.partit);
      onClose();
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

  if (loadingData) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚽</div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
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
              color: '#1f2937',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              ⚽ Crear Nuevo Partido
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Completa los datos para crear un nuevo partido
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6b7280';
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {/* Fecha */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📅 Fecha del Partido *
              </label>
              <input
                type="date"
                name="data_partit"
                value={formData.data_partit}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Hora */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🕐 Hora *
              </label>
              <input
                type="text"
                name="hora_partit"
                placeholder="HHMM o HH:MM (ej: 1530 o 15:30)"
                value={formData.hora_partit}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Jornada */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📋 Rango *
              </label>
              <input
                type="number"
                name="jornada"
                value={formData.jornada}
                onChange={handleChange}
                min="1"
                max="50"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Resultado */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                ⚽ Resultado
              </label>
              <input
                type="text"
                name="resultat"
                placeholder="Ej: 2-1 (opcional)"
                value={formData.resultat}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Club Local */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏠 Club Local *
              </label>
              <select
                name="club_local_id"
                value={formData.club_local_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar club local</option>
                {clubs.map(club => (
                  <option key={club.id_club} value={club.id_club}>
                    {club.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Club Visitante */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                ✈️ Club Visitante *
              </label>
              <select
                name="club_visitant_id"
                value={formData.club_visitant_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar club visitante</option>
                {clubs
                  .filter(club => club.id_club !== parseInt(formData.club_local_id))
                  .map(club => (
                    <option key={club.id_club} value={club.id_club}>
                      {club.nom}
                    </option>
                  ))}
              </select>
            </div>

            {/* Competición */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏆 Competición *
              </label>
              <select
                name="id_competicio"
                value={formData.id_competicio}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar competición</option>
                {competicions.map(comp => (
                  <option key={comp.id_competicio} value={comp.id_competicio}>
                    {comp.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Estadio */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏟️ Estadio *
              </label>
              <select
                name="id_estadi"
                value={formData.id_estadi}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Seleccionar estadio</option>
                {estadis.map(estadi => (
                  <option key={estadi.id_estadi} value={estadi.id_estadi}>
                    {estadi.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
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
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#9ca3af' : '#10b981',
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
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#10b981';
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
                  Creando...
                </>
              ) : (
                <>
                  ⚽ Crear Partido
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

export default CreatePartitModal;