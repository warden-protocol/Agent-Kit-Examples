export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  integration: {
    discord?: boolean;
    telegram?: boolean;
  };
  details: {
    overview: string;
    capabilities: string[];
    useCases: string[];
    requirements?: string[];
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "defi-1",
    title: "YieldWarden",
    description: "Automated trading bot with advanced AI capabilities for DeFi markets. Perfect for yield farming and token swaps.",
    category: "DeFAI",
    features: [
      "Multi-DEX Support",
      "Custom Trading Strategies",
      "Real-time Analytics"
    ],
    integration: {
      discord: true,
      telegram: true
    },
    details: {
      overview: "A sophisticated DeFi trading bot that leverages AI to automate trading strategies across multiple DEXs. Perfect for yield farmers and token traders looking to optimize their returns.",
      capabilities: [
        "Automated trading across multiple DEXs",
        "Custom strategy creation and backtesting",
        "Real-time market analysis and alerts",
        "Risk management and position sizing",
        "Portfolio rebalancing"
      ],
      useCases: [
        "Yield Farming Optimization",
        "Token Swap Automation",
        "Arbitrage Trading",
        "Portfolio Management"
      ],
      requirements: [
        "Web3 Wallet Connection",
        "Initial Token Balance",
        "Trading Pair Selection"
      ]
    }
  },
  {
    id: "defi-2",
    title: "Pump Flow Agent",
    description: "Automated yield farming bot with AI-driven strategies for DeFi protocols.",
    category: "DeFAI",
    features: [
      "Multi-Protocol Support",
      "AI-Powered Yield Optimization",
      "Real-time Analytics"
    ],
    integration: {
      discord: true,
      telegram: true
    },
    details: {
      overview: "A cutting-edge DeFi yield farming bot that leverages AI to optimize your returns across multiple protocols. Perfect for yield farmers looking to maximize their yields.",
      capabilities: [
        "Automated yield farming across multiple protocols",
        "AI-driven strategy optimization",
        "Real-time analytics and alerts",
        "Risk management and position sizing" 
      ],
      useCases: [
        "Yield Farming Optimization",
        "Token Staking Automation",
        "Protocol-Specific Strategies"
      ],
      requirements: [
        "Web3 Wallet Connection",
        "Initial Token Balance",
        "Protocol-Specific Requirements"
      ]
    }
  },
  {
    id: "social-1",
    title: "Social Sentiment Analyser",
    description: "Automated social media bot with advanced AI capabilities for social media platforms.",
    category: "Social",
    features: [
      "Multi-Platform Support",
      "AI-Powered Content Generation",
      "Real-time Analytics"
    ],
    integration: {
      discord: true,
      telegram: true
    },
    details: {
      overview: "A sophisticated social media bot that leverages AI to automate content generation and engagement across multiple platforms. Perfect for social media managers and content creators looking to optimize their social media presence.",
      capabilities: [
        "Automated content generation and scheduling",
        "AI-driven engagement optimization",
        "Real-time analytics and insights",
        "Social media management and monitoring",
        "Content curation and recommendation"
      ],
      useCases: [
        "Social media content creation and scheduling",
        "Social media engagement optimization",
        "Social media analytics and insights",
        "Social media management and monitoring"
      ],
      requirements: [
        "Social media account creation and management",
        "Content creation and scheduling",
        "Social media platform integration"
      ]
    }
  },
  {
    id: "social-2",
    title: "Random Wallet Rewarder",
    description: "A blockchain-powered AI agent that rewards random wallet holders with incentives and engagement bonuses.",
    category: "Social",
    features: [
      "Random Wallet Selection (VRF-powered)",
      "Automated Reward Distribution",
      "Multi-Platform Announcement"
    ],
    integration: {
      discord: true,
      telegram: true
    },
    details: {
      overview: "An AI agent that picks a random wallet and rewards it with tokens or NFTs. It can announce winners on social media or Discord.",
      capabilities: [
        "AI-powered randomness for fairness",
        "Automated token or NFT transfers",
        "Social media announcements for winners",
        "Engagement tracking and leaderboard"
      ],
      useCases: [
        "Community Rewards & Incentives",
        "Social Media Giveaway Automation",
        "Decentralized Loyalty Programs"
      ],
      requirements: [
        "Web3 Wallet Connection",
        "Treasury for Token/NFT Rewards",
        "Social Media API Integration"
      ]
    }
  },
  {
    id: "defi-3",
    title: "Token Deployer",
    description: "Easily deploy new ERC-20 and ERC-721 tokens with customizable parameters using an AI-guided interface.",
    category: "DeFi",
    features: [
      "One-Click Token Deployment",
      "Customizable Tokenomics",
      "Multi-Network Support"
    ],
    integration: {
      discord: false,
      telegram: true
    },
    details: {
      overview: "A no-code AI-powered tool to deploy fungible (ERC-20) or non-fungible (ERC-721) tokens within minutes. Ideal for Web3 startups, DAOs, and NFT creators.",
      capabilities: [
        "Instant ERC-20 & ERC-721 token deployment",
        "Custom supply, tax, and governance settings",
        "Multi-chain compatibility (Ethereum, Polygon, BSC, etc.)",
        "Pre-built smart contract auditing & verification"
      ],
      useCases: [
        "Launching a DAO or governance token",
        "Creating community incentive tokens",
        "Deploying NFT collections with custom rules"
      ],
      requirements: [
        "Web3 Wallet Connection",
        "Gas Fee for Deployment",
        "Contract Customization Inputs"
      ]
    }
  },
  {
    id: "social-3",
    title: "Hype Generator",
    description: "AI-driven content engine for generating viral marketing campaigns and social engagement strategies.",
    category: "Social",
    features: [
      "AI-Powered Trend Analysis",
      "Automated Social Post Creation",
      "Community Engagement Tracking"
    ],
    integration: {
      discord: true,
      telegram: true
    },
    details: {
      overview: "A marketing AI tool that identifies trends, crafts viral social media content, and maximizes engagement using data-driven strategies.",
      capabilities: [
        "AI-driven trend identification and analysis",
        "Automated social media post generation",
        "Community sentiment tracking and reporting",
        "Engagement-based reward mechanisms"
      ],
      useCases: [
        "Marketing Campaign Optimization",
        "NFT & Token Project Promotion",
        "Community Engagement Growth"
      ],
      requirements: [
        "Social Media API Access",
        "Community Management Team",
        "Marketing Budget for Promotions"
      ]
    }
  }
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(template => template.id === id);
}