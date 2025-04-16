import { ConnectModal, useWallet } from "@suiet/wallet-kit";
import { Button } from "antd";
import { useState } from "react";

export const ConnectSuiButton = () => {
  const sui = useWallet();

  const disabled = Boolean(sui.address);

  const handleConnect = () => {
    if (!sui.address) {
      setShowModal(true);
    }
  }

  const [showModal, setShowModal] = useState(false)

  return (
    <ConnectModal
      open={showModal}
      onOpenChange={open => setShowModal(open)}
      onConnectSuccess={() => setShowModal(false)}
      onConnectError={() => setShowModal(false)}
    >
      <Button
        type='primary'
        onClick={handleConnect}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? 'inherit' : '#6253e1',
        }}
      >
        Подключить
      </Button>
    </ConnectModal>
  )
}