
import { config as loadEnv } from "dotenv";
import { readFile, writeFile } from "fs/promises";
import { GithubPackages } from "../src/github";

loadEnv();

const matchFileFilters: Array<RegExp> = [
    new RegExp("^compactmachines-(?:[\\d\\.]+){4}.jar$")
];

async function run() {
    let pkg = await GithubPackages.getPackageInfo("compactmods", "compactmachines", ["dev.compactmods.compactmachines"]);

    console.debug("Latest Version: " + pkg.version);
    
    let matched = matchFileFilters.length == 0 ? pkg.files : pkg.files.filter(file => {
        return matchFileFilters.some(filter => {
            let matched = filter.test(file.name);
            return matched;
        });
    });

    await writeFile("packages.json", JSON.stringify(matched, undefined, 4));
}

run();