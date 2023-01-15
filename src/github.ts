import { graphql } from "@octokit/graphql";
import { readFile } from "fs/promises";

export interface GHPackage {
    name: string;
    size: bigint;
    updatedAt: string;
    sha256: string;
    url: string;
}

export class GithubPackages {
    public static async getPackageInfo(org: string, repo: string, groups: string[]): Promise<GHPackage[]> {
        let f = await readFile("query.graphql", "utf-8");
        f = f.replace("\r\n", "");

        const getPackageInfo = await graphql<any>(f, {
            org: org,
            repo: repo,
            group: groups,
            headers: {
                authorization: `bearer ${process.env.GQL_TOKEN}`
            }
        });

        let pkg = getPackageInfo.repository.packages.nodes[0].latestVersion.files.nodes as GHPackage[];
        return pkg;
    }
}