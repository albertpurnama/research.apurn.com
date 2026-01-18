## Goal

To introduce Typedream CMS without much change.

## The most practical way

- No refactors
- No reworks
- Use whatever we have right now, and implement it
- Documentation is a must

If there are bugs, we'll give them to future engineers to work on it.

**Why is the practical way better?**
- There's no time to figure out some stuff.
- We want fast iteration
- Doing the correct way will cause more short-term bugs, but less long term instability.

**Based on the learnings on DreamEditor**
- Nobody seems to really understand what DreamEditor is for, and how important that is compared to pushing features. I still believe that we should fix our technical debts, but it seems like we don't prioritize that, so why are we doing CMS the better way now?


## Parts to figure out

- CMS structure
	- How to generate the schemas?
- Connecting to Typedream CMS vs Notion.
- Passing data from Typedream CMS to the page.


## PoC 
proof of concept

- Define data structures necessary to render stuff
- Create a page on admin that can CRUD a blog

Data structures:

For Item Page:
- ItemPageSchema
	- To map the columns in the database into the blocks
- CollectionData schema
	- 
