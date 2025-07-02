import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:8000/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

     if (response.ok && data.success) {
        console.log("Login exitoso");
        localStorage.setItem("isAdminAuthenticated", "true"); // 👈 guardamos el login
        navigate("/admin/futinspect");
     } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const inputFocusStyle = {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-2px)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(3px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(2px)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '5%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(4px)'
      }}></div>

      {/* Contenedor principal */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '50px 40px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '16px'
          }}>
            🔐
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            ADMIN LOGIN
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Accede al panel de administración de FUTINSPECT
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'shake 0.5s ease-in-out'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex',alignItems: "center", flexDirection: 'column', gap: '24px' }}>
          {/* Campo Usuario */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
              marginRight: '8px',
            }}>
              👤 Usuario
            </label>
            <input
              type="text"
             // placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
              
            />
          </div>

    {/* Campo Contraseña */}
    <div style={{ maxWidth: '300px' /* o el ancho que quieras */ }}>
    <label
        style={{
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px',
        }}
    >
        🔒 Contraseña
    </label>
    <div style={{ position: 'relative' }}>
        <input
        type={showPassword ? 'text' : 'password'}
        placeholder='Ingresa tu contraseña'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
            ...inputStyle,
            width: '100%',       // que ocupe todo el contenedor
            paddingRight: '40px' // espacio para el botón dentro del input
        }}
        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
        onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
        }}
        />
        <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        style={{
            position: 'absolute',
            right: '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '4px',
            color: '#64748b',
            userSelect: 'none'
        }}
        tabIndex={-1}
        >
        {showPassword ? '🙈' : '👁️'}
        </button>
    </div>
    </div>


          {/* Botón de Login */}
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            style={{
              ...buttonStyle,
              opacity: (isLoading || !username.trim() || !password.trim()) ? 0.6 : 1,
              cursor: (isLoading || !username.trim() || !password.trim()) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && username.trim() && password.trim()) {
                Object.assign(e.target.style, buttonHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                🚀 Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.9rem',
            margin: 0
          }}>
            🔒 Acceso seguro y protegido
          </p>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default AdminLogin;