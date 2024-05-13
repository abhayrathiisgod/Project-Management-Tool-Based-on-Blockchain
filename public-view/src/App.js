import React, { useState, useEffect } from 'react';

function App() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/blocks');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setBlocks(data.blocks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Blocks</h1>
      {blocks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Hash</th>
              <th>Parent Hash</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block, index) => (
              <tr key={index}>
                <td>{block.number}</td>
                <td>{block.hash}</td>
                <td>{block.parentHash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default App;
