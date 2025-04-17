import { PortfolioData } from "./types";

export async function getPortfolio(userId: string): Promise<PortfolioData> {
  void userId;

  return Promise.resolve({
    Blockchain: [
      {
        Ethereum: [
          {
            coin: "ETH",
            amount: 1.6,
            dollar_equivalent: 3200,
            address: [
              "0xa1351a51265c1320d9514f7678a8d92e511cc49d",
              "0x62da26f96c7664d848c98ebdf34362543184635e",
            ],
          },
          {
            coin: "USDT",
            amount: 2000,
            dollar_equivalent: 2000,
            address: [
              "0x62da26f96c7664d848c98ebdf34362543184635e",
              "0xa1351a51265c1320d9514f7678a8d92e511cc49d",
              "0x3c722677bd494747664b7b677c7ade4375a863d0",
            ],
          },
          {
            coin: "USDC",
            amount: 700,
            dollar_equivalent: 700,
            address: [
              "0x62da26f96c7664d848c98ebdf34362543184635e",
              "0x3c722677bd494747664b7b677c7ade4375a863d0",
            ],
          },
          {
            coin: "DAI",
            amount: 400,
            dollar_equivalent: 400,
            address: ["0x62da26f96c7664d848c98ebdf34362543184635e"],
          },
          {
            coin: "AAVE",
            amount: 0.4,
            dollar_equivalent: 132,
            address: [
              "0x93c3246875cf89f9318a1fcfa96edf6273e1079a",
              "0x62da26f96c7664d848c98ebdf34362543184635e",
            ],
          },
          {
            coin: "SUSHI",
            amount: 0.2,
            dollar_equivalent: 36,
            address: ["0x93c3246875cf89f9318a1fcfa96edf6273e1079a"],
          },
          {
            coin: "LINK",
            amount: 2.5,
            dollar_equivalent: 70,
            address: ["0x62da26f96c7664d848c98ebdf34362543184635e"],
          },
          {
            coin: "UNI",
            amount: 3,
            dollar_equivalent: 27,
            address: ["0x62da26f96c7664d848c98ebdf34362543184635e"],
          },
          {
            coin: "WBTC",
            amount: 0.05,
            dollar_equivalent: 1000,
            address: ["0x93c3246875cf89f9318a1fcfa96edf6273e1079a"],
          },
          {
            coin: "MKR",
            amount: 0.1,
            dollar_equivalent: 700,
            address: ["0xa1351a51265c1320d9514f7678a8d92e511cc49d"],
          },
          {
            coin: "USDT",
            amount: 60,
            dollar_equivalent: 60,
            address: ["0x62da26f96c7664d848c98ebdf34362543184635e"],
          },
          {
            coin: "ETH",
            amount: 0.3,
            dollar_equivalent: 600,
            address: ["0x62da26f96c7664d848c98ebdf34362543184635e"],
          },
          {
            coin: "AAVE",
            amount: 1.5,
            dollar_equivalent: 300,
            address: ["0x93c3246875cf89f9318a1fcfa96edf6273e1079a"],
          },
          {
            coin: "DAI",
            amount: 30,
            dollar_equivalent: 30,
            address: ["0x62da26f96c7664d848c98ebdf34362543184635e"],
          },
          {
            coin: "SUSHI",
            amount: 2,
            dollar_equivalent: 5,
            address: ["0xa1351a51265c1320d9514f7678a8d92e511cc49d"],
          },
          {
            coin: "UNI",
            amount: 2,
            dollar_equivalent: 4,
            address: ["0x3c722677bd494747664b7b677c7ade4375a863d0"],
          },
          {
            coin: "LINK",
            amount: 1.2,
            dollar_equivalent: 35,
            address: ["0xa1351a51265c1320d9514f7678a8d92e511cc49d"],
          },
          {
            coin: "DAI",
            amount: 20,
            dollar_equivalent: 20,
            address: ["0x93c3246875cf89f9318a1fcfa96edf6273e1079a"],
          },
          {
            coin: "ETH",
            amount: 0.2,
            dollar_equivalent: 400,
            address: ["0xa1351a51265c1320d9514f7678a8d92e511cc49d"],
          },
          {
            coin: "LINK",
            amount: 0.3,
            dollar_equivalent: 8,
            address: ["0x3c722677bd494747664b7b677c7ade4375a863d0"],
          },
        ],
      },
      {
        SUI: [
          {
            coin: "SUI",
            amount: 1.9,
            dollar_equivalent: 500,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "USDT",
            amount: 30,
            dollar_equivalent: 30,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "BTC",
            amount: 0.08,
            dollar_equivalent: 3000,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "ETH",
            amount: 0.18,
            dollar_equivalent: 300,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "USDC",
            amount: 90,
            dollar_equivalent: 90,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "AAVE",
            amount: 0.5,
            dollar_equivalent: 50,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "SUSHI",
            amount: 0.4,
            dollar_equivalent: 5,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "UNI",
            amount: 0.2,
            dollar_equivalent: 1.5,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
          {
            coin: "LINK",
            amount: 0.2,
            dollar_equivalent: 4,
            address: ["0x58d9b7cd3b0f00b87c6e37052b3c9d2bcfef6ab8"],
          },
        ],
      },
    ],
    total_balance_eth: 6500,
    total_balance_sui: 2975,
    total_balance: 9475,
  });
}
