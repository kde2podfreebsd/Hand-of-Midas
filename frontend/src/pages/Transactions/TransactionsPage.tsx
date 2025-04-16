import { WithLoader } from "../../components/WithLoader/WithLoader";
import TransactionsTable from "./TransactionsTable";

export const TransactionsPage = () => {
  return(
    <WithLoader msMax={300}>
      <TransactionsTable/>
    </WithLoader>
  );
}
