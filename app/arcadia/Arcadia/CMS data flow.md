### How does the data from notion flows into a Typedream page?

### Who controls the permission to view the data? Don't we need notion API key to access data?

### When do we update/sync collection data in `editor`?

### When do we update/sync collection data in `renderer`?
It's either in `syncCollection` or `syncCollectionItem` , or maybe both? I'm not sure. https://github.com/typedreamhq/cloud/pull/699 description might give a bit more context.

### When do we refresh image on regular CMS flow (not notion sync)?
I think it's only in `useItemPageFetcher` see [[Image Refetch CMS]]


### What is `collectionDataItem` ?
it's the collection data in the page customization. Accessed by `page?.customization?.collection_data?.[collectionID]`
`collectionID` is retrieved from the collectionElement

### What is `space.customization?.collection_item_data`?


### What is `processNewCursorState`?
Pagination of the collection element. Remember that collection can have "Show more" button. Everytime you click "Show more" it will create a new cursor state based on what's shown right now.

There may be other uses which I have not go over yet.


