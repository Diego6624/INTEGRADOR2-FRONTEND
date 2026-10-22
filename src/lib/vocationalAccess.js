import { createVocationalApi } from '../pages/private/Test/vocationalApi.js';

export async function hasCompletedVocationalTest(client, userId, signal) {
  if (userId == null) return false;
  const result = await createVocationalApi(client).findResult(userId, signal);
  return result?.id != null && String(result.userId) === String(userId);
}

export async function requireVocationalTest(client, userId) {
  if (!await hasCompletedVocationalTest(client, userId)) {
    throw new Error('Completa el test vocacional antes de crear un roadmap.');
  }
}
