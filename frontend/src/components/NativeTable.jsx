import React from 'react';
import './NativeTable.css';
import { BsFolder } from "react-icons/bs";

const NativeTable = ({ data }) => {
  console.log("data", data);
  
  return (
    <table className="native-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Role</th>
          <th>Salary</th>
          <th>Join Date</th>
        </tr>
      </thead>
      <tbody>
        {!Array.isArray(data) || data.length === 0 ? (
          <tr>
            <td colSpan={5}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem 0",
                color: "var(--text-muted)"
              }}>
                <BsFolder size={48} />
                <h3 style={{ marginTop: '1rem' }}>No Results</h3>
              </div>
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.role}</td>
              <td>{item.salary}</td>
              <td>{item.join_date || '—'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default NativeTable;
