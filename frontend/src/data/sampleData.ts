
export interface CompanyData {
  id: number;
  description: string;
  company_name: string;
  company_url: string;
  amount: number;
  round: string;
  investors: string[];
  story_link: string;
  source: string;
  date: string;
  company_type: string;
  reference: string;
}

// Sample data based on the structure shown in the image
export const sampleData: CompanyData[] = [
  {
    id: 1,
    description: "Theom, a United States-based cloud data protection platform, raised a...",
    company_name: "Theom",
    company_url: "http://www.theom.ai",
    amount: 20000000,
    round: "Series A",
    investors: ["Bessemer Venture Partners"],
    story_link: "https://www.prweb.com/releases/theom-raises-20m-series-a-to-redefine-d...",
    source: "PRWEB",
    date: "2025-05-19",
    company_type: "Product",
    reference: "https://www.returnonsecurity.com/p/security-funded-194"
  },
  {
    id: 2,
    description: "CyberSeek Technologies announces Series B funding round...",
    company_name: "CyberSeek",
    company_url: "http://www.cyberseek.com",
    amount: 35000000,
    round: "Series B",
    investors: ["Andreessen Horowitz", "Sequoia Capital"],
    story_link: "https://techcrunch.com/cyberseek-35m-series-b",
    source: "TechCrunch",
    date: "2025-05-18",
    company_type: "SaaS",
    reference: "https://www.returnonsecurity.com/p/security-funded-195"
  },
  {
    id: 3,
    description: "SecureVault raises seed funding to revolutionize data encryption...",
    company_name: "SecureVault",
    company_url: "http://www.securevault.io",
    amount: 5000000,
    round: "Seed",
    investors: ["Y Combinator", "General Catalyst"],
    story_link: "https://venturebeat.com/securevault-seed-funding",
    source: "VentureBeat",
    date: "2025-05-17",
    company_type: "Product",
    reference: "https://www.returnonsecurity.com/p/security-funded-196"
  },
  {
    id: 4,
    description: "ThreatShield completes $50M Series C for AI-powered security...",
    company_name: "ThreatShield",
    company_url: "http://www.threatshield.com",
    amount: 50000000,
    round: "Series C",
    investors: ["Kleiner Perkins", "Insight Partners"],
    story_link: "https://www.businesswire.com/threatshield-series-c",
    source: "BusinessWire",
    date: "2025-05-16",
    company_type: "SaaS",
    reference: "https://www.returnonsecurity.com/p/security-funded-197"
  },
  {
    id: 5,
    description: "ZeroTrust Networks secures funding for identity management platform...",
    company_name: "ZeroTrust Networks",
    company_url: "http://www.zerotrust.net",
    amount: 15000000,
    round: "Series A",
    investors: ["Lightspeed Venture Partners"],
    story_link: "https://www.reuters.com/zerotrust-funding",
    source: "Reuters",
    date: "2025-05-15",
    company_type: "Platform",
    reference: "https://www.returnonsecurity.com/p/security-funded-198"
  },
  {
    id: 6,
    description: "CryptoGuard raises pre-seed round for blockchain security solutions...",
    company_name: "CryptoGuard",
    company_url: "http://www.cryptoguard.io",
    amount: 2500000,
    round: "Pre-Seed",
    investors: ["Coinbase Ventures", "a16z crypto"],
    story_link: "https://decrypt.co/cryptoguard-pre-seed",
    source: "Decrypt",
    date: "2025-05-14",
    company_type: "Product",
    reference: "https://www.returnonsecurity.com/p/security-funded-199"
  }
];
