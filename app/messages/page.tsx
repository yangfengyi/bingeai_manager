import { getLatestChatHistory } from '../(components)/messages/message-query-action';
import MessageTable, { Message } from '../(components)/messages/message-table';

export default async function Messages() {
  const messages = (await getLatestChatHistory()) as { chatHistory: Message[] };

  console.log(messages);

  return <MessageTable data={messages.chatHistory || []} />;
}
