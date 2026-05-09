import { toast } from "sonner";
import React from "react";

export type NotificationType = "threat" | "success" | "warning" | "info";

/**
 * Enterprise cyber-style toast notifications
 */
export const showCyberNotification = (
  title: string,
  message?: string,
  type: NotificationType = "info"
) => {
  const configs = {
    threat: {
      icon: "🚨",
      style: { background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" },
    },
    success: {
      icon: "✓",
      style: { background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" },
    },
    warning: {
      icon: "⚠",
      style: { background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)" },
    },
    info: {
      icon: "ℹ",
      style: { background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)" },
    },
  };

  const config = configs[type];

  toast.custom(
    () =>
      React.createElement(
        "div",
        {
          className: "rounded-lg p-4 shadow-xl backdrop-blur-sm",
          style: config.style,
        },
        React.createElement(
          "div",
          { className: "flex items-start gap-3" },
          React.createElement("span", { className: "text-xl" }, config.icon),
          React.createElement(
            "div",
            null,
            React.createElement("div", { className: "font-semibold text-sm" }, title),
            message &&
              React.createElement(
                "div",
                { className: "text-xs text-muted-foreground mt-1" },
                message
              )
          )
        )
      ),
    {
      duration: 4000,
      position: "top-right",
    }
  );
};

export const threatNotifications = {
  urlDetected: () =>
    showCyberNotification(
      "🚨 High-Risk URL Detected",
      "Phishing domain identified in your input",
      "threat"
    ),
  scamProbabilityHigh: () =>
    showCyberNotification(
      "🚨 Credential Theft Attempt Found",
      "Message shows signs of sophisticated scam pattern",
      "threat"
    ),
  redirectChainSuspicious: () =>
    showCyberNotification(
      "⚠ Suspicious Redirect Chain",
      "URL contains multiple redirects to malicious domains",
      "warning"
    ),
  sslIssue: () =>
    showCyberNotification(
      "🚨 SSL Certificate Invalid",
      "HTTPS verification failed - potential man-in-the-middle attack",
      "threat"
    ),
  aiAnalysisComplete: () =>
    showCyberNotification(
      "✓ AI Threat Analysis Complete",
      "Threat intelligence engine has processed your input",
      "success"
    ),
  spoofingDetected: () =>
    showCyberNotification(
      "⚠ Authority Spoofing Detected",
      "Message impersonates legitimate organization",
      "warning"
    ),
  jobFraudDetected: () =>
    showCyberNotification(
      "🚨 Fake Recruiter Alert",
      "Job offer shows characteristics of employment fraud",
      "threat"
    ),
};
