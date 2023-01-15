import { getInput, debug, setFailed } from '@actions/core'
import { GithubPackages } from "./github";
import { writeFile } from "fs/promises";

async function run() {
    const owner = getInput("owner", { required: true });
    const repo = getInput("repo", { required: true });
    const group = getInput("group", { required: true });
    const filter = getInput("filter");
    const outFile = getInput("outputFile");

    try {
        debug(`Target: ${owner}/${repo}`);

        let matchFileFilters: RegExp[] = [];
        if (filter) {
            debug("Adding filter: " + filter);
            matchFileFilters.push(new RegExp(filter));
        }

        let matchedFiles = await GithubPackages.getPackageInfo(owner, repo, [group]);
        if (matchFileFilters.length > 0) {
            debug("Pre-filter count: " + matchedFiles.length);
            matchedFiles = matchedFiles.filter(file => {
                return matchFileFilters.some(filter => {
                    let matched = filter.test(file.name);
                    return matched;
                });
            });
            debug("Post-filter count: " + matchedFiles.length);
        }

        const actualOut = outFile ?? "packages.json";
        debug("Writing output file: " + actualOut)
        await writeFile(actualOut, JSON.stringify(matchedFiles));
    }

    catch (err) {
        if(err instanceof Error)
            setFailed(err.message);
        else
            setFailed("An unexpected error occurred.");
    }
}

run();