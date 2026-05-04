import { useState, useEffect, useRef } from 'react';

type WasmStatus = 'idle' | 'loading' | 'ready' | 'error';

let wasmInitialised = false;

export function useWasm() {
  const [status, setStatus] = useState<WasmStatus>(wasmInitialised ? 'ready' : 'idle');
  const initialised = useRef(wasmInitialised);

  useEffect(() => {
    if (initialised.current) return;
    let cancelled = false;
    setStatus('loading');

    import('@resvg/resvg-wasm').then(async ({ initWasm }) => {
      try {
        // Fetch WASM from the package's CDN asset copied to public/
        await initWasm(fetch('/resvg_bg.wasm'));
        wasmInitialised = true;
        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error('[resvg-wasm] init failed:', err);
        if (!cancelled) setStatus('error');
      }
    });

    return () => { cancelled = true; };
  }, []);

  return { isReady: status === 'ready', isLoading: status === 'loading', status };
}
