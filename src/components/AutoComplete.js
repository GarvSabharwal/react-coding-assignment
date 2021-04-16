import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import PropTypes from "prop-types";

const AutoComplete = ({
  id,
  value,
  setValue,
  placeholder = "Search...",
  searchApi,
  idKey = (r) => r.id,
  labelKey = (r) => r.label,
  valueKey = (r) => r.value
}) => {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [isListClicked, setListClicked] = useState(false);

  const DELAY = 500;
  const debouncedSearch = useDebounce(value, DELAY);

  useEffect(() => {
    const fetchNames = async (search) => {
      try {
        setSearching(true);
        setResults([]);
        const res = await searchApi(search);
        setResults(res);
      } catch (err) {
        console.log(err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    };

    if (!isListClicked) fetchNames(debouncedSearch);
  }, [debouncedSearch, searchApi, isListClicked]);

  const handleKeyDown = (e) => {
    if (e.key === "Unidentified") setListClicked(true);
    else setListClicked(false);
  };

  return (
    <div>
      <div className="searchBox">
        <input
          type="text"
          list={`${id}-list`}
          className="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClick={(_) => setListClicked(false)}
          onKeyDown={handleKeyDown}
        />
        <datalist id={`${id}-list`}>
          {!searching &&
            results.length > 0 &&
            results.map((r) => (
              <option key={idKey(r)} value={valueKey(r)} label={labelKey(r)} />
            ))}
        </datalist>
      </div>
    </div>
  );
};

AutoComplete.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchApi: PropTypes.func.isRequired,
  idKey: PropTypes.func,
  labelKey: PropTypes.func,
  valueKey: PropTypes.func
};

export default AutoComplete;
