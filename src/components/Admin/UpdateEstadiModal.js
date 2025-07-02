import React, { useState, useEffect } from 'react';

const UpdateEstadiModal = ({ estadi, onClose, onEstadiUpdated }) => {
  const [formData, setFormData] = useState({
    nom: '',
    ciutat: '',
    capacitat: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lista de ciudades españolas comunes
  const ciutats = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Zaragoza',
    'Málaga',
    'Murcia',
    'Palma',
    'Las Palmas',
    'Bilbao',
    'Alicante',
    'Córdoba',
    'Valladolid',
    'Vigo',
    'Gijón',
    'L\'Hospitalet',
    'Granada',
    'Vitoria',
    'A Coruña',
    'Elche',
    'Oviedo',
    'Santa Cruz de Tenerife',
    'Badalona',
    'Cartagena',
    'Terrassa',
    'Jerez de la Frontera',
    'Sabadell',
    'Móstoles',
    'Alcalá de Henares',
    'Pamplona'
  ];

  // Cargar datos del estadio al abrir el modal
  useEffect(() => {
    if (estadi) {
      setFormData({
        nom: estadi.nom || '',
        ciutat: estadi.ciutat || '',
        capacitat: estadi.capacitat?.toString() || ''
      });
    }
  }, [estadi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { nom, ciutat, capacitat } = formData;
    
    // Validar campos obligatorios
    if (!nom || !ciutat || !capacitat) {
      return 'Todos los campos son obligatorios';
    }

    // Validar capacidad
    const capacidadNum = parseInt(capacitat);
    if (isNaN(capacidadNum) || capacidadNum < 1000 || capacidadNum > 200000) {
      return 'La capacidad debe estar entre 1,000 y 200,000 espectadores';
    }

    // Validar nombre (solo letras, números, espacios y algunos caracteres especiales)
    const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s0-9'.-]+$/;
    if (!nameRegex.test(nom)) {
      return 'El nombre solo puede contener letras, números, espacios y caracteres básicos';
    }

    // Validar ciudad (solo letras y espacios)
    const ciutatRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s'.-]+$/;
    if (!ciutatRegex.test(ciutat)) {
      return 'La ciudad solo puede contener letras, espacios y caracteres básicos';
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

    // Verificar que tenemos el ID del estadio
    if (!estadi?.id_estadi) {
      setError('Error: No se puede identificar el estadio a actualizar');
      return;
    }

    const dataToSend = {
      id_estadi: estadi.id_estadi, // Mantener el ID original
      nom: formData.nom.trim(),
      ciutat: formData.ciutat.trim(),
      capacitat: parseInt(formData.capacitat),
      _any: estadi._any // Mantener el año original sin cambios
    };

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/estadis/${estadi.id_estadi}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al actualizar el estadio');
      }
      
      onEstadiUpdated();
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

  if (!estadi) return null;

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
              🏟️ Actualizar Estadio
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Modifica los datos de {estadi.nom}
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
            {/* ID Estadio - Solo lectura */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🆔 ID Estadio
              </label>
              <input
                type="text"
                value={estadi.id_estadi || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
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
                El ID del estadio no se puede modificar
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
                🏟️ Nombre del Estadio *
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Nombre del estadio"
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

            {/* Ciudad */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏙️ Ciudad *
              </label>
              <input
                type="text"
                name="ciutat"
                placeholder="Nombre de la ciudad"
                value={formData.ciutat}
                onChange={handleChange}
                required
                list="ciutats-list"
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
              <datalist id="ciutats-list">
                {ciutats.map(ciutat => (
                  <option key={ciutat} value={ciutat} />
                ))}
              </datalist>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Puedes escribir cualquier ciudad o seleccionar de las sugerencias
              </p>
            </div>

            {/* Capacidad */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                👥 Capacidad *
              </label>
              <input
                type="number"
                name="capacitat"
                placeholder="50000"
                value={formData.capacitat}
                onChange={handleChange}
                required
                min="1000"
                max="200000"
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
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Entre 1,000 y 200,000 espectadores
              </p>
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
                  🏟️ Actualizar Estadio
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

export default UpdateEstadiModal;