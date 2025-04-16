import { getChatMessages } from "./chat/get-messages";
import { sendMessage } from "./chat/send-message";
import { getPools } from "./pool/get-pools";
import { syncUser } from "./user/sync-user";

export const api = {
  user: {
    sync: syncUser,
  },
  pool: {
    list: getPools,
  },
  chat: {
    sendMessage: sendMessage,
    messages: getChatMessages,
  },
};
