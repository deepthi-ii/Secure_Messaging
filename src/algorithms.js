// DSA/security demonstration helpers: SHA-256, Merkle tree, hash chain, replay cache.
export const bytesToHex = (bytes) => [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
export async function sha256(text) { return bytesToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))); }
export async function merkleRoot(messages) {
  if (!messages.length) return null;
  let level = await Promise.all(messages.map(m => sha256(m)));
  while (level.length > 1) {
    if (level.length % 2) level.push(level[level.length - 1]);
    const next = [];
    for (let i = 0; i < level.length; i += 2) next.push(await sha256(level[i] + level[i + 1]));
    level = next;
  }
  return level[0];
}
export async function hashChain(messages) {
  let previous = 'GENESIS'; const records = [];
  for (const message of messages) {
    const current = await sha256(previous + '|' + message.id + '|' + message.text);
    records.push({ ...message, previousHash: previous, hash: current }); previous = current;
  }
  return records;
}
export class ReplayGuard {
  constructor() { this.ids = new Set(); }
  accept(id) { if (this.ids.has(id)) return false; this.ids.add(id); return true; }
}
export async function makeSessionKey() {
  const key = await crypto.subtle.generateKey({name:'AES-GCM', length:256}, true, ['encrypt','decrypt']);
  const raw = await crypto.subtle.exportKey('raw', key);
  return { key, fingerprint: bytesToHex(await crypto.subtle.digest('SHA-256', raw)).slice(0,16) };
}
export async function encryptText(key, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, new TextEncoder().encode(text));
  return { iv: bytesToHex(iv), ciphertext: bytesToHex(ciphertext) };
}
