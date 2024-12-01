import React, { useEffect, useState } from 'react';

function App() {
  const [nfcId, setNfcId] = useState(null);
  const [logs, setLogs] = useState([]);  // State to store log messages

  // Function to log messages to the log box with timestamp and function name
  const addLog = (message, functionName) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp} - ${functionName}: ${message}`;
    setLogs((prevLogs) => [...prevLogs, logMessage]); // Add new log to the state
  };

  useEffect(() => {
    // Check if Web NFC is supported
    if ('NFC' in window) {
      addLog('Web NFC is supported', 'useEffect');
    } else {
      addLog('Web NFC is not supported in this browser', 'useEffect');
    }
  }, []);

  const startNfcScan = async () => {
    try {
      // Request to read NFC card
      const nfcReader = new window.NFCReader();
      
      // Event listener for when NFC tag is detected
      nfcReader.onreading = (event) => {
        const { serialNumber } = event.serialNumber;
        setNfcId(serialNumber);  // Display NFC card ID
        addLog(`NFC Card detected! ID: ${serialNumber}`, 'nfcReader.onreading'); // Log NFC card detected
      };

      // Start the NFC reader
      await nfcReader.start();
      addLog('NFC scan started', 'startNfcScan');
    } catch (error) {
      console.error('NFC Error:', error);
      addLog(`Error: ${error.message}`, 'startNfcScan'); // Log error message
    }
  };

  return (
    <div className="App">
      <h1>NFC Card Reader</h1>
      
      {nfcId ? (
        <p>Card ID: {nfcId}</p>
      ) : (
        <p>No NFC card detected</p>
      )}
      <button onClick={startNfcScan}>Start NFC Scan</button>

      {/* Logs Box */}
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', maxHeight: '300px', overflowY: 'scroll', backgroundColor: '#f9f9f9' }}>
        <h3>Logs:</h3>
        <div>
          {logs.length === 0 ? (
            <p>No logs available.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {logs.map((log, index) => (
                <li key={index} style={{ margin: '5px 0', fontSize: '14px' }}>
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
