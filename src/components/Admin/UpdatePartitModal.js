import React, { useState, useEffect } from 'react';

const UpdatePartitModal = ({ partit, onClose, onPartitUpdated }) => {
  const [formData, setFormData] = useState({
    club_local_id: '',
    club_visitant_id: '',
    nacio_local: '',
    nacio_visitant: '',
    data_partit: '',
    hora_partit: '',
    jornada: '',
    id_competicio: '',
    id_estadi: '',
    id_fase: '',
    resultat: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [nacions, setNacions] = useState([]);
  const [competicions, setCompeticions] = useState([]);
  const [estadis, setEstadis] = useState([]);
  const [fases, setFases] = useState([]);

  // Cargar datos de referencia
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        // Cargar clubs, naciones, competiciones, estadios y fases en paralelo
        const [clubsRes, nacionsRes, competicionsRes, estadisRes, fasesRes] = await Promise.all([
          fetch('http://localhost:8000/clubs'),
          fetch('http://localhost:8000/nacions'),
          fetch('http://localhost:8000/competicions'),
          fetch('http://localhost:8000/estadis'),
          fetch('http://localhost:8000/fases')
        ]);

        if (clubsRes.ok) setClubs(await clubsRes.json());
        if (nacionsRes.ok) setNacions(await nacionsRes.json());
        if (competicionsRes.ok) setCompeticions(await competicionsRes.json());
        if (estadisRes.ok) setEstadis(await estadisRes.json());
        if (fasesRes.ok) setFases(await fasesRes.json());
      } catch (error) {
        console.error('Error cargando datos de referencia:', error);
      }
    };

    loadReferenceData();
  }, []);

  // Cargar datos del partit al abrir el modal
  useEffect(() => {
    if (partit) {
      // Formatear la fecha para el input date
      const fechaFormateada = partit.data 
        ? new Date(partit.data).toISOString().split('T')[0]
        : '';

      // Convertir hora de minutos a formato HH:MM
      const formatearHora = (minutos) => {
        if (!minutos && minutos !== 0) return '';
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      };

      setFormData({
        club_local_id: partit.club_local?.toString() || '',
        club_visitant_id: partit.club_visitant?.toString() || '',
        nacio_local: partit.nacio_local?.toString() || '',
        nacio_visitant: partit.nacio_visitant?.toString() || '',
        data_partit: fechaFormateada,
        hora_partit: formatearHora(partit.hora),
        jornada: partit.rang_partit?.toString() || '',
        id_competicio: partit.id_competicio?.toString() || '',
        id_estadi: partit.id_estadi?.toString() || '',
        id_fase: partit.id_fase?.toString() || '',
        resultat: partit.resultat || ''
      });
    }
  }, [partit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { data_partit, hora_partit, jornada, id_competicio, id_estadi } = formData;
    
    // Validar campos obligatorios
    if (!data_partit || !hora_partit || !jornada || !id_competicio || !id_estadi) {
      return 'Los campos fecha, hora, jornada, competición y estadio son obligatorios';
    }

    // Validar que tenga al menos un equipo (club o nación) local y visitante
    const hasLocalTeam = formData.club_local_id || formData.nacio_local;
    const hasVisitantTeam = formData.club_visitant_id || formData.nacio_visitant;
    
    if (!hasLocalTeam || !hasVisitantTeam) {
      return 'Debe especificar equipos (club o nación) local y visitante';
    }

    // Validar que no sean el mismo club
    if (formData.club_local_id && formData.club_visitant_id) {
      if (formData.club_local_id === formData.club_visitant_id) {
        return 'El club local y visitante no pueden ser el mismo';
      }
    }

    // Validar que no sean la misma nación
    if (formData.nacio_local && formData.nacio_visitant) {
      if (formData.nacio_local === formData.nacio_visitant) {
        return 'La nación local y visitante no pueden ser la misma';
      }
    }

    // Validar formato de hora
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(hora_partit)) {
      return 'El formato de hora debe ser HH:MM (ejemplo: 15:30)';
    }

    // Validar jornada
    const jornada_num = parseInt(jornada);
    if (isNaN(jornada_num) || jornada_num < 1 || jornada_num > 50) {
      return 'La jornada debe ser un número entre 1 y 50';
    }

    // Validar fecha (no puede ser anterior a hoy para partidos futuros)
    const fechaPartit = new Date(data_partit);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaPartit < hoy) {
      // Permitir fechas pasadas pero mostrar advertencia
      console.log('Fecha de partido en el pasado');
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

    // Preparar datos para enviar
    const dataToSend = {
      data_partit: formData.data_partit,
      hora_partit: formData.hora_partit,
      jornada: parseInt(formData.jornada),
      id_competicio: parseInt(formData.id_competicio),
      id_estadi: parseInt(formData.id_estadi),
      resultat: formData.resultat
    };

    // Agregar equipos solo si están especificados
    if (formData.club_local_id) {
      dataToSend.club_local_id = parseInt(formData.club_local_id);
    }
    if (formData.club_visitant_id) {
      dataToSend.club_visitant_id = parseInt(formData.club_visitant_id);
    }
    if (formData.nacio_local) {
      dataToSend.nacio_local = parseInt(formData.nacio_local);
    }
    if (formData.nacio_visitant) {
      dataToSend.nacio_visitant = parseInt(formData.nacio_visitant);
    }
    if (formData.id_fase) {
      dataToSend.id_fase = parseInt(formData.id_fase);
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/partits/${partit.id_partit}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al actualizar el partido');
      }
      
      onPartitUpdated();
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

  if (!partit) return null;

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
        maxWidth: '800px',
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
              ⚽ Actualizar Partido
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Modifica los datos del partido #{partit.id_partit}
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
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
                🕐 Hora del Partido *
              </label>
              <input
                type="time"
                name="hora_partit"
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Rang */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                ⚖️ Rango *
              </label>
              <input
                type="number"
                name="jornada"
                placeholder="1-50"
                value={formData.jornada}
                onChange={handleChange}
                required
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
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

          {/* Sección de Equipos */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👥 Equipos
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Equipo Local */}
              <div style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#f8fafc'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🏠 Equipo Local
                </h4>
                  <select
                    name="club_local_id"
                    value={formData.club_local_id}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Seleccionar club</option>
                    {clubs.map(club => (
                      <option key={club.id_club} value={club.id_club}>
                        {club.nom}
                      </option>
                    ))}
                  </select>

              </div>

              {/* Equipo Visitante */}
              <div style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#f8fafc'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ✈️ Equipo Visitante
                </h4>
                  <select
                    name="club_visitant_id"
                    value={formData.club_visitant_id}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Seleccionar club</option>
                    {clubs.map(club => (
                      <option key={club.id_club} value={club.id_club}>
                        {club.nom}
                      </option>
                    ))}
                  </select>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div style={{ marginTop: '24px' }}>
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
              placeholder="Ej: 2-1, 0-0, etc."
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
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
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
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
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
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#3b82f6';
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
                  Actualizando...
                </>
              ) : (
                <>
                  ⚽ Actualizar Partido
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

export default UpdatePartitModal;