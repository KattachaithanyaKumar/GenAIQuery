import './NativeTable.css';
import { BsFolder } from "react-icons/bs";

const NativeTable = ({ data }) => {
  // Extract headers dynamically from the first row of the data
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <table className="native-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header.replace(/_/g, ' ').toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!Array.isArray(data) || data.length === 0 ? (
          <tr>
            <td colSpan={headers.length || 1}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "2rem 0",
                  color: "var(--text-muted)"
                }}
              >
                <BsFolder size={48} />
                <h3 style={{ marginTop: '1rem' }}>No Results</h3>
              </div>
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{item[header] || '—'}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default NativeTable;
