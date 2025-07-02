import React, { useEffect, useState } from 'react';
import { getCompeticions } from '../../api/apiService';
import CompeticionsCard from './CompeticionsCard';
import Loading from '../Common/Loading';

const CompeticionsPage = () => {
  const [competicions, setCompeticions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterOrganizer, setFilterOrganizer] = useState('all');

  useEffect(() => {
    const fetchCompeticions = async () => {
      try {
        const data = await getCompeticions();
        setCompeticions(data);
      } catch (error) {
        console.error('Error al cargar competiciones:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompeticions();
  }, []);

  // Función para filtrar competiciones
  const filteredCompeticions = competicions.filter(competicion => {
    const matchesSearch = competicion.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competicion.organitzador_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competicion.DNI_organitzador?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = filterYear === 'all' || competicion._any?.toString() === filterYear;
    
    const matchesOrganizer = filterOrganizer === 'all' || competicion.organitzador_nom === filterOrganizer;
    
    return matchesSearch && matchesYear && matchesOrganizer;
  });

  // Función para obtener años únicos
  const getUniqueYears = () => {
    const years = [...new Set(competicions.map(comp => comp._any).filter(year => year))];
    return years.sort((a, b) => b - a); // Orden descendente
  };

  // Función para obtener organizadores únicos
  const getUniqueOrganizers = () => {
    const organizers = [...new Set(competicions.map(comp => comp.organitzador_nom).filter(org => org))];
    return organizers.sort();
  };

  // Función para obtener estadísticas
  const getStats = () => {
    const totalCompeticions = competicions.length;
    const uniqueYears = getUniqueYears().length;
    const uniqueOrganizers = getUniqueOrganizers().length;
    
    const competicionsByYear = competicions.reduce((acc, comp) => {
      if (comp._any) {
        acc[comp._any] = (acc[comp._any] || 0) + 1;
      }
      return acc;
    }, {});
    
    const mostActiveYear = Object.entries(competicionsByYear).reduce((a, b) => 
      competicionsByYear[a[0]] > competicionsByYear[b[0]] ? a : b, ['', 0]
    );
    
    return { 
      totalCompeticions, 
      uniqueYears, 
      uniqueOrganizers,
      mostActiveYear: mostActiveYear[0], 
      mostActiveYearCount: mostActiveYear[1] 
    };
  };

  const stats = getStats();
  const uniqueYears = getUniqueYears();
  const uniqueOrganizers = getUniqueOrganizers();

  if (loading) return <Loading />;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '32px',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#1e293b',
          marginBottom: '16px',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          🏆 Competiciones
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0'
        }}>
          Explora todas las competiciones de la liga
        </p>
      </div>



      {/* Filtros y búsqueda */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Buscador */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, organizador o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Filtro por año */}
          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '120px'
              }}
            >
              <option value="all">Todos los años</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por organizador */}
          <div>
            <select
              value={filterOrganizer}
              onChange={(e) => setFilterOrganizer(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '180px'
              }}
            >
              <option value="all">Todos los organizadores</option>
              {uniqueOrganizers.map(organizer => (
                <option key={organizer} value={organizer}>
                  {organizer}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de resultados */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
            fontSize: '0.9rem',
            color: '#475569',
            fontWeight: '500'
          }}>
            {filteredCompeticions.length} de {competicions.length} competiciones
          </div>
        </div>
      </div>

      {/* Grid de competiciones */}
      {filteredCompeticions.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredCompeticions.map((competicion) => (
            <CompeticionsCard key={competicion.id_competicio || `${competicion.nom}-${competicion._any}`} competicion={competicion} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            No se encontraron competiciones
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterYear('all');
              setFilterOrganizer('all');
            }}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default CompeticionsPage;