import { useCallback, useMemo, useState } from 'react';

export default function useRequestState() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const setIdle = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  const setLoading = useCallback(() => {
    setStatus('loading');
    setError(null);
  }, []);

  const setSuccess = useCallback(() => {
    setStatus('success');
    setError(null);
  }, []);

  const setFailure = useCallback((err) => {
    setStatus('error');
    setError(err instanceof Error ? err : new Error(String(err)));
  }, []);

  const api = useMemo(
    () => ({ status, error, setIdle, setLoading, setSuccess, setFailure }),
    [status, error, setIdle, setLoading, setSuccess, setFailure]
  );

  return api;
}
