import { useRef } from "react";

const useDebouncer = () => {
    const timeoutIdRef = useRef(null);

    const debouncedFunction = (func,delay,params=null,setState=()=>{}) => {
      // Clear the previous timeout if it exists
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
  
      // Set a new timeout
      timeoutIdRef.current = setTimeout(() => {
        func(params,setState);
      }, delay);
    };
  // Call debouncedFetchData whenever formData or currentPage changes
  

  return {debouncedFunction};
};

export default useDebouncer