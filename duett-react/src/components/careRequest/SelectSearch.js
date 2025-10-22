import { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

function AutocompleteInstantSelect(props) {
  const { options, getOptionLabel, onChange } = props;
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const handleInputChange = (event, value) => {
    setInputValue(value);
    setSelectedOption(null);
  };

  const handleOptionSelect = (event, value) => {
    setInputValue(getOptionLabel(value));
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleOptionSelect}
      onError={handleError}
      renderInput={(params) => (
        <TextField {...params} placeholder="Search" variant="outlined" />
      )}
    />
  );
}

export default AutocompleteInstantSelect;
