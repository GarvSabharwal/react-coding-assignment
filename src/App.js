import AutoComplete from "./components/AutoComplete";
import "./styles.css";
import axios from "axios";
import { useState, useCallback } from "react";

const searchApi = async (term) => {
  try {
    const res = await axios.get(
      `https://rickandmortyapi.com/api/character/?name=${term}`
    );
    return res.data.results.map(({ id, name }) => ({ id, name }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default function App() {
  const [autoInput, setAutoInput] = useState("");
  const searchAPI = useCallback((term) => searchApi(term), []);

  return (
    <div className="App">
      <h1>Dynamic Input AutoComplete</h1>
      <h3>Rick And Morty API </h3>
      <label>Enter search name</label>
      <AutoComplete
        id={"nameSearch"}
        value={autoInput}
        setValue={setAutoInput}
        placeholder={"Enter Search Name"}
        searchApi={searchAPI}
        idKey={(r) => r.id}
        labelKey={(r) => r.id + "-" + r.name}
        valueKey={(r) => r.name}
      />
    </div>
  );
}
