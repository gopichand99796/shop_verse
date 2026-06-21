/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  VITE_API_URL?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
