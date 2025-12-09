import { LOBComplaints, Complaint } from "@/types/crisis";

export const mockComplaints: Complaint[] = [
  {
    id: "1",
    source: "twitter",
    content: "@company Your app is down! Can't access my account for 2 hours now. Very disappointed!",
    sentiment: "negative",
    timestamp: "2024-01-15T10:45:00Z",
    lob: "Payments",
  },
  {
    id: "2",
    source: "linkedin",
    content: "Facing consistent issues with the investment platform. Portfolio not updating correctly.",
    sentiment: "negative",
    timestamp: "2024-01-15T10:30:00Z",
    lob: "Investments",
  },
  {
    id: "3",
    source: "email",
    content: "Subject: Urgent - Loan application stuck. My loan application has been pending for 5 days without any update.",
    sentiment: "negative",
    timestamp: "2024-01-15T10:15:00Z",
    lob: "Lending",
  },
  {
    id: "4",
    source: "twitter",
    content: "Love the new UI update! Makes transactions so much easier. Great work team!",
    sentiment: "positive",
    timestamp: "2024-01-15T10:00:00Z",
    lob: "Payments",
  },
  {
    id: "5",
    source: "email",
    content: "Insurance claim still pending after 2 weeks. No response from support team.",
    sentiment: "negative",
    timestamp: "2024-01-15T09:45:00Z",
    lob: "Insurance",
  },
  {
    id: "6",
    source: "twitter",
    content: "@company Mutual fund redemption not working. Error every time I try. Fix this ASAP!",
    sentiment: "negative",
    timestamp: "2024-01-15T09:30:00Z",
    lob: "Investments",
  },
  {
    id: "7",
    source: "other",
    content: "App store review: 1 star - Worst experience ever. Money debited but transaction failed.",
    sentiment: "negative",
    timestamp: "2024-01-15T09:15:00Z",
    lob: "Payments",
  },
  {
    id: "8",
    source: "linkedin",
    content: "Great experience with the new banking features. Account opening was seamless.",
    sentiment: "positive",
    timestamp: "2024-01-15T09:00:00Z",
    lob: "Banking",
  },
];

export const mockLOBComplaints: LOBComplaints[] = [
  {
    lob: "Payments",
    total: 45,
    sources: [
      { 
        source: "twitter", 
        count: 25,
        issues: [
          { 
            category: "payment_failed", 
            count: 12, 
            label: "Payment Failed",
            subCategories: [
              { subCategory: "card_declined", count: 5, label: "Card Declined" },
              { subCategory: "insufficient_balance", count: 4, label: "Insufficient Balance" },
              { subCategory: "gateway_error", count: 3, label: "Gateway Error" },
            ]
          },
          { 
            category: "timeout", 
            count: 6, 
            label: "Timeout",
            subCategories: [
              { subCategory: "server_timeout", count: 4, label: "Server Timeout" },
              { subCategory: "network_timeout", count: 2, label: "Network Timeout" },
            ]
          },
          { 
            category: "app_crash", 
            count: 4, 
            label: "App Crash",
            subCategories: [
              { subCategory: "memory_issue", count: 2, label: "Memory Issue" },
              { subCategory: "null_pointer", count: 2, label: "Null Pointer" },
            ]
          },
          { 
            category: "other", 
            count: 3, 
            label: "Other",
            subCategories: [
              { subCategory: "miscellaneous", count: 3, label: "Miscellaneous" },
            ]
          },
        ]
      },
      { 
        source: "email", 
        count: 12,
        issues: [
          { 
            category: "payment_failed", 
            count: 5, 
            label: "Payment Failed",
            subCategories: [
              { subCategory: "transaction_declined", count: 3, label: "Transaction Declined" },
              { subCategory: "verification_failed", count: 2, label: "Verification Failed" },
            ]
          },
          { 
            category: "data_mismatch", 
            count: 4, 
            label: "Data Mismatch",
            subCategories: [
              { subCategory: "amount_mismatch", count: 2, label: "Amount Mismatch" },
              { subCategory: "account_mismatch", count: 2, label: "Account Mismatch" },
            ]
          },
          { 
            category: "other", 
            count: 3, 
            label: "Other",
            subCategories: [
              { subCategory: "general_inquiry", count: 3, label: "General Inquiry" },
            ]
          },
        ]
      },
      { 
        source: "linkedin", 
        count: 3,
        issues: [
          { 
            category: "slow_performance", 
            count: 2, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "page_load_slow", count: 2, label: "Page Load Slow" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "feature_request", count: 1, label: "Feature Request" },
            ]
          },
        ]
      },
      { 
        source: "other", 
        count: 5,
        issues: [
          { 
            category: "payment_failed", 
            count: 3, 
            label: "Payment Failed",
            subCategories: [
              { subCategory: "upi_failure", count: 2, label: "UPI Failure" },
              { subCategory: "bank_rejection", count: 1, label: "Bank Rejection" },
            ]
          },
          { 
            category: "ui_bugs", 
            count: 2, 
            label: "UI Bugs",
            subCategories: [
              { subCategory: "button_not_working", count: 1, label: "Button Not Working" },
              { subCategory: "layout_broken", count: 1, label: "Layout Broken" },
            ]
          },
        ]
      },
    ],
    trend: "up",
    complaints: [
      { id: "p1", source: "twitter", content: "@company Payment failed again! This is frustrating.", sentiment: "negative", timestamp: "2024-01-15T10:45:00Z", lob: "Payments", issueCategory: "payment_failed", subCategory: "card_declined" },
      { id: "p2", source: "twitter", content: "App crashed while making payment. Lost my money!", sentiment: "negative", timestamp: "2024-01-15T10:30:00Z", lob: "Payments", issueCategory: "app_crash", subCategory: "memory_issue" },
      { id: "p3", source: "email", content: "Transaction shows pending for 3 days now.", sentiment: "negative", timestamp: "2024-01-15T10:15:00Z", lob: "Payments", issueCategory: "payment_failed", subCategory: "transaction_declined" },
      { id: "p4", source: "twitter", content: "Love the new UI update! Makes transactions so much easier.", sentiment: "positive", timestamp: "2024-01-15T10:00:00Z", lob: "Payments" },
      { id: "p5", source: "other", content: "UPI payment keeps failing on your app.", sentiment: "negative", timestamp: "2024-01-15T09:45:00Z", lob: "Payments", issueCategory: "payment_failed", subCategory: "upi_failure" },
      { id: "p6", source: "twitter", content: "Timeout error every time I try to pay.", sentiment: "negative", timestamp: "2024-01-15T09:30:00Z", lob: "Payments", issueCategory: "timeout", subCategory: "server_timeout" },
    ],
  },
  {
    lob: "Investments",
    total: 78,
    sources: [
      { 
        source: "twitter", 
        count: 40,
        issues: [
          { 
            category: "app_crash", 
            count: 18, 
            label: "App Crash",
            subCategories: [
              { subCategory: "on_portfolio_view", count: 8, label: "On Portfolio View" },
              { subCategory: "on_trading", count: 6, label: "During Trading" },
              { subCategory: "on_startup", count: 4, label: "On Startup" },
            ]
          },
          { 
            category: "data_mismatch", 
            count: 12, 
            label: "Data Mismatch",
            subCategories: [
              { subCategory: "price_mismatch", count: 6, label: "Price Mismatch" },
              { subCategory: "holdings_incorrect", count: 4, label: "Holdings Incorrect" },
              { subCategory: "returns_wrong", count: 2, label: "Returns Wrong" },
            ]
          },
          { 
            category: "slow_performance", 
            count: 7, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "chart_loading", count: 4, label: "Chart Loading" },
              { subCategory: "order_execution", count: 3, label: "Order Execution" },
            ]
          },
          { 
            category: "other", 
            count: 3, 
            label: "Other",
            subCategories: [
              { subCategory: "misc", count: 3, label: "Miscellaneous" },
            ]
          },
        ]
      },
      { 
        source: "email", 
        count: 25,
        issues: [
          { 
            category: "data_mismatch", 
            count: 10, 
            label: "Data Mismatch",
            subCategories: [
              { subCategory: "statement_error", count: 5, label: "Statement Error" },
              { subCategory: "dividend_missing", count: 5, label: "Dividend Missing" },
            ]
          },
          { 
            category: "timeout", 
            count: 8, 
            label: "Timeout",
            subCategories: [
              { subCategory: "trading_timeout", count: 5, label: "Trading Timeout" },
              { subCategory: "report_timeout", count: 3, label: "Report Timeout" },
            ]
          },
          { 
            category: "login_issues", 
            count: 5, 
            label: "Login Issues",
            subCategories: [
              { subCategory: "otp_not_received", count: 3, label: "OTP Not Received" },
              { subCategory: "session_expired", count: 2, label: "Session Expired" },
            ]
          },
          { 
            category: "other", 
            count: 2, 
            label: "Other",
            subCategories: [
              { subCategory: "general", count: 2, label: "General" },
            ]
          },
        ]
      },
      { 
        source: "linkedin", 
        count: 8,
        issues: [
          { 
            category: "slow_performance", 
            count: 4, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "dashboard_slow", count: 4, label: "Dashboard Slow" },
            ]
          },
          { 
            category: "ui_bugs", 
            count: 3, 
            label: "UI Bugs",
            subCategories: [
              { subCategory: "chart_display", count: 2, label: "Chart Display" },
              { subCategory: "responsive_issues", count: 1, label: "Responsive Issues" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "suggestion", count: 1, label: "Suggestion" },
            ]
          },
        ]
      },
      { 
        source: "other", 
        count: 5,
        issues: [
          { 
            category: "app_crash", 
            count: 3, 
            label: "App Crash",
            subCategories: [
              { subCategory: "unknown_crash", count: 3, label: "Unknown Crash" },
            ]
          },
          { 
            category: "other", 
            count: 2, 
            label: "Other",
            subCategories: [
              { subCategory: "feedback", count: 2, label: "Feedback" },
            ]
          },
        ]
      },
    ],
    trend: "up",
    complaints: [
      { id: "i1", source: "twitter", content: "Portfolio value showing wrong. Fix this ASAP!", sentiment: "negative", timestamp: "2024-01-15T10:45:00Z", lob: "Investments", issueCategory: "data_mismatch", subCategory: "holdings_incorrect" },
      { id: "i2", source: "linkedin", content: "Dashboard is extremely slow to load.", sentiment: "negative", timestamp: "2024-01-15T10:30:00Z", lob: "Investments", issueCategory: "slow_performance", subCategory: "dashboard_slow" },
      { id: "i3", source: "email", content: "My dividend was not credited this month.", sentiment: "negative", timestamp: "2024-01-15T10:15:00Z", lob: "Investments", issueCategory: "data_mismatch", subCategory: "dividend_missing" },
      { id: "i4", source: "twitter", content: "App crashes every time I open my portfolio.", sentiment: "negative", timestamp: "2024-01-15T10:00:00Z", lob: "Investments", issueCategory: "app_crash", subCategory: "on_portfolio_view" },
      { id: "i5", source: "email", content: "OTP not coming for login. Very frustrating!", sentiment: "negative", timestamp: "2024-01-15T09:45:00Z", lob: "Investments", issueCategory: "login_issues", subCategory: "otp_not_received" },
    ],
  },
  {
    lob: "Lending",
    total: 32,
    sources: [
      { 
        source: "twitter", 
        count: 10,
        issues: [
          { 
            category: "slow_performance", 
            count: 5, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "application_slow", count: 3, label: "Application Slow" },
              { subCategory: "document_upload", count: 2, label: "Document Upload" },
            ]
          },
          { 
            category: "login_issues", 
            count: 3, 
            label: "Login Issues",
            subCategories: [
              { subCategory: "password_reset", count: 2, label: "Password Reset" },
              { subCategory: "account_locked", count: 1, label: "Account Locked" },
            ]
          },
          { 
            category: "other", 
            count: 2, 
            label: "Other",
            subCategories: [
              { subCategory: "general_query", count: 2, label: "General Query" },
            ]
          },
        ]
      },
      { 
        source: "email", 
        count: 18,
        issues: [
          { 
            category: "timeout", 
            count: 8, 
            label: "Timeout",
            subCategories: [
              { subCategory: "kyc_timeout", count: 5, label: "KYC Timeout" },
              { subCategory: "verification_timeout", count: 3, label: "Verification Timeout" },
            ]
          },
          { 
            category: "data_mismatch", 
            count: 6, 
            label: "Data Mismatch",
            subCategories: [
              { subCategory: "emi_calculation", count: 3, label: "EMI Calculation" },
              { subCategory: "interest_rate", count: 3, label: "Interest Rate" },
            ]
          },
          { 
            category: "other", 
            count: 4, 
            label: "Other",
            subCategories: [
              { subCategory: "status_inquiry", count: 4, label: "Status Inquiry" },
            ]
          },
        ]
      },
      { 
        source: "linkedin", 
        count: 2,
        issues: [
          { 
            category: "slow_performance", 
            count: 1, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "approval_delay", count: 1, label: "Approval Delay" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "process_feedback", count: 1, label: "Process Feedback" },
            ]
          },
        ]
      },
      { 
        source: "other", 
        count: 2,
        issues: [
          { 
            category: "ui_bugs", 
            count: 1, 
            label: "UI Bugs",
            subCategories: [
              { subCategory: "form_issue", count: 1, label: "Form Issue" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "misc_issue", count: 1, label: "Misc Issue" },
            ]
          },
        ]
      },
    ],
    trend: "stable",
    complaints: [
      { id: "l1", source: "email", content: "Loan application has been pending for 5 days without any update.", sentiment: "negative", timestamp: "2024-01-15T10:15:00Z", lob: "Lending", issueCategory: "timeout", subCategory: "kyc_timeout" },
      { id: "l2", source: "twitter", content: "Document upload is painfully slow.", sentiment: "negative", timestamp: "2024-01-15T10:00:00Z", lob: "Lending", issueCategory: "slow_performance", subCategory: "document_upload" },
      { id: "l3", source: "email", content: "EMI amount shown is different from what was promised.", sentiment: "negative", timestamp: "2024-01-15T09:45:00Z", lob: "Lending", issueCategory: "data_mismatch", subCategory: "emi_calculation" },
    ],
  },
  {
    lob: "Insurance",
    total: 18,
    sources: [
      { 
        source: "twitter", 
        count: 5,
        issues: [
          { 
            category: "slow_performance", 
            count: 2, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "claim_processing", count: 2, label: "Claim Processing" },
            ]
          },
          { 
            category: "timeout", 
            count: 2, 
            label: "Timeout",
            subCategories: [
              { subCategory: "document_upload", count: 2, label: "Document Upload" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "policy_query", count: 1, label: "Policy Query" },
            ]
          },
        ]
      },
      { 
        source: "email", 
        count: 10,
        issues: [
          { 
            category: "data_mismatch", 
            count: 4, 
            label: "Data Mismatch",
            subCategories: [
              { subCategory: "premium_error", count: 2, label: "Premium Error" },
              { subCategory: "coverage_mismatch", count: 2, label: "Coverage Mismatch" },
            ]
          },
          { 
            category: "timeout", 
            count: 3, 
            label: "Timeout",
            subCategories: [
              { subCategory: "claim_timeout", count: 3, label: "Claim Timeout" },
            ]
          },
          { 
            category: "login_issues", 
            count: 2, 
            label: "Login Issues",
            subCategories: [
              { subCategory: "portal_access", count: 2, label: "Portal Access" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "renewal_query", count: 1, label: "Renewal Query" },
            ]
          },
        ]
      },
      { 
        source: "linkedin", 
        count: 1,
        issues: [
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "product_feedback", count: 1, label: "Product Feedback" },
            ]
          },
        ]
      },
      { 
        source: "other", 
        count: 2,
        issues: [
          { 
            category: "ui_bugs", 
            count: 1, 
            label: "UI Bugs",
            subCategories: [
              { subCategory: "mobile_display", count: 1, label: "Mobile Display" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "app_review", count: 1, label: "App Review" },
            ]
          },
        ]
      },
    ],
    trend: "down",
    complaints: [
      { id: "in1", source: "email", content: "Insurance claim still pending after 2 weeks.", sentiment: "negative", timestamp: "2024-01-15T09:45:00Z", lob: "Insurance", issueCategory: "timeout", subCategory: "claim_timeout" },
      { id: "in2", source: "twitter", content: "Premium shown is higher than quoted.", sentiment: "negative", timestamp: "2024-01-15T09:30:00Z", lob: "Insurance", issueCategory: "data_mismatch", subCategory: "premium_error" },
    ],
  },
  {
    lob: "Banking",
    total: 12,
    sources: [
      { 
        source: "twitter", 
        count: 4,
        issues: [
          { 
            category: "login_issues", 
            count: 2, 
            label: "Login Issues",
            subCategories: [
              { subCategory: "biometric_fail", count: 1, label: "Biometric Fail" },
              { subCategory: "mpin_issue", count: 1, label: "MPIN Issue" },
            ]
          },
          { 
            category: "app_crash", 
            count: 1, 
            label: "App Crash",
            subCategories: [
              { subCategory: "on_transfer", count: 1, label: "On Transfer" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "feedback", count: 1, label: "Feedback" },
            ]
          },
        ]
      },
      { 
        source: "email", 
        count: 5,
        issues: [
          { 
            category: "data_mismatch", 
            count: 2, 
            label: "Data Mismatch",
            subCategories: [
              { subCategory: "balance_error", count: 1, label: "Balance Error" },
              { subCategory: "transaction_missing", count: 1, label: "Transaction Missing" },
            ]
          },
          { 
            category: "timeout", 
            count: 2, 
            label: "Timeout",
            subCategories: [
              { subCategory: "transfer_timeout", count: 2, label: "Transfer Timeout" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "account_query", count: 1, label: "Account Query" },
            ]
          },
        ]
      },
      { 
        source: "linkedin", 
        count: 2,
        issues: [
          { 
            category: "slow_performance", 
            count: 1, 
            label: "Slow Performance",
            subCategories: [
              { subCategory: "statement_download", count: 1, label: "Statement Download" },
            ]
          },
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "feature_suggestion", count: 1, label: "Feature Suggestion" },
            ]
          },
        ]
      },
      { 
        source: "other", 
        count: 1,
        issues: [
          { 
            category: "other", 
            count: 1, 
            label: "Other",
            subCategories: [
              { subCategory: "app_store_review", count: 1, label: "App Store Review" },
            ]
          },
        ]
      },
    ],
    trend: "down",
    complaints: [
      { id: "b1", source: "linkedin", content: "Great experience with the new banking features!", sentiment: "positive", timestamp: "2024-01-15T09:00:00Z", lob: "Banking" },
      { id: "b2", source: "twitter", content: "Biometric login keeps failing.", sentiment: "negative", timestamp: "2024-01-15T08:45:00Z", lob: "Banking", issueCategory: "login_issues", subCategory: "biometric_fail" },
    ],
  },
];
