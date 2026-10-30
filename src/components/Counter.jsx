import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

const formatter = new Intl.NumberFormat("en-US");

export default function Counter({ value, className }) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const text = useTransform(motionValue, (latest) =>
    formatter.format(Math.round(latest))
  );

  useEffect(() => {
    const controls = animate(motionValue, value || 0, {
      duration: reduce ? 0 : 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [motionValue, reduce, value]);

  return <motion.span className={className}>{text}</motion.span>;
}
