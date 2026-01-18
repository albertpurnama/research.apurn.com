4 quadrants:
1. Build personal financial wealth
2. Find a life partner
3. Help community
4. ~~Help family members build wealth~~


------

- [x] Create task management system. ⏳ 2023-04-15 ✅ 2023-04-15
	- [ ] Auto move some stuff around?
	- [ ] 
- [x] Break down navbar UI issues on renderer ⏳ 2023-04-16 ✅ 2023-04-16
	- [x] Create some examples, filled with all possible cases ⏳ 2023-04-16 ✅ 2023-04-16
	      https://build.typedream.com/s/pestorico/fbbb04ea-684b-4fbe-b65b-477bc66bb234/23748ae3-99fd-4ca3-8e53-030da5195093
		- [ ] Button, Links
		- [ ] Dropdown
		- [ ] Alignment, left and right
		- [ ] Positioning (sticky or not)
		- [ ] Blur?
	- [x] Test navbar burger menu ⏳ 2023-04-16 ✅ 2023-04-21
- [ ] 


- [x] Handle error on upload
- [x] Snap to grid resizing
- [x] Fix bug where you click "templates" on sidebar, then go back to "page" 
- [x] Fix updating sync container content. Need to do `updateTransclusion` before loading initial data. maybe do this inside the `getPage`?
- [x] Missing attributes feature
	- [x] Delegated to Bayu
- [x] Audio doesn't work yet


- [x] Accordion plus button is missing?
- [x] Port RootElementSettings
- [x] Form is still missing on the editor.



- [ ] Fix Accordion bug
Steps to reproduce:
1. Create a container, create an accordion
2. Try dragging the accordion inside the container
	1. This should unwrap the accordion item instead of wrapping it inside a new accordion element in the container

- [x] Fix accordion bug #2
1. Create an accordion, put your cursor on the accordion item header
2. Press add new block
3. It shouldn't create the item in the item header


- [x] Test conflicting local page
- [x] Backup should be running
- [x] Saving
	- [x] Transclusion should be saved
	- [x] Collection should be saved
- [ ] 


Older Todos
-----


- [x] Send over a photocopy of I-797 to DMV
- [x] Jessica's health insurance should cover rawat jalan expenses?
- [x] README + Examples Zustand Query
- [x] Storybook CI (Github Actions)
- [x] Review hide "can view" role
- [x]  [TD-1828: If customer_id is filled in, but product id not updated, then wait for webhook to update BE](https://github.com/typedreamhq/frontend/pull/488)
- [x]   [TD-1821: Add mobile text settings option](https://github.com/typedreamhq/frontend/pull/486)
- [x]   [TD-1811: Mobile-change-root-background](https://github.com/typedreamhq/frontend/pull/483)
- [x]   [TD-1762: Update mobile serializer to use root background, root not always 100vh](https://github.com/typedreamhq/frontend/pull/482)
- [x]   [TD-1756: Mobile font color](https://github.com/typedreamhq/frontend/pull/481)
- [x] ~~Remove Github action on pull request for chromatic~~


- [x] Review https://github.com/typedreamhq/zustand-query/pull/4/files
- [x] Armedi query invalidation in `frontend` requires some stuff.
- [ ] https://github.com/typedreamhq/frontend/pull/512 merge + deploy new minor version

- [ ] https://ispo.ucsd.edu/advising/visa/current-returning-students/visa-status/leaving-ucsd/withdrawal.html#Changing-from-F-1/J-1-Visa-Stat submit ispo request to terminate O1, also submit 24 months eval


Misc
--------


- i want to make sure that I don't put blames on people that are involved in the incident. If at any point, I or anyone casts judgements, please let the person know as I want this to be a discussion on what needs to be done to get better, not casting people down
- Morning incident
	- was trying to test custom domains on staging like I usually do, turns out staging was gone
	- It was deleted quite a while ago, without any notification to me who's been using it for testing, although not that often (probably once or twice per month)
	- After investigation turns out tony deleted it
- as a result, I spent more time 4+ hours trying to reconfigure my workflow to the new changes, trying to figure out what wen't wrong because my usual workflow does not work anymore.
	- Staging-api is also broken because the project is moved to different team

Why so furious?
- It's not necessarily about the 4 hours that's gone, but that surely hurts.
- It's because the lack of communication. To make matters worse, we live 1 wall apart, yet still fails in trivial communication such as breaking changes announcements.
- Similar incident occurs quite some time ago, I believe I have already communicated and demonstrated how breaking changes should be communicated.

What are the steps to make sure this doesn't happen again?

