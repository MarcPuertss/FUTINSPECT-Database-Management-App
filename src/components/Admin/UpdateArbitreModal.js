import React, { useState, useEffect } from 'react';

const UpdateArbitreModal = ({ arbitre, onClose, onArbitreUpdated }) => {
  const [formData, setFormData] = useState({
    DNI: '',
    nom: '',
    data_naixement: '',
    nacionalitat: '',
    rang_arbitre: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Opciones de rangos de árbitro
  const rangosArbitre = [
    '1','2','3','4', '5'
   
  ];

  // Lista de nacionalidades comunes
  const nacionalidades = [
    'Española',
    'Francesa',
    'Italiana',
    'Alemana',
    'Portuguesa',
    'Brasileña',
    'Argentina',
    'Inglesa',
    'Holandesa',
    'Belga',
    'Croata',
    'Polaca',
    'Marroquí',
    'Senegalesa',
    'Colombiana',
    'Mexicana',
    'Chilena',
    'Uruguaya',
    'Peruana',
    'Ecuatoriana'
  ];

  // Cargar datos del árbitro al abrir el modal
  useEffect(() => {
    if (arbitre) {
      // Formatear la fecha para el input date
      const fechaFormateada = arbitre.data_naixement 
        ? new Date(arbitre.data_naixement).toISOString().split('T')[0]
        : '';

      setFormData({
        DNI: arbitre.dni || '',
        nom: arbitre.nom || '',
        data_naixement: fechaFormateada,
        nacionalitat: arbitre.nacionalitat || '',
        rang_arbitre: arbitre.rang_arbitre || ''
      });
    }
  }, [arbitre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { DNI, nom, data_naixement, nacionalitat, rang_arbitre } = formData;
    
    // Validar campos obligatorios
    if (!DNI || !nom || !data_naixement || !nacionalitat || !rang_arbitre) {
      return 'Todos los campos son obligatorios';
    }

    // Validar formato DNI español básico
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(DNI)) {
      return 'El DNI debe tener el formato: 12345678A';
    }

    // Validar fecha de nacimiento (no puede ser futura y debe ser mayor de edad)
    const fechaNacimiento = new Date(data_naixement);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    
    if (fechaNacimiento > hoy) {
      return 'La fecha de nacimiento no puede ser futura';
    }

    if (edad < 18) {
      return 'El árbitro debe tener al menos 18 años';
    }

    if (edad > 65) {
      return 'Por favor, verifica la fecha de nacimiento';
    }

    // Validar nombre (solo letras y espacios)
    const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/;
    if (!nameRegex.test(nom)) {
      return 'El nombre solo puede contener letras y espacios';
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

    const dataToSend = {
      ...formData,
      DNI: formData.DNI.toUpperCase()
    };

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/arbitres/${arbitre.dni}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al actualizar el árbitro');
      }
      
      onArbitreUpdated();
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

  if (!arbitre) return null;

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
              🏁 Actualizar Árbitro
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Modifica los datos de {arbitre.nom}
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
            {/* DNI */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🆔 DNI *
              </label>
              <input
                type="text"
                name="DNI"
                placeholder="12345678A"
                value={formData.DNI}
                onChange={handleChange}
                required
                maxLength="9"
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                  backgroundColor: '#f9fafb',
                  color: '#6b7280',
                  cursor: 'not-allowed'
                }}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontStyle: 'italic'
              }}>
                El DNI no se puede modificar
              </p>
            </div>

            {/* Nombre */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                👤 Nombre Completo *
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Nombre y apellidos"
                value={formData.nom}
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

            {/* Fecha de Nacimiento */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📅 Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="data_naixement"
                value={formData.data_naixement}
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

            {/* Nacionalidad */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🌍 Nacionalidad *
              </label>
              <select
                name="nacionalitat"
                value={formData.nacionalitat}
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
                <option value="">Seleccionar nacionalidad</option>
                {nacionalidades.map(nacionalidad => (
                  <option key={nacionalidad} value={nacionalidad}>
                    {nacionalidad}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de Árbitro */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏁 Rango de Árbitro *
              </label>
              <select
                name="rang_arbitre"
                value={formData.rang_arbitre}
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
                <option value="">Seleccionar rango</option>
                {rangosArbitre.map(rango => (
                  <option key={rango} value={rango}>
                    {rango}
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
                  🏁 Actualizar Árbitro
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

export default UpdateArbitreModal;