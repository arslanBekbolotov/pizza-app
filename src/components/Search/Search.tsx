import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setFilterName } from "../../redux/slices/filterSlice";
import { debounce } from "lodash";

const Search = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const updateSearchValue = useRef(
    debounce((str: string) => {
      dispatch(setFilterName(str));
    }, 400),
  ).current;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    updateSearchValue(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      className="search_input"
      placeholder={"Поиск"}
      value={value}
      onChange={onChange}
    />
  );
};

export default Search;
