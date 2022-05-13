declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      guildIds: string;
      mongooseConnectionString: string;
      environment: 'dev' | 'prod' | 'debug';
    }
  }
}

export {};
