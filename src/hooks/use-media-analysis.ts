import { useState } from "react";
import { analyzeMedia, type MediaAnalysisResponse } from "@/lib/media-analysis";

export function useMediaAnalysis() {
  const [result, setResult] = useState<MediaAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeMedia(file);
      setResult(analysis);
      return analysis;
    } catch (analysisError) {
      const message = analysisError instanceof Error ? analysisError.message : "Failed to analyze media";
      setError(message);
      throw analysisError;
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    error,
    runAnalysis,
    setError,
    setResult,
  };
}