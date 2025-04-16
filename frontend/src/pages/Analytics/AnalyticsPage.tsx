import { WithLoader } from "../../components/WithLoader/WithLoader";

export const AnalyticsPage = () => {
  return(
    <WithLoader msMax={1000}>
      <iframe style={{ width: '100%', height: '45%'}} src="https://dune.com/embeds/3353707/5621898"/>
      <iframe style={{ width: '50%', height: '45%'}} src="https://dune.com/embeds/3353707/5621898"/>
      <iframe style={{ width: '50%', height: '45%'}} src="https://dune.com/embeds/3353707/5621898"/>
    </WithLoader>
  );
}
