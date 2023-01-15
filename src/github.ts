import { graphql } from "@octokit/graphql";
import { readFile } from "fs/promises";

const query = `query getPackageInfo($org: String!, $repo: String!, $filter: [String]) {
    repository(owner: $org, name: $repo) {
        packages(first: 1, names: $filter) {
            nodes { 
                latestVersion { 
                    files(first: 25) {
                        nodes { 
                            name 
                            size 
                            updatedAt 
                            sha256 
                            url 
                        }
                    }
                }
            } 
        }
    }
}`;

export interface GHPackage {
    name: string;
    size: bigint;
    updatedAt: string;
    sha256: string;
    url: string;
}

export class GithubPackages {
    public static async getPackageInfo(org: string, repo: string, groups: string[]): Promise<GHPackage[]> {
        const getPackageInfo = await graphql<any>(query, {
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