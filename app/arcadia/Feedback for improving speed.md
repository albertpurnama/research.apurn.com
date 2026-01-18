- (Complexity) Codebase has grown too big/much ⚠
	- Adding a feature needs to change more files that it needs
- Compile time takes a long time
	- To start developer mode(?) takes 2-5 minutes
		- If you run this for too long, it needs to restart. (every 6 hours.)
	- Hot reload is bad on certain pages? sometimes it takes more than 5 seconds to rebuild.
- Small inconvenience:
	- Trying to agree on the API contracts take some time
	- Waiting for PR reviews

Complexity reduction approach:
1. Group by feature/domain would work better.
	1. You don't need to jump up and down on the directory tree. You only need to change the same folder.
2. Define the domains first.
	1. AI
	2. Editor
	3. Email Marketing

Where to start?
- AI stuff already well defined
	- But, AI components still grouped up in single component folder.
- Auth stuff can be grouped up into similar folder.
- `components/ui` for all UI components
- `components/featureX` for feature related
	- See `AIWebsiteBuilder`, something like this would be great.

Related books:
- A Philosophy of Software Design.
