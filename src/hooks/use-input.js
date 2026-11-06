import React, { useState } from "react";

function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  const onChange = val => {
    if (!val || !val.target) return;
    setValue(val.target.value);
  };

  const onReset = () =>{
    setValue(defaultValue)
  }
  return { value, setValue, onChange, onReset };
}

export default useInput;
