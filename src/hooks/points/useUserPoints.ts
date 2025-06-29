
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserPoints, PointTransaction } from '@/types/points';

export const useUserPoints = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use refs to prevent multiple simultaneous fetch attempts and track mounted state
  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const lastUserIdRef = useRef<string | null>(null);

  const fetchAllData = useCallback(async (userId: string) => {
    if (isFetchingRef.current || !mountedRef.current) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setHasError(false);
      
      // Fetch both points and transactions in parallel
      const [pointsResult, transactionsResult] = await Promise.all([
        supabase
          .from('user_points')
          .select('*')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('point_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      if (!mountedRef.current) return;

      // Handle points result
      if (pointsResult.error && pointsResult.error.code !== 'PGRST116') {
        throw pointsResult.error;
      }
      setUserPoints(pointsResult.data || null);

      // Handle transactions result
      if (transactionsResult.error) {
        throw transactionsResult.error;
      }
      setTransactions(transactionsResult.data || []);

    } catch (error: any) {
      if (!mountedRef.current) return;
      
      console.error('Error fetching points data:', error);
      setHasError(true);
      
      // Only show toast for non-network errors
      if (error?.message !== 'Failed to fetch' && error?.message !== 'TypeError: Failed to fetch') {
        toast({
          title: 'Error',
          description: 'Failed to fetch points data',
          variant: 'destructive'
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [toast]);

  useEffect(() => {
    mountedRef.current = true;

    // Only fetch data when user is authenticated and auth is not loading
    if (!authLoading && user?.id && user.id !== lastUserIdRef.current) {
      console.log('Fetching points data for user:', user.id);
      lastUserIdRef.current = user.id;
      fetchAllData(user.id);
    } else if (!authLoading && !user) {
      // Clear data when user is not authenticated
      lastUserIdRef.current = null;
      setUserPoints(null);
      setTransactions([]);
      setIsLoading(false);
      setHasError(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [user?.id, authLoading, fetchAllData]);

  const refetch = useCallback(() => {
    if (user?.id && !isFetchingRef.current) {
      fetchAllData(user.id);
    }
  }, [user?.id, fetchAllData]);

  return {
    userPoints,
    transactions,
    isLoading: isLoading || authLoading,
    hasError,
    refetch
  };
};
