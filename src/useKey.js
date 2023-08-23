import { useEffect } from "react";

export function useKey(keyCode, action) {
    useEffect(() => {
        function callback(e) {
          if(e.code.toLowerCase() === keyCode.toLowerCase()) {
            action();
            console.log('Cleaning up...')
          }
        }
        document.addEventListener("keydown", callback);
    
        return () => {
          document.removeEventListener("keydown", callback);
        }
      },[action, keyCode]);
}