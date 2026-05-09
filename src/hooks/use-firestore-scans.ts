/**
 * Real-time Browser Scans Hook
 * Listens to Firestore in real-time and provides browser scan data
 */

import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase";
import { BrowserScan, DashboardStats } from "@/lib/firestore-types";
import { Timestamp } from "firebase/firestore";

/**
 * Hook for real-time browser scans
 * Listens to the 'browser_scans' collection and provides latest scans
 */
export function useBrowserScans(limitResults: number = 50) {
  const [scans, setScans] = useState<BrowserScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Create query for recent scans, ordered by timestamp descending
      const q = query(
        collection(db, "scanLogs"),
        orderBy("timestamp", "desc"),
        limit(limitResults)
      );

      // Set up real-time listener
      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
          const scanData: BrowserScan[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            scanData.push({
              id: doc.id,
              url: data.url,
              hostname: data.url ? new URL(data.url).hostname : "Unknown",
              browserTitle: data.browserTitle || "Scanned Site",
              favicon: data.favicon || "",
              trustScore: data.trustScore,
              threatLevel: data.threat,
              phishingRisk: data.phishingRisk,
              manipulationScore: data.manipulationRisk,
              riskFactors: data.riskFactors || [],
              aiExplanation: data.aiExplanation || "Analyzed by CipherNet AI",
              scannedAt: data.timestamp,
              userId: data.userId,
            });
          });

          setScans(scanData);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching browser scans:", err);
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to set up real-time listener:", err);
      setError(errorMsg);
      setLoading(false);
    }

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [limitResults]);

  return { scans, loading, error };
}

/**
 * Hook for real-time dashboard statistics
 * Calculates and updates stats based on all browser scans
 */
export function useDashboardStats() {
  const { scans, loading, error } = useBrowserScans(1000); // Get all scans for stats
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!scans || scans.length === 0) {
      setStats({
        totalScans: 0,
        threatsDetected: 0,
        averageTrustScore: 100,
        highThreats: 0,
        mediumThreats: 0,
        lowThreats: 0,
        safeSites: 0,
        lastUpdated: new Date(),
      });
      return;
    }

    // Calculate statistics
    const totalScans = scans.length;
    const highThreats = scans.filter((s) => s.threatLevel === "HIGH").length;
    const mediumThreats = scans.filter((s) => s.threatLevel === "MEDIUM").length;
    const lowThreats = scans.filter((s) => s.threatLevel === "LOW").length;
    const safeSites = scans.filter((s) => s.threatLevel === "SAFE").length;
    const threatsDetected = highThreats + mediumThreats + lowThreats;

    // Calculate average trust score
    const avgTrust =
      scans.length > 0
        ? Math.round(
            scans.reduce((sum, s) => sum + s.trustScore, 0) / scans.length
          )
        : 100;

    setStats({
      totalScans,
      threatsDetected,
      averageTrustScore: avgTrust,
      highThreats,
      mediumThreats,
      lowThreats,
      safeSites,
      lastUpdated: new Date(),
    });
  }, [scans]);

  return { stats, loading, error, scans };
}

/**
 * Hook for recent threat alerts
 * Returns the most recent threats
 */
export function useRecentThreats(limitResults: number = 10) {
  const { scans } = useBrowserScans(limitResults * 2);

  const threats = scans
    .filter((s) => s.threatLevel !== "SAFE")
    .slice(0, limitResults)
    .map((scan) => ({
      id: scan.id || "",
      url: scan.url,
      threatLevel: scan.threatLevel,
      trustScore: scan.trustScore,
      timestamp: scan.scannedAt instanceof Timestamp
        ? scan.scannedAt.toDate()
        : new Date(scan.scannedAt),
      reason: scan.riskFactors[0] || "Suspicious activity detected",
    }));

  return threats;
}

/**
 * Hook for recent safe sites (high trust score)
 */
export function useRecentTrustedSites(limitResults: number = 5) {
  const { scans } = useBrowserScans(limitResults * 3);

  const trustedSites = scans
    .filter((s) => s.trustScore >= 80)
    .slice(0, limitResults)
    .map((scan) => ({
      id: scan.id,
      hostname: scan.hostname,
      trustScore: scan.trustScore,
      timestamp: scan.scannedAt instanceof Timestamp
        ? scan.scannedAt.toDate()
        : new Date(scan.scannedAt),
    }));

  return trustedSites;
}
