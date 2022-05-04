declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildIds: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};
