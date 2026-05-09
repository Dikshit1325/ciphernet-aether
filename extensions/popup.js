/**
 * CipherNet Shield Extension Popup Script
 * Handles UI state management and Firestore integration
 */

import { initializeExtensionFirebase, saveBrowserScanToFirestore } from './utils/firebase.ts';
import { analyzeURL, getFaviconUrl, getHostname } from './analyzer.js';

let currentUrl = "";
let currentAnalysis = null;
let firebaseInitialized = false;

// Initialize Firebase when popup loads
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initializeExtensionFirebase();
    firebaseInitialized = true;
    console.log("Firebase initialized successfully for extension");
  } catch (err) {
    console.error("Firebase init error:", err);
  }
  setupEventListeners();
});

/**
 * Set up event listeners
 */
function setupEventListeners() {
  document.getElementById("scanBtn").addEventListener("click", performScan);
  document.getElementById("rescanBtn").addEventListener("click", performScan);
  document.getElementById("retryBtn").addEventListener("click", performScan);
  document.getElementById("reportBtn").addEventListener("click", reportThreat);
}

/**
 * Perform URL analysis and save to Firestore
 */
async function performScan() {
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    currentUrl = tab.url;
    const pageTitle = tab.title;

    // Show loading state
    showLoadingState();

    // Analyze URL using analyzer.js
    const analysis = analyzeURL(currentUrl);
    currentAnalysis = analysis;

    // Prepare data for Firestore
    const scanData = {
      url: currentUrl,
      hostname: getHostname(currentUrl),
      browserTitle: pageTitle,
      favicon: getFaviconUrl(currentUrl),
      trustScore: analysis.trustScore,
      threatLevel: analysis.threatLevel,
      phishingRisk: analysis.phishingRisk,
      manipulationScore: analysis.manipulationScore,
      riskFactors: analysis.riskFactors,
      aiExplanation: analysis.aiExplanation,
      scannedAt: new Date().toISOString(),
    };

    // Save to Firestore via extension helper
    if (firebaseInitialized) {
      console.log("Attempting to save to Firestore...");
      try {
        const docId = await saveBrowserScanToFirestore(scanData);
        console.log("Data saved successfully to Firestore with ID:", docId);
        showStatusMessage("✓ Scan saved to dashboard");
      } catch (error) {
        console.error("Firestore error:", error);
        showStatusMessage("⚠️ Failed to save scan");
      }
    } else {
      console.warn("Firebase not initialized");
      showStatusMessage("⚠️ Firebase not connected");
    }

    // Display results
    displayAnalysisResults(analysis, scanData);
    showResultContainer();
  } catch (error) {
    console.error("Scan error:", error);
    showErrorState(error.message);
  }
}

/**
 * Display analysis results in popup UI
 */
function displayAnalysisResults(analysis, scanData) {
  // Update threat indicator
  const threatIndicator = document.getElementById("threatIndicator");
  threatIndicator.className = `threat-indicator threat-${analysis.threatLevel.toLowerCase()}`;
  document.getElementById("threatLabel").textContent = analysis.threatLevel;

  // Update threat icon
  let icon = "✓";
  if (analysis.threatLevel === "HIGH") icon = "⚠️";
  else if (analysis.threatLevel === "MEDIUM") icon = "⚡";
  else if (analysis.threatLevel === "LOW") icon = "✓";
  document.querySelector(".threat-icon").textContent = icon;

  // Update URL display
  const hostname = getHostname(currentUrl);
  document.getElementById("urlText").textContent = hostname;

  // Set favicon
  const favicon = scanData.favicon;
  if (favicon) {
    document.getElementById("faviconImg").innerHTML =
      `<img src="${favicon}" alt="favicon" style="width: 20px; height: 20px; border-radius: 3px;">`;
  }

  // Update trust score gauge
  const trustScore = analysis.trustScore;
  document.getElementById("trustScore").textContent = trustScore;
  const gaugeCircle = document.getElementById("gaugeCircle");
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - trustScore / 100);
  gaugeCircle.style.strokeDasharray = circumference;
  gaugeCircle.style.strokeDashoffset = offset;

  // Update detailed analysis
  document.getElementById("phishingRisk").textContent = `${analysis.phishingRisk}%`;
  document.getElementById("phishingRisk").className =
    analysis.phishingRisk > 70
      ? "detail-value high"
      : analysis.phishingRisk > 40
      ? "detail-value medium"
      : "detail-value low";

  document.getElementById("threatLevel").textContent = analysis.threatLevel;
  document.getElementById("threatLevel").className =
    `detail-value ${analysis.threatLevel.toLowerCase()}`;

  document.getElementById("manipulationScore").textContent =
    `${analysis.manipulationScore}%`;
  document.getElementById("manipulationScore").className =
    analysis.manipulationScore > 50 ? "detail-value high" : "detail-value low";

  // Update risk factors
  const riskFactorsList = document.getElementById("riskFactors");
  riskFactorsList.innerHTML = "";
  analysis.riskFactors.forEach((factor) => {
    const li = document.createElement("li");
    li.textContent = factor;
    riskFactorsList.appendChild(li);
  });

  // Update AI explanation
  document.getElementById("aiExplanation").textContent = analysis.aiExplanation;
}

/**
 * Report threat to Firestore using REST API
 */
function reportThreat() {
  if (!currentAnalysis) return;

  if (!firebaseInitialized) {
    showStatusMessage("⚠️ Firebase not connected");
    return;
  }

  const reportData = {
    url: currentUrl,
    hostname: getHostname(currentUrl),
    browserTitle: document.title || "",
    trustScore: Number(currentAnalysis.trustScore),
    threatLevel: currentAnalysis.threatLevel,
    riskFactors: currentAnalysis.riskFactors,
    reportedAt: Date.now(),
    userComment: "Reported via extension",
    reported: true
  };

  saveBrowserScanToFirestore(reportData)
    .then((id) => {
      console.log("Report saved with ID:", id);
      showStatusMessage("✓ Threat reported successfully");
    })
    .catch((err) => {
      console.error("Report error:", err);
      showStatusMessage("⚠️ Failed to report threat");
    });
}

/**
 * UI State Management Functions
 */

function showLoadingState() {
  document.getElementById("initialState").classList.add("hidden");
  document.getElementById("resultContainer").classList.add("hidden");
  document.getElementById("errorState").classList.add("hidden");
  document.getElementById("loadingState").classList.remove("hidden");
}

function showResultContainer() {
  document.getElementById("initialState").classList.add("hidden");
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("errorState").classList.add("hidden");
  document.getElementById("resultContainer").classList.remove("hidden");
}

function showErrorState(message) {
  document.getElementById("initialState").classList.add("hidden");
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("resultContainer").classList.add("hidden");
  document.getElementById("errorState").classList.remove("hidden");
  document.getElementById("errorMessage").textContent = message || "An error occurred";
}

function showStatusMessage(message) {
  const statusMsg = document.getElementById("statusMessage");
  statusMsg.textContent = message;
  statusMsg.classList.add("visible");

  // Hide after 3 seconds
  setTimeout(() => {
    statusMsg.classList.remove("visible");
  }, 3000);
}
