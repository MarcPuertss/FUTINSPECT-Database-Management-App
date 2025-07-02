import React, { useState } from 'react';

const CreateClubModal = ({ onClose, onClubCreated }) => {
  const [formData, setFormData] = useState({
    id_club: '',
    nom: '',
    ciutat: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { id_club, nom, ciutat } = formData;
    
    if (!id_club || !nom || !ciutat) {
      return 'Todos los campos son obligatorios';
    }

    // Validar que el ID sea un número positivo
    const idNumber = parseInt(id_club);
    if (isNaN(idNumber) || idNumber <= 0) {
      return 'El ID del club debe ser un número positivo';
    }

    // Validar longitud mínima del nombre
    if (nom.trim().length < 2) {
      return 'El nombre del club debe tener al menos 2 caracteres';
    }

    // Validar longitud mínima de la ciudad
    if (ciutat.trim().length < 2) {
      return 'El nombre de la ciudad debe tener al menos 2 caracteres';
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
      id_club: parseInt(formData.id_club),
      nom: formData.nom.trim(),
      ciutat: formData.ciutat.trim()
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error al crear el club');
      }
      
      const result = await res.json();
      onClubCreated(dataToSend);
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
              🏟️ Crear Nuevo Club
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '4px 0 0 0'
            }}>
              Completa los datos para crear un nuevo club
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
            {/* ID Club */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🔢 ID del Club *
              </label>
              <input
                type="number"
                name="id_club"
                placeholder="Ingrese el ID único del club"
                value={formData.id_club}
                onChange={handleChange}
                required
                min="1"
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

            {/* Nombre */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                ⚽ Nombre del Club *
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Ingrese el nombre del club"
                value={formData.nom}
                onChange={handleChange}
                required
                maxLength="100"
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
                placeholder="Ingrese la ciudad del club"
                value={formData.ciutat}
                onChange={handleChange}
                required
                maxLength="100"
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
                  🏟️ Crear Club
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

export default CreateClubModal;