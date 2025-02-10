import { chatRegister } from '@/api/chat-register';
import { Box, Flex, rem, Stack, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ConnectButton, useSuiClient, useWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';
import { CoinPreview } from './CoinPreview';

export function Wallet() {
  const provider = useSuiClient()
  const { connected, account } = useWallet();
  const [balances, setBalances] = useState<Awaited<ReturnType<typeof provider.getAllBalances>>>([])
   const [_walletId, setWalletId] = useLocalStorage({ key: 'wallet_id'})

  useEffect(() => {
    if (!connected || !account?.address) {return;}

    setWalletId(account.address)

    const syncWallet = async () => {
      try {
        await chatRegister(account.address)
      } catch (error) {
        console.error('Error sync chat:', error);
      }
    }

    const fetchCoins = async () => {
      try {
        const balances = await provider.getAllBalances({
          owner: account.address
        })
        setBalances(balances);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    syncWallet();
    fetchCoins();
  }, [connected, account]);

  return (
    <Box py={rem(25)} px={rem(40)}>
      <Stack gap={rem(40)}>
        <Flex direction="row" justify="flex-end" align="flex-start" w="100%" h="100%">
          <ConnectButton>Connect your wallet</ConnectButton>
        </Flex>

        <Title>Balances</Title>

        <Flex direction="row" justify="flex-start" align="center" wrap='wrap' w='100%' gap={rem(15)}>
          {balances.length && (
            balances.map((balance, index) => (
              <Flex direction="row" justify="flex-start" wrap="nowrap">
                <CoinPreview
                  key={index}
                  name={balance.coinType.split('::').at(-1)!}
                  balance={balance.totalBalance}
                />
              </Flex>
            ))
          )}
        </Flex>
      </Stack>
    </Box>
  );
};
