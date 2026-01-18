**Create options**:
1.  syncReferences: id -> value
	1. Generated from space.customization
2. setSyncReference: (id, value) => void
	1. Set the value of the transclusion, useful to create new sync references.


**Behaviors**:
- Copy the contents of the synced container inside the editor
	- We don't always update the content, but we want to copy the content over on load.
- Detaching container only removes the transclusion reference id
- Create sync container creates a new sync container editor.
- Sync container badge should show the name of the container.
- /sync will create an empty container that have the option to don't sync

