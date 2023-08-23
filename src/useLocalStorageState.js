import { useEffect, useState } from "react"

export function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(function() {
        let storedValue = localStorage.getItem(key);
        storedValue = storedValue !== null ? storedValue : JSON.stringify(initialState);
        return JSON.parse(storedValue);
      });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
      },[value, key])
    
      return [value, setValue];
}