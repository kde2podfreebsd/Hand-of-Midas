import { getChatMessages } from "./chat/get-messages";
import { sendMessage } from "./chat/send-message";
import { getNews } from "./news/get-news";
import { getNewsByTag } from "./news/get-news-by-tag";
import { getSummaryByTag } from "./news/get-summary-by-tag";
import { getTags } from "./news/get-tags";
import { getPools } from "./pool/get-pools";
import { getPortfolio } from "./portfolio/get-portfolio";
import { getTransactions } from "./transaction/get-transactions";
import { syncUser } from "./user/sync-user";

export const api = {
  user: {
    sync: syncUser,
  },
  pool: {
    list: getPools,
  },
  chat: {
    sendMessage: sendMessage,
    messages: getChatMessages,
  },
  transaction: {
    list: getTransactions,
  },
  portfolio: {
    get: getPortfolio,
  },
  news: {
    getNews: getNews,
    getTags: getTags,
    getNewsByTag: getNewsByTag,
    getSummaryByTag: getSummaryByTag,
  },
};
