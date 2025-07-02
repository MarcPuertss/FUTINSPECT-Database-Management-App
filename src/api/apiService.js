const API_BASE = 'http://localhost:8000';

export const getPartits = async (year = null, month = null) => {
  let url = `${API_BASE}/partits`;
  const params = new URLSearchParams();
  if (year) params.append('year', year);
  if (month) params.append('month', month);
  const query = params.toString();
  if (query) url += `?${query}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al cargar partidos');
  return await response.json();
};

export const getJugadors = async (name = '') => {
  let url = `${API_BASE}/jugadors`;
  if (name) {
    const params = new URLSearchParams();
    params.append('name', name);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al cargar jugadores');
  return await response.json();
};


export const getArbitres = async () => {
  const response = await fetch(`${API_BASE}/arbitres`);
  if (!response.ok) throw new Error('Error al cargar árbitros');
  return await response.json();
};

export const getClubs = async () => {
  const response = await fetch(`${API_BASE}/clubs`);
  if (!response.ok) {
    console.error('Error status:', response.status);
    throw new Error('Error al cargar clubs');
  }
  return await response.json();
};

export const getEstadis = async () => {
  const response = await fetch(`${API_BASE}/estadis`);
  if (!response.ok) {
    console.error('Error status:', response.status);
    throw new Error('Error al cargar estadios');
  }
  return await response.json();
};

export const getCompeticions = async () => {
  const response = await fetch(`${API_BASE}/competicions`);
  if (!response.ok) {
    console.error('Error status:', response.status);
    throw new Error('Error al cargar competiciones');
  }
  return await response.json();
};

export const getCompeticioById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/competicions/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching competicion:', error);
    throw error;
  }
};
