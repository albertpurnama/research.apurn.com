on root directory

1. Cut a new version
	1. `yarn version --minor` or `yarn version --patch` 
2. Create a git release branch
	1. `git checkout -b releases/v0.57.0` (obviously using the cut version)
	2. `git push releases/v0.57.0` to trigger deployment
3. Create git release notes
	1. Auto generate the notes
	2. If it's patch, do manual commit work.
