# GitHub Link

This script powers `git.jamalam.tech`, which I use to link to repositories on
GitHub under my account, or any organizations it is in.

## Setup

The project can be deployed quickly on Deno Deploy. The following environment
variables must be set:

- `GITHUB_USERS`: A comma-separated list of GitHub users & organisations to link
  to.
- `PORT`: The port to run the server on, defaults to 8000.
