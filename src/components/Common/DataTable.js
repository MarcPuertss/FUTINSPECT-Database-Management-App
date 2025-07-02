const DataTable = ({ data, columns }) => (
  <table>
    <thead>
      <tr>
        {columns.map((col, idx) => (
          <th key={idx}>{col.header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((item, idx) => (
        <tr key={idx}>
          {columns.map((col, j) => (
            <td key={j}>{item[col.key] || '-'}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;
