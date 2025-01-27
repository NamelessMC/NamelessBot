import { Command } from '@crystaldevelopment/command-handler/dist';
import { CommandInteraction } from 'discord.js';
import fetch from 'node-fetch';
import Bot from '../managers/Bot';
import { LanguageInfo } from '../types';

export default class extends Command {
    public name = 'lang-stats';
    public description = 'Get the translations progress for namelessmc';
    public defaultPermission = true;
    public options = [];

    public onStart(): void {
        null;
    }

    public onLoad(): void {
        null;
    }

    public async run(interaction: CommandInteraction): Promise<any> {
        const translations = (await fetch(
            'https://translate.namelessmc.com/api/projects/namelessmc/languages/?format=json'
        )
            .then((res) => res.json())
            .catch(() => undefined)) as LanguageInfo[];

        if (!translations) {
            interaction.reply('Failed to fetch translations');
            return;
        }

        const client = interaction.client as Bot;

        const listHalf = Math.ceil(translations.length / 2);
        const leftList = translations
            .splice(0, listHalf)
            .reduce(this.listReducer, '');
        const rightList = translations
            .splice(-listHalf)
            .reduce(this.listReducer, '');

        const embed = client.embeds
            .base()
            .setTitle('Translation progress')
            .setDescription(
                'If you want to translate NamelessMC, have a look at https://translate.namelessmc.com/'
            )
            .addField('\u200E', leftList, true)
            .addField('\u200E', rightList, true);

        interaction.reply({ embeds: [embed] });
    }

    private formatFlag = (localeTag: string) => {
        switch (localeTag) {
            case 'en_PT':
                return ':pirate_flag:';
            case 'sr_CS':
                return ':flag_rs:';
            case 'uk':
                return ':flag_ua:';
            case 'sq':
                return ':flag_al:';
            case 'zh_Hans':
                return ':flag_cn:';
            case 'zh_Hant':
                return ':flag_tw:';
            case 'cs':
                return ':flag_cz:';
            case 'da':
                return ':flag_dk:';
            case 'en':
            case 'en_UK':
                return ':flag_gb:';
            case 'el':
                return ':flag_gr:';
            case 'ja':
                return ':flag_jp:';
            case 'ko':
                return ':flag_kr:';
            case 'es_419':
                return ':flag_mx:';
            case 'sv':
                return ':flag_se:';
            case 'fa':
                return ':flag_ir:';
            case 'vi':
                return ':flag_vn:';
            default:
                const countryCode =
                    localeTag.split('_')[1]?.toLowerCase() || localeTag;
                return `:flag_${countryCode}:`;
        }
    };

    private listReducer = (prev: string, info: LanguageInfo) => {
        const { name, code, translated_percent } = info;
        const emoji = this.formatFlag(code);
        return `${prev}${emoji} **${name}** - \`${translated_percent}%\`\n`;
    };
}
