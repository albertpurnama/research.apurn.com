
- [[#Thoughts|Thoughts]]
		- [[#Existing designs|Existing designs]]


-----

User's problem:
- User doesn't understand the concept of "Placeholder", is this something we can fix?
- User doesn't understand the difference between rich text content and the template


-----
##  Improvements & Features List

- Fetches schema from notion table then create the collection schema for the first time. *We're doing this because we don't want the user to override the tables anymore*
- Create the UI that waits for zapier connection to sync Notion table >< Typedream Collection.
	- "We'll wait for you.."
	- When you're ready, test it!
- Re-upload images.

----
### Fetching schema from the notion table and creating the collection schema

What collection schema do we want to create? 
- Collection templates that we have right now:
	- Blog
	- Knowledge Base
	- Directory
	- Shop
	- Testimonial
	- Team

Do we create each of these for our users? Prioritize Blog?
#1 use cases seem to be **blogs and directories**. Stick to these 2





----



-----

## Old thoughts.

**Features:**
- Get data from database
	- Inside anything at all (?), including key attributes, image alt, etc. **How do you do this cleanly?**
- Store page collection item data (slateJSON)
- Edit Collection Template
- Edit Collection Item template


**Getting data from database**

