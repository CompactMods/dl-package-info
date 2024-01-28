import { graphql } from "@octokit/graphql";
import { readFile } from "fs/promises";

const query = `query getPackageInfo($org: String!, $repo: String!, $nameFilter: [String]) {
    repository(owner: $org, name: $repo) {
        packages(first: 1, names: $nameFilter) {
            nodes { 
                latestVersion { 
                    version
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

export interface GHPackageInfo {
    version: string;
    files: GHPackage[];
}

export interface GHPackage {
    name: string;
    size: bigint;
    updatedAt: string;
    sha256: string;
    url: string;
}

export class GithubPackages {
    public static async getPackageInfo(org: string, repo: string, names: string[]): Promise<GHPackageInfo> {
        const getPackageInfo = await graphql<any>(query, {
            org: org,
            repo: repo,
            nameFilter: names,
            headers: {
                authorization: `bearer ${process.env.GQL_TOKEN}`
            }
        });

        let latestVersion = getPackageInfo.repository.packages.nodes[0].latestVersion;
        let version = latestVersion.version;
        let pkg = latestVersion.files.nodes as GHPackage[];
        
        return { 
            version: version, 
            files: pkg 
        };
    }
}