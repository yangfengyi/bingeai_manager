import { getLatestChatHistory } from '../(components)/messages/message-query-action';
import MessageTable from '../(components)/messages/message-table';

export default async function Messages() {
  const messages = (await getLatestChatHistory()) as any;

  console.log(messages);

  return <MessageTable data={messages.chatHistory || []} />;
}
