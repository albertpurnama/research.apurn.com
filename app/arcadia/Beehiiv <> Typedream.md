
*Tyler*
3-6 months roadmap:
1. Cold start problem
	1. Quick start templates,, ability to choose from dozens of available templates for different use cases.
	2. a bit more focus on how posts (ie content) are rendered. And all of the associated elements with running a content website (custom popups, custom paywalls, signup forms, login flow).
		1. Got it.
	3. add, remove, drag and drop new block elements into a section
		1. Typedream components
	4. each element allows for customization settings specific to that type of element.
		1. SideToolbar
	5. easy ways to add new pages, customize those pages similarly, add them to navbar, link navigation together throughout site, add to nav/footer
		1. Internal link
2. 

*Ben*
1. scan through some of the tiptap/prosemirror documentation
	1. Noted, I just played around with it a little bit.
2. What was it that drew you to Slate instead of any alternatives? Are there any features offered by Slate that aren't possible with the other tools you evaluated?
	1. I'll leave this question for @putri to answer

*Jake*
1. .. figure out is the best way to approach the rendering piece of this. The goal would be to have the in-editor experience closely match what the end result of the published website and I imagine there’s probably a few different ways you could achieve this ..
	1. Solved this with @typedream/core + @typedream/components combo which works well so far. We can discuss more in detail about this.
2. ...rendering engine in ruby that takes the JSON content from our editor and can spit out HTML for different contexts like plain text, web, email, and rss...
	1. We utilize SSR for this, we rely on the frameworks like NextJS to optimize the rendering of the JSON. This is why we can use basic react components which ends up simplifying the flow.

---

Seems like Beehiiv care about the founders continuing the website builder, leading the development in the website builder. **Then?**

Build the base for website builder again. If you can, do not make the web editor as complicated.


--- 

What am I doing??
- Experiment on approaches to integrate Typedream & Beehiiv

Why do this?
- To help beehiiv make informed decision

How deep/far should I help beehiiv in terms of figuring out the next steps?
- I don't know? What's a good rule of thumb?
	- Not too deep, not too short. It has to somehow provide some pathways or approaches that we can take, given resources that we have.

What do we have that they don't?
- Fully featured editor, complete with customization of the buttons, paragraph, etc.

Where do they use tiptap?
- I don't know whether they use tiptap in the web editor, it doesn't seem like it
- 

What is their goal?
- To make the website editing more robust? introduce more functionalities like dnd, more complex toolbar, etc?

Do they care about the AI website builder?
- 

They don't seem to use Tiptap for the website builder yet. Is this true? or you just disabled tiptap for the website builder and you're thinking of actually adding tiptap to the website builder?


Beehiiv's way of live preview:
1. When user updates color (anything on the sidebar):
	1. Beehiiv sends entire updated data to the server,
	2. This has publication id, website template id, and its values. I assume they'd want to add additional templates later on?
	3. Then after website successfully updated, frontend client refreshed the live preview iframe -> This will re-request the draft version of the website.
2. 


Things beehiiv needs to know:
1. How fast?

---

On top of the specific part that we want to discuss later. It might be useful for me to know what kind of data that I'll be dealing with. 

I assume Beehiiv follow Tiptap's JSON structure, but it'd be great if you can provide me the some of the components that you currently have. 

1. How do you define simple components like paragraph and images? 
2. How about the more complex components like form inputs, newsletter list, etc?

Some samples would be great. Or even if you have the storybook for it, that'd be awesome.

This might help me figure out which part of the web editor is the most important part to discuss, or even provide some basic samples on how we might be able to move forward with rendering existing Beehiiv structure in Typedream's editor.

Best,
Albert


