import TextInput from '../../../components/TextInput';
import styles from './SearchInput.module.css';
import { useState } from 'react';
import SearchIcon from '../../../assets/svg/Main/search.svg?react';

export default function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form className={styles.searchWrap} onSubmit={handleSubmit}>
      <TextInput
        type="text"
        value={value}
        placeholder="요리 검색"
        onChange={handleChange}
        className={styles.searchBar}
      />
      <button type="submit" className={styles.iconButton} aria-label="검색">
        <SearchIcon className={styles.icon} />
      </button>
    </form>
  );
}
