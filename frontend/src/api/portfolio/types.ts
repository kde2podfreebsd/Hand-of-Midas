export interface PortfolioAsset {
  coin: string;
  amount: number;
  dollar_equivalent: number;
  address: string[];
}

export type BlockchainPortfolioItem =
  | { Ethereum: PortfolioAsset[] }
  | { SUI: PortfolioAsset[] };

export type BlockchainPortfolio = BlockchainPortfolioItem[];

export interface PortfolioData {
  Blockchain: BlockchainPortfolio;
  total_balance_eth: number;
  total_balance_sui: number;
  total_balance: number;
}
