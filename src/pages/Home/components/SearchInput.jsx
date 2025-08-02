import TextInput from '../../../components/TextInput';

export default function SearchInput({ onSearch }) {
  const handleChange = (e) => {
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <TextInput type="text" placeholder="요리 검색" onChange={handleChange} />
  );
}
