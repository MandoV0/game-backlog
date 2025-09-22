/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_BASE_URL: string;
  // add other VITE_ variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
