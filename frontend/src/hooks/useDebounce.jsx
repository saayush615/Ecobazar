import { useEffect, useState } from 'react';

const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
        // The cleanup function cancels the previous pending timer every time value changes, so only the most recent timer — the one from the last keystroke before the user paused — actually survives long enough to fire.
        // This "cancel old, start new" behavior is really the entire mechanism that makes debouncing work.
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;