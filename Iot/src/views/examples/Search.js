import React, { useState } from "react";
import { Input, Button, Table, Alert } from "reactstrap";

const ActionResultTable = ({ actionResults }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Action Type</th>
          <th>Device Type</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {actionResults.map((result) => (
          <tr key={result.id}>
            <td>{result.id}</td>
            <td>{result.action}</td>
            <td>{result.device}</td>
            <td>{new Date(result.time).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const SearchResultTable = ({ searchResults, dataType }) => {
  return (
    <div>
      {dataType === 'Data' ? (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              {/* <th>Temperature</th>
              <th>Humidity</th> */}
              <th>Moisture</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  {/* <td>{result.temperature}</td>
                  <td>{result.humidity}</td> */}
                  <td>{result.moisture_level}</td>
                  <td>{new Date(result.time_recorded).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No results found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <ActionResultTable actionResults={searchResults} />
      )}
    </div>
  );
};


const SearchComponent = ({ onSearch }) => {
  const [dataType, setDataType] = useState("Data");
  //const [temperature, setTemperature] = useState("");
  //const [humidity, setHumidity] = useState("");
  const [Moisture, setMoisture] = useState("");
  const [time, setTime] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [actionType, setActionType] = useState("");
  const [deviceType, setDeviceType] = useState("");

  const handleSearchClick = async () => {
    try {
      let apiUrl = 'http://localhost:8000/api/search';

      if (dataType === 'Action') {
        apiUrl += `?dataType=${dataType}&actionType=${actionType}&deviceType=${deviceType}`;
      } else {
        //apiUrl += `?dataType=${dataType}&temperature=${temperature}&humidity=${humidity}&moisture=${Moisture}&time=${time}`;
        apiUrl += `?dataType=${dataType}&moisture=${Moisture}&time=${time}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      const results = data.data;

      if (results.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setSearchResults(results);
        onSearch(results);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <div style={{ display: "flex" }}>
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          style={{ marginRight: "5px", marginTop: '120px' }}
        >
          <option value="Data">Data</option>
          <option value="Action">Action</option>
        </select>
        {dataType === "Action" && (
          <>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              style={{ marginRight: "5px", marginTop: '120px' }}
            >
            <option value="">All</option>

              <option value="ON">ON</option>
              <option value="OFF">OFF</option>
            </select>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              style={{ marginRight: "5px", marginTop: '120px' }}
            >
            <option value="">All</option>
              <option value="AUTO">AUTO</option>
              <option value="MANUAL">MANUAL</option>
            </select>
          </>
        )}
        {dataType === "Data" && (
          <>
            {/* <Input
              type="text"
              placeholder="Temperature..."
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              style={{ marginRight: "5px", marginTop: '120px' }}
            />
            <Input
              type="text"
              placeholder="Humidity..."
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              style={{ marginRight: "5px", marginTop: '120px' }}
            /> */}
            <Input
              type="text"
              placeholder="Moisture..."
              value={Moisture}
              onChange={(e) => setMoisture(e.target.value)}
              style={{ marginRight: "5px", marginTop: '120px' }}
            />
            <Input
              type="text"
              placeholder="Time..."
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ marginRight: "5px", marginTop: '120px' }}
            />
          </>
        )}
        <Button color="primary" onClick={handleSearchClick} style={{ marginTop: '120px' }}>
          Search
        </Button>
      </div>

      {noResults ? (
        <Alert color="info" style={{ marginTop: '10px' }}>
          No results found.
        </Alert>
      ) : (
        searchResults && <SearchResultTable searchResults={searchResults} dataType={dataType} />
      )}
    </div>
  );
};

export default SearchComponent;
