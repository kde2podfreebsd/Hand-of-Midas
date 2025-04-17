import { ActivesPage } from "../pages/Actives/ActivesPage";
import { AnalyticsPage } from "../pages/Analytics/AnalyticsPage";
import { ChatPage } from "../pages/Chat/ChatPage";
import { PoolsPage } from "../pages/Pools/PoolsPage";
import { SurveyPage } from "../pages/Survey/SurveyPage";
import { TransactionsPage } from "../pages/Transactions/TransactionsPage";
import { WalletsPage } from "../pages/Wallets/WalletsPage";
import { Pages } from "../providers/PageProvider";

export const PAGE_CONTENT: Record<Pages, React.FC> = {
  [Pages.Chat]: ChatPage,
  [Pages.Pools]: PoolsPage,
  [Pages.Survey]: SurveyPage,
  [Pages.Actives]: ActivesPage,
  [Pages.Wallets]: WalletsPage,
  [Pages.Analytics]: AnalyticsPage,
  [Pages.Transactions]: TransactionsPage,
};

export const PAGE_HEADER: Record<Pages, string> = {
  [Pages.Chat]: "Чат-бот",
  [Pages.Pools]: "Пулы",
  [Pages.Survey]: "Анкета",
  [Pages.Actives]: "Активы",
  [Pages.Wallets]: "Кошельки",
  [Pages.Analytics]: "Аналитика",
  [Pages.Transactions]: "Транзакции",
};
