export async function fetchReadStates(client, options = {}) {
  const { data } = await client.get('/conversation/read-state', options);
  return Object.fromEntries(data.map(state => [state.conversationId, state.lastReadMessageId]));
}
export function isMessageRead(states, conversationId, message) {
  return Number(message.id) <= Number(states[conversationId] || 0);
}
export async function markMessagesRead(client, conversationId, messages) {
  if (!messages.length) return;
  const latest = messages.reduce((max, message) => Math.max(max, Number(message.id) || 0), 0);
  const { data } = await client.put(`/conversation/${conversationId}/read`, { lastReadMessageId: latest });
  window.dispatchEvent(new Event('journet:chat-read'));
  return data;
}
