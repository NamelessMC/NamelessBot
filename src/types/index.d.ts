export interface Config {
    organizationName: string;
    repositoryName: string;
    branch: string;
    guildID: string;

    supportRoles: string[];
    exclusions: string[];

    welcomeChannelId: string;
    modLogChannelId: string;

    db: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };

    botOwners: string[];
}

export interface JsonEmbedResponse {
    title: string;
    body: string[];
    footer: string;
}

export interface BinLink {
    regex: string;
    getLink: string;
}
