import { Button } from "antd";
import { useContext } from "react";
import { EthereumContext } from "../../../providers/EthereumProvider";

export const DisconnectEthereumButton = () => {
  const { address, disconnectWallet } = useContext(EthereumContext);

  const disabled = !address;

  const handleDisconnect = async () => {
    if (address) {
      await disconnectWallet()
    }
  }

  return (
    <Button
      type="primary"
      disabled={disabled}
      onClick={handleDisconnect}
      style={{
        backgroundColor: disabled ? 'inherit' : '#6253e1',
      }}
    >
      Отключить
    </Button>
  )

}