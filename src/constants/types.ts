export interface Command {
    title: string;
    footer: string;
    body: string[];
}

export interface CommandParemeters {
    title: string;
    footer: string;
    body: string;
    parameters: string[];
}

export interface OCRConfig {
    keywords: string[];
    response: {
        title: string;
        footer: string;
        body: string[];
    }
}

export interface HelpConfig {
    commands: {
        aliases: string[];
        description: string;
        type: string;
        hidden: boolean;
    }[]
}