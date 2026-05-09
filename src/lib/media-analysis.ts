export interface MediaAnalysisResponse {
  filename: string;
  authenticity: number;
  clone_probability: number;
  deepfake_score: number;
  verdict: string;
  lip_sync_drift: string;
  gan_artifacts: string;
  emotional_intent: string;
}

const ANALYZE_MEDIA_URL = "http://127.0.0.1:8000/analyze-media";

export async function analyzeMedia(file: File): Promise<MediaAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(ANALYZE_MEDIA_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Analysis request failed with status ${response.status}`);
  }

  return (await response.json()) as MediaAnalysisResponse;
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function formatFilename(file: File | null): string {
  return file?.name ?? "No file selected";
}