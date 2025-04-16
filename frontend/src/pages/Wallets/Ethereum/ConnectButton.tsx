import { Button } from "antd";
import { useContext } from "react";
import { EthereumContext } from "../../../providers/EthereumProvider";

export const ConnectEthereumButton = () => {
  const { address, connectWallet } = useContext(EthereumContext);

  const disabled = Boolean(address);

  const handleConnect = async () => {
    if (!address) {
      await connectWallet()
    }
  }

  return (
    <Button
      type="primary"
      disabled={disabled}
      onClick={handleConnect}
      style={{
        backgroundColor: disabled ? 'inherit' : '#6253e1',
      }}
    >
      Подключить
    </Button>
  )

}