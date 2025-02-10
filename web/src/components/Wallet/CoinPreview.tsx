import { getCoinInfo } from "@/api/get-coin-info";
import { Flex, Image, Paper, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";


export interface CoinPreviewProps {
  name: string;
  balance: string;
}

export function CoinPreview(props: CoinPreviewProps) {
  const [image, setImage] = useState<string | null>(null);
  const [coinBalance, setCoinBalance] = useState<number | null>(null)
  const [usdBalance, setUsdBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchCoinInfo = async () => {
      try {
        const info = await getCoinInfo(props.name)

        const sat = Number(props.balance)
        const decimal = Object.values(info.detail_platforms)[0].decimal_place ?? 8 as number

        const coin = sat / 10 ** decimal
        const usd = coin * info.market_data.current_price.usd;

        setCoinBalance(coin);
        setUsdBalance(usd);
        setImage(info.image.thumb)
      } catch (e) {
        console.log('Error fetching coin info', e)
      }
    }

    fetchCoinInfo()
  }, [])

  return (
    <Paper w={300} h={150} p={30} radius={30}>
      <Stack justify="space-around">
        <Flex direction='row' justify="space-between">
          <Text size="lg" fw={700}>{props.name}</Text>
          <Image src=""/>
          {
            image && (<Image src={image} w={30} h={30}/>)
          }
        </Flex>
        <Flex direction="row" justify="space-between">
          <Text fw={700}>{coinBalance}</Text>
          <Text fw={700}>{usdBalance}$</Text>
        </Flex>
      </Stack>
    </Paper>
  ) 
}