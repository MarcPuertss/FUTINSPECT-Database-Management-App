const YearMonthFilter = ({ year, month, onYearChange, onMonthChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <label>Año: </label>
    <input type="number" value={year} onChange={e => onYearChange(e.target.value)} />
    <label> Mes: </label>
    <input type="number" value={month} onChange={e => onMonthChange(e.target.value)} />
  </div>
);

export default YearMonthFilter;

