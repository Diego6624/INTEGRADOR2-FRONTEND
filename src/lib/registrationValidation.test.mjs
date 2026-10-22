import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration } from './registrationValidation.js';
const valid = { name: "Marcos Z\u00fa\u00f1iga", email: "marcos@example.com", password: "Seguro123!", confirmation: "Seguro123!", accepted: true };
test('accepts valid registration and international names', () => {
  assert.deepEqual(validateRegistration(valid), {});
  assert.deepEqual(validateRegistration({ ...valid, name: "\u674e\u660e" }), {});
});
test('rejects empty fields, whitespace names and malformed email', () => {
  for (const [field, value] of [['name', '   '], ['name', 'User123'], ['email', 'a@'], ['email', 'a b@example.com'], ['password', ''], ['confirmation', ''], ['accepted', false]]) {
    assert.ok(validateRegistration({ ...valid, [field]: value })[field], field);
  }
});
test('rejects weak passwords and mismatched confirmation', () => {
  for (const password of ['short1!', 'lowercase123!', 'UPPERCASE123!', 'NoNumbers!', 'NoSymbols123', 'A1!' + 'a'.repeat(126)]) {
    assert.ok(validateRegistration({ ...valid, password }).password);
  }
  assert.ok(validateRegistration({ ...valid, confirmation: 'Different123!' }).confirmation);
});
