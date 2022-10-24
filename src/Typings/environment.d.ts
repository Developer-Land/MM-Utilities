declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      botToken: string;
      guildIds: string;
      mongooseConnectionString: string;
      LAVALINK_IDENTIFIER: string;
      LAVALINK_HOST: string;
      LAVALINK_PASSWORD: string;
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      YT_hubCallback: string;
      YT_SECRET: string;
      environment: 'dev' | 'prod' | 'debug';
    }
  }
}

export {};
