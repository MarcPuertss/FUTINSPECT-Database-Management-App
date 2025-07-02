import React, { useState } from 'react';

const CreateArbitreModal = ({ onClose, onArbitreCreated }) => {
  const [formData, setFormData] = useState({
    DNI: '',
    nom: '',
    data_naixement: '',
    nacionalitat: '',
    rang_arbitre: 'Regional'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rangsArbitre = [
    '1','2','3','4','5'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { DNI, nom, data_naixement, nacionalitat } = formData;
    
    if (!DNI || !nom || !data_naixement || !nacionalitat) {
      return 'Todos los campos marcados con * son obligatorios';
    }

    // Validar formato DNI español (8 dígitos + 1 letra)
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(DNI)) {
      return 'El DNI debe tener el formato: 8 dígitos seguidos de una letra (ej: 12345678A)';
    }

    // Validar que la fecha no sea futura
    const selectedDate = new Date(data_naixement);
    const today = new Date();
    
    if (selectedDate > today) {
      return 'La fecha de nacimiento no puede ser futura';
    }

    // Validar edad mínima (18 años)
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0) || 
        (age === 18 && monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      return 'El árbitro debe tener al menos 18 años';
    }

    // Validar nombre (solo letras y espacios)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
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
      DNI: formData.DNI.toUpperCase(), // Convertir DNI a mayúsculas
      nom: formData.nom.trim()
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/arbitres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al crear el árbitro');
      }
      
      const result = await res.json();
      onArbitreCreated(result);
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
        maxWidth: '500px',
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
              👨‍⚖️ Crear Nuevo Árbitro
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Completa los datos para registrar un nuevo árbitro
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
            display: 'flex',
            flexDirection: 'column',
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
                maxLength="9"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
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
              <input
                type="text"
                name="nacionalitat"
                placeholder="Ej: Española"
                value={formData.nacionalitat}
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

            {/* Rango de Árbitro */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏅 Rango de Árbitro *
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
                {rangsArbitre.map(rang => (
                  <option key={rang} value={rang}>
                    {rang}
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
                minWidth: '140px',
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
                  Creando...
                </>
              ) : (
                <>
                  👨‍⚖️ Crear Árbitro
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

export default CreateArbitreModal;