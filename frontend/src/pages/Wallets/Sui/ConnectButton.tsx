import { ConnectModal, useWallet } from "@suiet/wallet-kit";
import { Button } from "antd";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../api";
import { Protocols } from "../../../constants";
import { UserContext } from "../../../providers/UserProvider";

export const ConnectSuiButton = () => {
  const sui = useWallet();
  const disabled = Boolean(sui.address);

  const { user } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false)

  const handleConnect = () => {
    if (!sui.address) {
      setShowModal(true);
    }
  }

  useEffect(() => {
    if (user && sui.address) {
      api.user.sync(Protocols.SUI, sui.address, user)
    }
  }, [sui.address, user])

  

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