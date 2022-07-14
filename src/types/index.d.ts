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
    supportChannelId: string;
    supportEmbedDescription: string[];
    supportMentionRoleId: string;
}

export interface AutoResponse {
    keywords: [string[]];
    response: JsonEmbedResponse;
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

export interface LanguageInfo {
    language: string;
    code: string;
    total: number;
    translated: number;
    translated_percent: number;
    total_words: number;
    translated_words: number;
    translated_words_percent: number;
    total_chars: number;
    translated_chars: number;
    translated_chars_percent: number;
}
