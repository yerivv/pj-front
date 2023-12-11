import { useRouter } from "next/router";
import { useState, useRef } from "react";

const SearchBar = ({
  small,
  themeWhite,
  searchControl,
  setSearchControl,
  searchResult,
  setSearchResult,
  setBrandNameAutoComplete,
}) => {
  const router = useRouter();
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('상품이름이나온다');
  const [searchedValueArray, setSearchedValueArray] = useState([]);
  const [tempData, setTempData] = useState({});

  const searchBlurControl = e => {
    if (e.currentTarget !== e.target) return;

    setInputValue('');
    setSearchControl(false);
  };

  return (
    <>
  {searchControl && (
    <div className="searchBarBg"
      onClick={searchBlurControl}
      style={{ display: small ? 'none' : 'block' }}
    />
  )}
    <div className={`search-bar`}>
    <input
        type="search"
        ref={inputRef}
        placeholder="검색어를 입력해주세요."
        value={inputValue}
        onFocus={() => {
          setSearchControl(true);
          setInputValue('');
        }}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="button">검색</button>
    </div>
    </>
  )
}

export default SearchBar;