import React from "react";
import { Link } from "react-router-dom";

function FutInspect() {
  const buttonStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    borderRadius: "15px",
    border: "2px solid #667eea",
    background: "white",
    color: "#333",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
    minHeight: "160px",
  };

  const buttonHover = (e) => {
    e.currentTarget.style.backgroundColor = "#667eea";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.7)";
    e.currentTarget.style.transform = "translateY(-5px)";
  };

  const buttonLeave = (e) => {
    e.currentTarget.style.backgroundColor = "white";
    e.currentTarget.style.color = "#333";
    e.currentTarget.style.boxShadow = "0 4px 10px rgba(102, 126, 234, 0.3)";
    e.currentTarget.style.transform = "translateY(0)";
  };

  const buttons = [
    {
      to: "/admin/partits",
      title: "🏆 Partidos",
      desc: "Consulta los partidos más emocionantes y sus resultados.",
    },
    {
      to: "/admin/jugadors",
      title: "⭐ Jugadores",
      desc: "Explora perfiles de jugadores destacados y estadísticas.",
    },
    {
      to: "/admin/arbitres",
      title: "🟨 Árbitros",
      desc: "Información sobre árbitros y sus actuaciones en partidos.",
    },
    {
      to: "/admin/clubs",
      title: "🏛️ Clubes",
      desc: "Descubre los clubes, su historia y plantillas actuales.",
    },
    {
      to: "/admin/estadis",
      title: "🏟️ Estadios",
      desc: "Conoce los estadios donde se disputan los partidos.",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)",
        minHeight: "100vh",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: "100px", padding: "40px 20px" }}>
          <h1
            style={{
              fontSize: "5rem",
              fontWeight: "bold",
              marginBottom: "30px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FUTINSPECT
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              color: "#64748b",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Descubre el mundo del fútbol: partidos emocionantes, jugadores
            estrella, árbitros profesionales y las mejores competiciones.
          </p>
          <div style={{ marginTop: "30px" }}>
            <span
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#667eea",
                background: "rgba(102, 126, 234, 0.1)",
                padding: "10px 20px",
                borderRadius: "25px",
                border: "2px solid #667eea",
              }}
            >
              ⚙️ ADMIN AREA
            </span>
          </div>
        </div>

        {/* Fila de 3 botones */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
            maxWidth: "900px",
            margin: "0 auto 60px",
          }}
        >
          {buttons.slice(0, 3).map(({ to, title, desc }) => (
            <Link
              key={to}
              to={to}
              style={buttonStyle}
              onMouseEnter={buttonHover}
              onMouseLeave={buttonLeave}
            >
              <span style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "12px" }}>
                {title}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#555",
                  textAlign: "center",
                  lineHeight: "1.4",
                }}
              >
                {desc}
              </span>
            </Link>
          ))}
        </div>

        {/* Fila de 2 botones centrados */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {buttons.slice(3).map(({ to, title, desc }) => (
            <Link
              key={to}
              to={to}
              style={buttonStyle}
              onMouseEnter={buttonHover}
              onMouseLeave={buttonLeave}
            >
              <span style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "12px" }}>
                {title}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#555",
                  textAlign: "center",
                  lineHeight: "1.4",
                }}
              >
                {desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FutInspect;
