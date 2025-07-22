#!/bin/bash
# This script is used to build an Electron application using Docker with Electron Builder.
# Resource: https://www.electron.build/multi-platform-build.html#docker

# Using this, you can build your Electron app in a clean environment without needing to install all dependencies locally.

ENV_VARS='DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_'

echo "This puts you into a Docker terminal with the current directory mounted as /project."
echo "All dependencies needed for building the Electron app are installed in the Docker image."
echo "You can run the build commands as you would normally do, e.g., 'npm install && npm run electron:pack'"
docker run \
    --rm \
    -ti  \
    --env-file <(env | grep -iE ${ENV_VARS}) \
    --env ELECTRON_CACHE="/root/.cache/electron"  \
    --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
    -v ${PWD}:/project  \
    -v ${PWD##*/}-node-modules:/project/node_modules  \
    -v ~/.cache/electron:/root/.cache/electron  \
    -v ~/.cache/electron-builder:/root/.cache/electron-builder  \
    electronuserland/builder:wine
