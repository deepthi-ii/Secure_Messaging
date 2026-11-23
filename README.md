# Secure Messaging Protocol Lab (DSA demo)

A small Vite web app demonstrating algorithms/security concepts:
- SHA-256 message hashes
- Merkle root for a batch of message hashes
- AES-GCM encryption using a generated browser key
- Session-key fingerprint/version display and rotation
- Hash-linked message records (previous hash)
- Replay detection using a Set of message IDs
- Optional Supabase security event logging

## Run locally
1. Install Node.js (LTS).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

Supabase is optional for the local demo. Without credentials, event logs remain in browser memory.

## Supabase setup
1. Create a Supabase project at https://supabase.com/dashboard.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Project Settings → API: copy Project URL and publishable/anon key (never service-role key).
4. Create `.env` in this folder based on `.env.example`:
   `VITE_SUPABASE_URL=...`
   `VITE_SUPABASE_ANON_KEY=...`
5. Restart Vite after editing `.env`.

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. Sign in at https://vercel.com and Add New → Project → import that repository.
3. Framework preset: Vite. Build command `npm run build`; output directory `dist`.
4. Project Settings → Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as your Supabase project).
5. Deploy. Each future GitHub push redeploys automatically.

## Important scope/limitations
This is a classroom prototype, not a production secure messenger. It uses in-memory demo state and does not implement authenticated Alice/Bob accounts, network message delivery, real forward secrecy, or robust tamper-proof storage. The Merkle demonstration verifies the hashes currently in the message batch; it is intended to illustrate how integrity roots work. Never deploy the demo SQL's permissive RLS policies for real user/private data without tightening them.
