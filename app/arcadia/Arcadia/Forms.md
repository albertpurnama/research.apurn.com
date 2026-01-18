DB:
pass Kch#dnmD63sGpds


**Figure out how to do merging when there are input name duplicates.**
- add callback `requestNewFormSchemaID` that can be passed in through plugin
	- this callback will handle creating a new form instance, with no name, only text type.
- Every time the editor creates a new input block:
	- it will attempt to create a new form schema item.
	- Update the `name` property with `id` created by the callback `requestNewFormSchemaID`.
- On save,
	- It will cross-check the `name` property in the slate json with the `collection`'s form schema.
	- 

Why do the above? Corner cases that the new way above can cover:
1. Changing the label name, but maintaining the correct column (without deleting and recreating new one), think about the following sequence of action:
	1. Create new input with label "First Name"
	2. Save and publish the form
	3. Submit a form submission
	4. Change the same input with label "Last Name"
	5. Save and publish the form
	6. Submit a form submission
	7. The submission should show 1 column "Last Name".
2. Deleting and adding new input
	1. Create new input with label "First Name"
	2. Save and publish the form
	3. Submit a form submission
	4. Delete the input created on (1).
	5. Create new input with same label as (1)
	6. Save and publish the form
	7. Submit a form.
	8. The submission should now show 2 column of "First Name"
3. 


#### Discussion
- Tables are generated upon form creation.
- Table columns are generated upon saving an edited form.
	- Add new field name = add column
		- BUT, don't delete column
- Need to have draft form.

###### Target Mid Oct:
- Able to create forms and generate it on the renderer.
	- No need submission

- [x] Feature flag for creating form.
	- [x] /form shows create new or select existing.
		- [x] Dummy data for list of available forms. No need dummy data anymore, connect to customization
		- [ ] Option A: When create new go to new page that ask user to edit form:
			- ~~Create a [[Fragment]]~~ -> little benefit for now, but requires tons of changes, maybe not worth doing now.
		- [ ] ~~Option B: Create the form in the page itself, whenever there's changes to the input fields, user need to trigger "save" on the toolbar lol.~~
			- [ ] 

In the form editor, you can't wrap all the contents around FormElement, because then you'd have to control/ handle the height, width etc of the form element. BUT maybe that's good? see if you can just do that bro. code it

### How to create new forms
1. Do `/form` , then you can "Edit Form"
2. A popup like collection will show up, and it allows you to change the questions in the form.
	1. Should submit button be customizable?

1. Go to site settings -> Forms -> create new
2. Go to a new text editor page with additional input components.
	1. Don't need to create a new editor, just add new input components / form submission component

### How to generate new form input?
1. do regular slash command.
	1. Maybe add a plugin for forms. whenever a form input is about to be inserted, it **queues** a form creation + form element creation.
		1. The reason we want to queue is to prevent accidental deletion of form elements?
			1. What happens when form input is deleted? does it still keep track of the previous submissions? I think it should still keep track of it, and still shown as a deleted field(?), this is an edge case we might not have to think about. For now, don't show the deleted field.
	2. Instead of adding plugin, maybe we should ask the user to select input, or create new one.
		1. This way, the user triggers the create action or can select from existing inputs, thus eliminating Edge Case 1


### Invalid Form State
Give a red box around the form with a tooltip on the corner saying the error (maybe missing submit button?)


### Caveats
- **Only soft deletes form fields! never hard delete!** -> because we might need to "restore" some columns on accidental deletion



### Edge Cases
List of edge cases I can think of now:

---

#### 1. Accidental deletion of an input field
2. Insert /input text
3. change name, types, etc
4. save, publish
5. go to site with this form, fill up the text field, submit
6. go to editor, delete the input field
7. change name, type, etc. to be exactly the same as (2)
8. save, publish
9. go to site with this form, fill up the text field, submit

What should you see in the form submission?
- we should see 2 columns (1 for hidden, deleted column) both filled with submission from (4) and (8)

---




### Input Types
- Short Answer
- Long Answer
- Multiple Choice
- Checkboxes
- Number


Upon form creation:
1. Create form
2. Check connected database
	1. If no database connected, give option to create new database for the form
	2. Can connect to notion???? yes. do notion
3. 


Worker is its own thread. 
Worker take from queue, process it. Nama lainnya consumer.



