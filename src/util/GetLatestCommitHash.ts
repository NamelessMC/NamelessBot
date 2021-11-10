import { config } from '../index';
import fetch from 'node-fetch';
import SingleValueCache from '../cache/SingleValueCache';

const latestCommitHash = new SingleValueCache<string>();

export default async () => {

    if (latestCommitHash.get()) {
        return latestCommitHash.get();
    }

    const githubURL = `https://api.github.com/repos/${config.organizationName}/${config.repositoryName}/commits/${config.branch}`;
    const response = await fetch(githubURL).then((res) => res.json());

    const sha: string = (response as any).sha // I don't want to create an interface for the entire json response to this will work for now

    latestCommitHash.put(sha);
    return sha;
}