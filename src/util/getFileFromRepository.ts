import { readFileSync } from "fs";
import { join } from "path";
import { config } from "../index";

export default (path: string): string => {
    const filePath = join(__dirname, '../../data', config.repositoryName, path);
    const content = readFileSync(filePath, 'utf8');
    return content;
}