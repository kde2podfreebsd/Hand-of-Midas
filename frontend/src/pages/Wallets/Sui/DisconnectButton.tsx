import { useWallet } from "@suiet/wallet-kit";
import { Button } from "antd";

export const DisconnectSuiButton = () => {
  const sui = useWallet();

  const disabled = Boolean(!sui.address);

  const handleDisconnect = async () => {
    if (sui.address) {
      await sui.disconnect()
    }
  }

  return (
    <Button
      type='primary'
      onClick={handleDisconnect}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? 'inherit' : '#6253e1',
      }}
    >
      Отключить
    </Button>
  )

}