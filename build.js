const { copyFile } = require("fs/promises");

async function build() {
    copyFile("query.graphql", "dist/query.graphql");
}

build();