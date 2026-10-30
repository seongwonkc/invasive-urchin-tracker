import { useEffect, useEffectEvent, useState } from "react";

// Runs `loader(signal)` whenever `key` changes. Results are tagged with the key
// they belong to, so a stale response never shows under a newer selection.
export function useAsync(key, loader) {
  const [state, setState] = useState({ key: null, data: null, error: null });
  const run = useEffectEvent((signal) => loader(signal));

  useEffect(() => {
    if (key == null) return undefined;
    const controller = new AbortController();
    run(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ key, data, error: null });
      },
      (error) => {
        if (!controller.signal.aborted) setState({ key, data: null, error });
      }
    );
    return () => controller.abort();
  }, [key]);

  const current = key != null && state.key === key;
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: key != null && !current,
  };
}
