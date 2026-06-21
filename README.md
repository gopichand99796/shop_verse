# ShopVerse AI

Monorepo for ShopVerse AI with frontend, backend, and shared types.

## Setup

1. Copy `.env.example` files to `.env` in `server` and `client`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run server:
   ```bash
   npm run dev:server
   ```
4. Run client:
   ```bash
   npm run dev:client
   ```

## Structure

- `client` — React + Vite frontend
- `server` — Express + TypeScript backend
- `shared` — shared TypeScript types
