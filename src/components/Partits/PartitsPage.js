// src/components/Partits/PartitsPage.js
import React, { useState, useEffect } from 'react';
import { getPartits } from '../../api/apiService';
import PartitCard from './PartitCard';
import Loading from '../Common/Loading';

const PartitsPage = () => {
  const [partits, setPartits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadPartits = async () => {
    setLoading(true);
    try {
      const data = await getPartits(year, month);
      // Limitar a los primeros 5000 resultados
      const limitedData = data.slice(0, 5000);
      setPartits(limitedData);
    } catch (error) {
      console.error('Error al cargar partidos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartits();
  }, [year, month]);

  // Función para obtener el nombre del mes
  const getMonthName = (monthNum) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[parseInt(monthNum) - 1] || '';
  };

  // Función para filtrar y ordenar partidos
  const filteredPartits = partits.filter(partit => {
    const clubLocal = typeof partit.club_local === 'string' ? partit.club_local : '';
    const clubVisitant = typeof partit.club_visitant === 'string' ? partit.club_visitant : '';
    const jornada = partit.jornada ? partit.jornada.toString() : '';
    
    const matchesSearch = 
      clubLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clubVisitant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jornada.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'finished' && partit.estat === 'finalitzat') ||
      (statusFilter === 'pending' && partit.estat !== 'finalitzat');
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Ordenar por fecha (del día 1 al 31 del mes)
    const dateA = new Date(a.data_partit || a.data || '1970-01-01');
    const dateB = new Date(b.data_partit || b.data || '1970-01-01');
    return dateA - dateB;
  });

  // Función para obtener estadísticas
  const getStats = () => {
    const totalPartits = partits.length;
    const finishedPartits = partits.filter(p => p.estat === 'finalitzat').length;
    const pendingPartits = totalPartits - finishedPartits;
    
    const totalGoals = partits.reduce((acc, partit) => {
      const goalsLocal = parseInt(partit.gols_local) || 0;
      const goalsVisitant = parseInt(partit.gols_visitant) || 0;
      return acc + goalsLocal + goalsVisitant;
    }, 0);

    const avgGoals = totalPartits > 0 ? (totalGoals / totalPartits).toFixed(1) : 0;
    
    return { 
      totalPartits, 
      finishedPartits, 
      pendingPartits, 
      totalGoals,
      avgGoals
    };
  };

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
          ⚽ Partidos
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          margin: '0'
        }}>
          Explora todos los partidos de la liga
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
        {/* Filtro de año y mes - Primera fila */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Selector de año */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📅 Año
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
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
                <option value="">Todos los años</option>
                {Array.from({ length: 16 }, (_, i) => 2025 - i).map(yearOption => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de mes */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📆 Mes
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '140px'
                }}
              >
                <option value="">Todos los meses</option>
                {[
                  { value: '1', name: 'Enero' },
                  { value: '2', name: 'Febrero' },
                  { value: '3', name: 'Marzo' },
                  { value: '4', name: 'Abril' },
                  { value: '5', name: 'Mayo' },
                  { value: '6', name: 'Junio' },
                  { value: '7', name: 'Julio' },
                  { value: '8', name: 'Agosto' },
                  { value: '9', name: 'Septiembre' },
                  { value: '10', name: 'Octubre' },
                  { value: '11', name: 'Noviembre' },
                  { value: '12', name: 'Diciembre' }
                ].map(monthOption => (
                  <option key={monthOption.value} value={monthOption.value}>
                    {monthOption.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón limpiar filtros de fecha */}
            {(year || month) && (
              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  onClick={() => {
                    setYear('');
                    setMonth('');
                  }}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  🗑️ Limpiar fechas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Línea divisoria */}
        <div style={{
          height: '1px',
          backgroundColor: '#e5e7eb',
          marginBottom: '20px'
        }}></div>

        {/* Búsqueda y filtros - Segunda fila */}
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
              placeholder="🔍 Buscar por equipo o jornada..."
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

          {/* Filtro por estado */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '150px'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="finished">Finalizados</option>
              <option value="pending">Pendientes</option>
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
            {filteredPartits.length} partidos
            {year && ` en ${year}`}
            {month && year && ` - ${getMonthName(month)}`}
          </div>
        </div>
      </div>

      {/* Grid de partidos */}
      {filteredPartits.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}>
          {filteredPartits.map((partit, index) => (
            <PartitCard key={`${partit.id_partit || index}`} partit={partit} />
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
            No se encontraron partidos
          </h3>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Intenta ajustar los filtros de búsqueda o seleccionar otro período
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setYear('');
              setMonth('');
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

export default PartitsPage;