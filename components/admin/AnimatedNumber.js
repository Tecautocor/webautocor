import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export default function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString("es-EC") }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(prevValue.current, value || 0, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prevValue.current = value || 0;
    return () => controls.stop();
  }, [value]);

  return <>{format(display)}</>;
}
