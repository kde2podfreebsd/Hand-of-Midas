import { ChatContext } from "@/contexts/ChatContext/ChatContext"
import { Box, Button, Flex, Group, Paper, rem, ScrollArea, Stack, Text, Textarea } from "@mantine/core"
import { getHotkeyHandler, useLocalStorage } from "@mantine/hooks"
import { IconBulb, IconCircleArrowUpFilled, IconWorld } from "@tabler/icons-react"
import { useContext, useRef } from "react"

export function Chat() {
  const { messages, addMessage, getAnalysis } = useContext(ChatContext)


  const [walletId] = useLocalStorage({ key: 'wallet_id'})
  const messageRef = useRef<HTMLTextAreaElement>(null);
  
  const handleAddMessage = () => {
    const message = messageRef.current?.value ?? '';

    if (!walletId) {
      // eslint-disable-next-line no-alert
      return alert('You may not connect your wallet.');
    }

    if (!message.trim()) {
      return;
    }

    addMessage(walletId, message);
    messageRef.current!.value = '';
  }

  const handleGetAnalysis = () => {
    if (!walletId) {
      // eslint-disable-next-line no-alert
      return alert('You may not connect your wallet.');
    }

    getAnalysis()
  }

  return (
    <Flex
      direction="column"
      h="100%"
      align="center"
      justify="space-between"
      p="md"
    >
      <ScrollArea pt={rem(15)} h='80vh' w='45vw'>
        <Stack gap={rem(30)}>
          {
            messages.map((message, index) => {
              if (message.role === 'user') {
                return (
                  <Flex key={index} direction="row" justify="flex-end">
                    <Paper radius="lg" bg="#303030" p='sm' maw="70%">
                      <Text>{message.content}</Text>
                    </Paper>
                  </Flex>
                )
              }

              if (message.role === 'assistant') {
                return (
                  <Text key={index}>{message.content}</Text>
                )
              }

              return <></>
            })
          }
        </Stack>
      </ScrollArea>

      <Box style={{ position: 'relative', width: '45vw' }}>
        <Textarea
          autosize
          minRows={2}
          maxRows={10}
          radius="lg"
          placeholder="Спросить что-нибудь..."
          styles={{
            input: {
              backgroundColor: '#424242',
              paddingBottom: '50px',
            },
          }}
          ref={messageRef}
          onKeyDown={getHotkeyHandler([['mod+Enter', handleAddMessage]])}
        />
          <IconCircleArrowUpFilled
            cursor="pointer"
            style={{
              color: 'white',
              position: 'absolute', bottom: '10px', right: '10px'
            }}
            onClick={handleAddMessage}
          />


        <Group style={{ position: 'absolute', bottom: '10px', left: '10px' }} gap={rem(4)}>
          <Button
            leftSection={<IconWorld size={15} />}
            variant='default'
            size="xs"
            radius={25}
            color="#212121"
            onClick={handleGetAnalysis}
          >
            Анализ портфеля
          </Button>
          <Button leftSection={<IconBulb size={15} />}  variant='default' size="xs" radius={25} >Обоснуй</Button>
        </Group>
      </Box>
    </Flex>
  )
}