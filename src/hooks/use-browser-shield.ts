/**
 * Browser Shield Hooks
 * Custom React hooks for threat monitoring and dashboard updates
 */

import { useEffect, useState, useRef, useCallback } from "react";
import {
  fetchThreats,
  fetchStats,
  type ThreatsResponse,
  type StatsData,
} from "@/lib/browser-shield-api";

// ============================================
// useThreats Hook - Fetch & monitor threats
// ============================================

export function useThreats(pollInterval: number = 3000) {
  const [threats, setThreats] = useState<ThreatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch threats once
  const loadThreats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchThreats(20);
      setThreats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch threats");
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up auto-polling for real-time updates
  useEffect(() => {
    // Load immediately
    loadThreats();

    // Set up interval for polling
    pollTimerRef.current = setInterval(() => {
      loadThreats();
    }, pollInterval);

    // Cleanup
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [loadThreats, pollInterval]);

  return { threats, loading, error, refetch: loadThreats };
}

// ============================================
// useStats Hook - Fetch & monitor statistics
// ============================================

export function useStats(pollInterval: number = 3000) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch stats once
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up auto-polling for real-time updates
  useEffect(() => {
    // Load immediately
    loadStats();

    // Set up interval for polling
    pollTimerRef.current = setInterval(() => {
      loadStats();
    }, pollInterval);

    // Cleanup
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [loadStats, pollInterval]);

  return { stats, loading, error, refetch: loadStats };
}

// ============================================
// useDashboardData Hook - Combined threats + stats
// ============================================

/**
 * Combined hook that fetches both threats and stats
 * Useful for dashboard pages that need both datasets
 */
export function useDashboardData(pollInterval: number = 3000) {
  const threatsData = useThreats(pollInterval);
  const statsData = useStats(pollInterval);

  const loading = threatsData.loading || statsData.loading;
  const error = threatsData.error || statsData.error;

  return {
    threats: threatsData.threats,
    stats: statsData.stats,
    loading,
    error,
    refetch: async () => {
      await threatsData.refetch();
      await statsData.refetch();
    },
  };
}
