import { useEffect, useRef } from "react";

const useOnOutsideClick = (trigger: () => void) => {
    const ref = useRef(null);

    const handleClickOutside = (event:Event) => {
            // @ts-expect-error - TS complains about ref.current being null, but it's just to prevent a React bug
        if (ref.current && !ref.current.contains(event.target)) {
            trigger();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return ref;
}

export default useOnOutsideClick