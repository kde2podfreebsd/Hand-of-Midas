export enum TransactionType {
  In = "in",
  Out = "out",
  Swap = "swap",
}

export type Transaction = {
  blockchain: string;
  date: string;
  dollar_equivalent: number;
  gas_fee: number;
  receiver: string; // address
  sender: string; // address
  token: string;
  transaction_type: TransactionType;
  tx_hash: string;
  volume: string;
};
