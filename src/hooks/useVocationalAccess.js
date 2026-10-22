import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import apiFetch from '@/lib/apiClient';
import { hasCompletedVocationalTest } from '@/lib/vocationalAccess';

export default function useVocationalAccess() {
  const { usuario, loading: authLoading } = useAuth();
  const userId = usuario?.id;
  const [state, setState] = useState({ userId: null, allowed: false, error: '', loading: true });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function check() {
      setState({ userId, allowed: false, error: '', loading: true });
      try {
        const allowed = await hasCompletedVocationalTest(apiFetch, userId, controller.signal);
        if (!controller.signal.aborted) setState({ userId, allowed, error: '', loading: false });
      } catch {
        if (!controller.signal.aborted) setState({ userId, allowed: false,
          error: 'No se pudo verificar tu test vocacional. Intenta nuevamente.', loading: false });
      }
    }
    if (!authLoading) check();
    return () => controller.abort();
  }, [userId, authLoading, revision]);

  const loading = authLoading || state.userId !== userId || state.loading;
  return { allowed: !loading && !state.error && state.allowed,
    loading, error: state.userId === userId ? state.error : '',
    retry: () => setRevision(value => value + 1) };
}
