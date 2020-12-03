import { useRef, useEffect } from 'react';

type IntervalFunction = () => void;

function useInterval(cb: IntervalFunction, delay: number): void {
  const savedCallback = useRef<IntervalFunction>();

  useEffect(() => {
    savedCallback.current = cb;
  }, [cb]);

  useEffect(() => {
    function tick() {
      if (!savedCallback.current) {
        return;
      }

      savedCallback.current();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
