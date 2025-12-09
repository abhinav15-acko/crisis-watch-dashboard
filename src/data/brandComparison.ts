export interface CompanyPerformance {
  analysis_keywords?: {
    name: string;
    sentiment: string;
  }[];
  avg_engagement: {
    likes: number;
    retweets: number;
  };
  category_breakdown: {
    "App/Digital Experience": number;
    Claims: number;
    "Customer Service": number;
    "General/Others": number;
    "Policy/Renewal": number;
  };
  key_insight: string;
  sentiment_counts: {
    negative: number;
    neutral: number;
    positive: number;
  };
  sentiment_score: number;
  total_tweets: number;
}

export interface BrandComparisonData {
  data: {
    company_performance: Record<string, CompanyPerformance>;
    comparative_analysis: {
      best_customer_service: string;
      highest_claims_complaints: string;
      highest_negative_sentiment: string;
      summary: string;
    };
  };
  message: string;
  success: boolean;
}

export const brandComparisonData: BrandComparisonData = {
  data: {
    company_performance: {
      ACKO: {
        analysis_keywords: [
          {
            name: "claims",
            sentiment: "negative",
          },
          {
            name: "digital experience",
            sentiment: "positive",
          },
          {
            name: "video inspection",
            sentiment: "positive",
          },
          {
            name: "zero depreciation",
            sentiment: "positive",
          },
          {
            name: "delays",
            sentiment: "negative",
          },
          {
            name: "surveyor",
            sentiment: "negative",
          },
        ],
        avg_engagement: {
          likes: 24.29,
          retweets: 3.69,
        },
        category_breakdown: {
          "App/Digital Experience": 13,
          Claims: 19,
          "Customer Service": 1,
          "General/Others": 8,
          "Policy/Renewal": 8,
        },
        key_insight:
          "ACKO excels in digital experience with positive feedback on its app and UI/UX, but faces significant challenges with its claims process, which is frequently described as slow, disappointing, and prone to rejections.",
        sentiment_counts: {
          negative: 19,
          neutral: 17,
          positive: 13,
        },
        sentiment_score: -0.122,
        total_tweets: 49,
      },
      Digit: {
        analysis_keywords: [
          {
            name: "claims",
            sentiment: "negative",
          },
          {
            name: "customer service",
            sentiment: "negative",
          },
          {
            name: "pricing",
            sentiment: "positive",
          },
          {
            name: "delays",
            sentiment: "negative",
          },
          {
            name: "query loop",
            sentiment: "positive",
          },
        ],
        avg_engagement: {
          likes: 30.04,
          retweets: 4.04,
        },
        category_breakdown: {
          "App/Digital Experience": 4,
          Claims: 19,
          "Customer Service": 7,
          "General/Others": 8,
          "Policy/Renewal": 11,
        },
        key_insight:
          "Digit struggles significantly with claims processing, which is frequently cited as slow and prone to delays and rejections. Customer service is also a major pain point, with users reporting unhelpful agents and IVR issues. However, the company receives positive feedback for its competitive pricing and value-for-money policies.",
        sentiment_counts: {
          negative: 31,
          neutral: 8,
          positive: 10,
        },
        sentiment_score: -0.429,
        total_tweets: 49,
      },
      HDFC: {
        analysis_keywords: [
          {
            name: "customer service",
            sentiment: "positive",
          },
          {
            name: "premium",
            sentiment: "negative",
          },
          {
            name: "claims",
            sentiment: "negative",
          },
          {
            name: "policy cost",
            sentiment: "negative",
          },
          {
            name: "charges",
            sentiment: "negative",
          },
        ],
        avg_engagement: {
          likes: 34.96,
          retweets: 4.04,
        },
        category_breakdown: {
          "App/Digital Experience": 0,
          Claims: 3,
          "Customer Service": 12,
          "General/Others": 15,
          "Policy/Renewal": 19,
        },
        key_insight:
          "HDFC ERGO receives strong positive feedback for its customer service, with agents being described as patient, helpful, and responsive. However, a significant number of complaints revolve around policy renewal issues, particularly unexpected premium hikes and a lack of transparency regarding charges. Claims processing also sees some negative feedback.",
        sentiment_counts: {
          negative: 21,
          neutral: 13,
          positive: 15,
        },
        sentiment_score: -0.122,
        total_tweets: 49,
      },
      ICICI: {
        analysis_keywords: [
          {
            name: "claims",
            sentiment: "negative",
          },
          {
            name: "customer service",
            sentiment: "negative",
          },
          {
            name: "pricing",
            sentiment: "positive",
          },
          {
            name: "delays",
            sentiment: "negative",
          },
        ],
        avg_engagement: {
          likes: 30.96,
          retweets: 3.96,
        },
        category_breakdown: {
          "App/Digital Experience": 0,
          Claims: 13,
          "Customer Service": 9,
          "General/Others": 19,
          "Policy/Renewal": 8,
        },
        key_insight:
          "ICICI Lombard faces considerable negative sentiment regarding its claims process, with issues like rejections, slow approvals, and denied cashless facilities. Customer service is also a concern, with users reporting difficulties reaching support and inconsistent information. Despite this, the company is praised for offering value-for-money products and competitive quotes.",
        sentiment_counts: {
          negative: 25,
          neutral: 12,
          positive: 12,
        },
        sentiment_score: -0.265,
        total_tweets: 49,
      },
    },
    comparative_analysis: {
      best_customer_service: "HDFC",
      highest_claims_complaints: "ACKO",
      highest_negative_sentiment: "Digit",
      summary:
        "ACKO stands out with the best digital experience, receiving consistent praise for its intuitive app, UI/UX, and instant policy issuance, a clear differentiator from HDFC and ICICI which have no digital experience feedback. However, ACKO shares a similar negative sentiment score with HDFC, primarily driven by claims issues for ACKO and policy/renewal issues for HDFC. Digit and ICICI both struggle significantly with claims and customer service, with Digit having the highest overall negative sentiment. While ACKO and Digit both have a high volume of claims complaints, ACKO's digital strengths offer a positive counterpoint that is less evident in Digit's feedback. HDFC's strong customer service is a notable positive, contrasting with the negative support experiences reported for Digit and ICICI.",
    },
  },
  message: "Tweet analysis completed successfully",
  success: true,
};
