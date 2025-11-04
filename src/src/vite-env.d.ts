/// <reference types="vite/client" />
// noinspection JSUnusedGlobalSymbols

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Runtime environment variables injected by docker-entrypoint.sh
interface Window {
  __ENV__?: {
    ZITADEL_INSTANCE_URL?: string;
    ZITADEL_CLIENT_ID?: string;
    ZITADEL_REDIRECT_URI?: string;
    ZITADEL_SILENT_REDIRECT_URI?: string;
    ZITADEL_POST_LOGOUT_REDIRECT_URI?: string;
    ZITADEL_AUTH_AUDIENCE?: string;
    API_BASE_URL?: string;
    AUTH_AUTHORITY?: string;
    AUTH_CLIENT_ID?: string;
    AUTH_REDIRECT_URI?: string;
    AUTH_SILENT_REDIRECT_URI?: string;
    AUTH_SUPPORTED_SCOPES?: string;
    AUTH_AUDIENCE?: string;
  };
}