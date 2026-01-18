> Under construction

Based on post mortem [Unable to Save, Preview, and Publish](https://www.notion.so/typedreamhq/Unable-to-Save-Preview-and-Publish-8235095fe36b48ff9ebc3371e548a1a2?pvs=4) (users are unable to save), we don't have enough time for the QA to test the releases that is happening on Thursday & Friday PST time.

Problems we're trying to solve:
- Give enough time for QA to test latest release that will not go stale when there's new commits happening on main

Requirements for solving the issue:
- Developers shouldn't be blocked when they want to merge to main
- QAs need to be able to understand what preview link to test on each release.


### Proposed solution

Cut version:
1. Tag new version
2. Push latest version to `canary` branch for test, there can only be 1 branch to test at each cycle.

