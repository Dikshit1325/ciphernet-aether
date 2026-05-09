/**
 * CipherNet Shield Extension Popup Script
 * Handles UI state management and Firestore integration
 */

let currentUrl = "";
let currentAnalysis = null;
let firebaseInitialized = false;

// Initialize Firebase when popup loads
document.addEventListener("DOMContentLoaded", async () => {
  await initializeFirebase();
  setupEventListeners();
});

/**
 * Initialize Firebase
 */
async function initializeFirebase() {
  try {
    if (window.firebase) {
      // Firebase loaded locally
      const firebaseConfig = {
        apiKey: "AIzaSyDzbRpcAIMIVqo3HGq4sMMKqek211WFtbs",
        authDomain: "cipherai-62911.firebaseapp.com",
        projectId: "cipherai-62911",
        storageBucket: "cipherai-62911.firebasestorage.app",
        messagingSenderId: "359120184830",
        appId: "1:359120184830:web:12ec4488477cee6af10caf",
      };

      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      firebaseInitialized = true;
      console.log("Firebase initialized successfully");
    } else {
      console.warn("Firebase not loaded locally");
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

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

    // Save to Firestore using REST API to completely bypass Manifest V3 WebChannel bugs
    if (firebaseInitialized) {
      console.log("Attempting to save to Firestore via REST...");
      
      const projectId = "cipherai-62911";
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/browser_scans`;
      
      // Transform data for Firestore REST API
      const fields = {};
      for (const [key, value] of Object.entries(scanData)) {
        if (value === undefined || value === null || key === 'scannedAt') continue;
        if (typeof value === 'string') fields[key] = { stringValue: value };
        else if (typeof value === 'number') fields[key] = { doubleValue: Number(value) };
        else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
        else if (Array.isArray(value)) fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: String(v) })) } };
      }
      // Add precise timestamp
      fields.scannedAt = { timestampValue: new Date().toISOString() };

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error.message);
        console.log("Scan saved to Firestore REST:", data.name);
        showStatusMessage("✓ Scan saved to dashboard");
      })
      .catch(error => {
        console.error("REST save error:", error);
        showStatusMessage("⚠️ Firestore unavailable");
      });
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

  if (firebaseInitialized) {
    const projectId = "cipherai-62911";
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/threat_reports`;

    const fields = {
      url: { stringValue: currentUrl },
      trustScore: { doubleValue: Number(currentAnalysis.trustScore) },
      threatLevel: { stringValue: currentAnalysis.threatLevel },
      riskFactors: { arrayValue: { values: currentAnalysis.riskFactors.map(v => ({ stringValue: String(v) })) } },
      reportedAt: { timestampValue: new Date().toISOString() },
      userComment: { stringValue: "Reported via extension" }
    };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error.message);
      showStatusMessage("✓ Threat reported successfully");
    })
    .catch(error => {
      console.error("REST report error:", error);
      showStatusMessage("⚠️ Failed to report threat");
    });
  }
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
