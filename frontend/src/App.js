import { useState } from "react";
import axios from "axios";
import Select from "react-select";

function App() {
  const [jsonInput, setJsonInput] = useState('{"data": ["A","C","z"]}');
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      console.log(parsedInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid input format");
      }
      setError("");

      const apiResponse = await axios.post(
        "https://bajaj-git-main-rajesh-kumar-jashtis-projects.vercel.app/bfhl",
        parsedInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", apiResponse.data);
      setResponse(apiResponse.data);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          setError(`Server error: ${e.response.status} ${e.response.statusText}`);
        } else if (e.request) {
          setError(
            "No response received from server. Please check your network connection."
          );
        } else {
          setError("Error setting up the request: " + e.message);
        }
      } else {
        setError("Error: " + e.message);
      }
      console.error(e);
    }
  };

  const handleDropdownChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions.map((option) => option.value));
  };

  const renderResponse = () => {
    if (!response) return null;

    let filteredResponse = [];

    if (selectedOptions.includes("Alphabets") && response.alphabets) {
      filteredResponse.push("Alphabets: " + response.alphabets.join(", "));
    }
    if (selectedOptions.includes("Numbers") && response.numbers) {
      filteredResponse.push("Numbers: " + response.numbers.join(", "));
    }
    if (
      selectedOptions.includes("Highest alphabet") &&
      response.highest_alphabet &&
      response.highest_alphabet.length > 0
    ) {
      filteredResponse.push(
        "Highest alphabet: " + response.highest_alphabet[0]
      );
    }

    return (
      <>
        <ul style={{textAlign: "left", listStyleType: "none",paddingLeft: "0", fontWeight: "bold", color: "#333"}}>
        <h4>Filtered Responses</h4>
          {filteredResponse.map((item, index) => (
            <li key={index} style={{ marginBottom: "3px" }}>
              {item}
            </li>
          ))}
        </ul>
      </>
    );
  };

  const options = [
    { value: "Alphabets", label: "Alphabets" },
    { value: "Numbers", label: "Numbers" },
    { value: "Highest alphabet", label: "Highest alphabet" },
  ];

  return (
    <div style={{ position: "relative", textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
      <h1>JSON Input Form</h1>
      <label htmlFor="jsonInput" style={{ fontWeight: "bold", fontSize: "10px", paddingLeft: "5px", position: "absolute", top: "58px",left: "5px", background: "#FFF", color: "#005dac", textAlign: "left" }}>
        API Input
      </label>
      <input
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here (e.g., {"data": ["A","C","z"]})'
        style={{ width: "100%", padding: "10px", border: "2px solid #BDBDBD", borderRadius: "5px", color: "#333", fontSize: "16px", fontWeight: "550" }}
      />
      <button
        onClick={handleSubmit}
        style={{
          width: "622px",
          backgroundColor: "#005dac",
          color: "white",
          fontSize: "16px",
          fontWeight: "500",
          padding: "10px 20px",
          border: "none",
          marginTop: "10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {response && (
        <div style={{ width: "620px", marginTop: "10px" }}>
          <label style={{fontWeight: "bold", fontSize: "10px", paddingLeft: "5px", position: "absolute", top: "158px", left: "5px", zIndex: "1", background: "#FFF", color: "#005dac", textAlign: "left" }}>Multi Filter</label>
          <Select
            isMulti
            options={options}
            onChange={handleDropdownChange}
          />
          <div>{renderResponse()}</div>
        </div>
      )}
    </div>
  );
}

export default App;