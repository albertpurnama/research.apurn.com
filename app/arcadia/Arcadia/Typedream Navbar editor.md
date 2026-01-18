Minimum completion should use the navbar content from space customization. But how do you pass that data in the editor and maintain its state? Have to see current implementation

How do you maintain backward compatibility with the old way of doing navbar?

How do you make sure there's no duplicate? Let's say there's 1 in the page and 1 in the space customization. Prioritize the one in the page?

Should the navbar be inside the children or? How?
- navbar should be a children of the root. Think of html doc, there's no.... shit... there's `<header>`
- Should it normalize? What if user creates a navbar at the end of the doc, what's the behavior there?

