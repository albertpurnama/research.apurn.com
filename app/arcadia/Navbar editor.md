
## Backward compatibility

Case 1 (creating a new page):
- `space.navbar` exist
- but `page.content` doesn't exist

Case 2 (create a new page):
- `space.navbar` does not exist
- `page.content` doesn't exist

Case 3 (existing page):
- `space.navbar` exist
- `page.content` exist

In case 3, we want `page.content` to have `NavbarElement` as the first children of `root`. it will be synced across the pages.

Case 4 (existing page):
- `space.navbar` does not exist
- `page.content` exist

In case 4, there's nothing to be done, we will not create `NavbarElement` as the first children of `root` block.

Case 5 (create new navbar):
- `space.navbar` does not exist
- `page.content` exist, and it has `NavbarElement` as the first children of `root` block.

Case 6 (edit navbar):
- `space.navbar` exist
- `page.content` exist, and it has `NavbarElement` as the first children of the `root` block.

In case 5 and 6, We want to update `space.navbar` to equal the `NavbarElement` on the first children of the root block



## Requirements, questions, etc

Minimum completion should use the navbar content from space customization. But how do you pass that data in the editor and maintain its state? Have to see current implementation.

How do you maintain backward compatibility with the old way of doing navbar?

How do you make sure there's no duplicate? Let's say there's 1 in the page and 1 in the space customization. Prioritize the one in the page?

Should the navbar be inside the children or? How?
- navbar should be a children of the root. Think of html doc, there's no.... shit... there's `<header>`
- Should it normalize? What if user creates a navbar at the end of the doc, what's the behavior there?

