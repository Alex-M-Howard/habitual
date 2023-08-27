/* Used to show alerts on the page */

import { useEffect, useState } from "react";

function useMessageTimer(initialState = null, delay = 2500) {
  const [message, setMessage] = useState(initialState);

  useEffect(() => {
    if (message) {
      const timeoutId = setTimeout(() => {
        setMessage(null);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [message, delay]);

  return [message, setMessage];
}

export default useMessageTimer;
