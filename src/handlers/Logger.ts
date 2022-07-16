import chalk from "chalk";

export default class Logger {
    //
    //	Static Methods
    //

    public static makeSize(string: string, length: number): string {
        if (string.length >= length) return string.slice(0, length);
        return string + " ".repeat(length - string.length);
    }

    public static getLineAndChar(
        depth: number = 3
    ): [script: string, line: number, char: number] {
        const stack = this.getStack();

        const line = stack.split("\n")[depth + 1];
        if (!line) return ["", -1, -1];

        const match = line.match(/.*\\(.+.ts):(\d+):(\d+)\)?$/) ?? [];
        return [
            match[1] ?? "",
            parseInt(match[2] ?? -1),
            parseInt(match[3] ?? -1),
        ];
    }

    public static getStack(startSlice = 1) {
        const stack = new Error().stack!.split("\n");
        return stack.slice(startSlice, stack.length).join("\n").trim();
    }

    //
    //	Class methods
    //

    constructor(private size: number = 5, private showBlank: boolean = true) {}

    public prefix: string | undefined = undefined;

    public loghandler(
        prefix: string,
        type: "log" | "warn" | "error",
        ...messages: any[]
    ) {
        if (this.prefix) {
            console[type](
                chalk.bold(prefix),
                chalk.gray("[") + this.prefix + chalk.gray("]"),
                ...messages,
                chalk.grey("(") +
                    chalk.cyan(Logger.getLineAndChar().join(":")) +
                    chalk.grey(")")
            );
        } else {
            console[type](
                chalk.bold(prefix),
                ...messages,
                chalk.grey("(") +
                    chalk.cyan(Logger.getLineAndChar().join(":")) +
                    chalk.grey(")")
            );
        }
    }

    //
    //	Debug Messages
    //

    public blankHandler() {
        console.log("");
    }

    public debug(...messages: any[]) {
        this.loghandler(
            chalk.bgWhite.black(
                " " + Logger.makeSize("DEBUG", this.size) + " "
            ),
            "log",
            ...messages
        );
    }

    public info(...messages: any[]) {
        this.loghandler(
            chalk.bgGreen(" " + Logger.makeSize("INFO", this.size) + " "),
            "log",
            ...messages
        );
    }

    public warn(...messages: any[]) {
        this.loghandler(
            chalk.bgYellow.black(
                " " + Logger.makeSize("WARN", this.size) + " "
            ),
            "warn",
            ...messages
        );
    }

    public blank() {
        if (this.showBlank) this.blankHandler();
    }

    /**
     * Logs the messages and displays the error
     */
    public error(...messages: [...any[], Error]): void;
    /**
     * Logs the error, creates a new error stack
     */
    public error(...messages: any[]): void;
    public error(...messages: any[]) {
        let stack: string;

        if (messages[messages.length - 1] instanceof Error)
            stack = messages.pop().stack;
        else stack = Logger.getStack(3);

        this.loghandler(
            chalk.bgRed(" " + Logger.makeSize("ERROR", this.size) + " "),
            "error",
            ...messages,
            "\n",
            chalk.red(">"),
            stack
        );
    }
}
