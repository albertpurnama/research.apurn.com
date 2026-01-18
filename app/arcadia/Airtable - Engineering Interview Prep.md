# Airtable Prompt

This will be a one hour deep dive into projects that you’ve worked on as an opportunity for you to showcase your previous work. For this discussion, you’ll pick one or two projects from your time at Typedream to discuss with a member of our engineering team (no presentation necessary). How to choose your projects: We recommend choosing challenging or meaty projects that you’re comfortable discussing in depth. 

● We are most interested in hearing about your contributions to the project, how you’ve tackled problems, as well as the impact to the business. 
● What were some of the tradeoffs and challenges along the way? 
● What did you learn from that project that you will try to replicate moving forward? 
● Expect to go a little deep – try and refresh yourself on the specifics of the work 

We recommend choosing a sizable project that had interesting decisions you needed to make or collaboration required to be successful. For example, this can be a large feature initiative that you’ve worked on, a feature that’s technically complex due to scale/integrity/design, or a cross-functional initiative that you’ve led. We don’t recommend selecting a personal hobby or side project for this interview.

# Answer (60 minutes)

> The general direction of the answer should be applying previous learnings from previous feature building to AI (latest feature). Applying learnings that you get from building editor to building the AI onboarding process.

**Projects:**
- AI
- Editor rebuild
- Email Marketing
- Forms

### Key points

### Questions for David

Dropbox related:
- I've done my fair bit of one on ones, here's what I'm struggling at:
	- What do you think is the main goal of one on ones? 
	- How did you measure your performance towards the goal?
- Distributed system, what are some of your core learnings from here that you think is applicable in your job at Airtable and maybe across the software industry?
	- Improve existing infrastructure.
	- Understand where the company is in relation to their mission, where is the company going? Dropbox had a vision, they already achieved it. Airtable wants to help people create apps without knowing codes.
	- Exciting to work on company's focus on.


Airtable related:
- What were some of the biggest technical debts in Airtable? How did the team manage or work around or fix it?
- Speed as second class citizen - It seems like the emphasis from Howie is "substance over speed", I find that interesting since it seems to me like airtable puts speed as sort of a second class citizen when building out products. What are some of the interesting framework that you apply in product building that resonates with this motto?


### Problem - Solution Cycle
> how you’ve tackled problems

How I usually tackle problems:
1. Define time constraint to think of a solution. Let's call this brainstorming time
2. Study the problem
3. Until brainstorming time is up:
	1. Re-iterate the problem
	2. Take a walk
	3. Write some potential solution/thoughts/questions
4. Code.
5. Document High Level (optional, strongly recommended)

A couple of principles that we - founders - adopt:
1. Development Speed - we're prioritizing development speed everywhere in our tech stack.
2. Frugality - we try to not pay for services that we do not absolutely need.

### Renderer + Editor

> *your contributions to the project* - This entire section
> *What were some of the tradeoffs and challenges along the way?* - Pros & cons

> From business problem, then technical solution

**Problem** (Chronological)
- **Need to be Notion** like, based from audience feedback. Why notion like?
	- Simple & familiar interface.
	- But notion had its challenges, not SEO friendly, and very slow.
- Fast forward Putri built out the initial MVP (?), I was still maintaining the old product.
	- We solved the issue of simple & familiar interface,
	- But it's not really a usable website (slow & not SEO friendly)
- We encounter challenges because user requires the renderer to be fast for SEO purposes.
	- We did not load html with basic page information from the server (similar to a basic react app), causing SEO to not scrape the data (bad SEO score).
	- We load things very slowly. Images, ultra slow even tho we use Next.JS which should solve our image issue, but nope, it does not work.

**Approaches**
- Pre build the website.
	- Since we know that websites are basically just html, css and javascript. Why don't we process the json that we have, render the required html, css and javascript. Push them to S3, then serve the S3 bucket through CDN?
	- Pros & Cons:
		- (+) Guaranteed to be extremely fast, but static. It will be difficult to make it stateful, especially when we're thinking of moving to e-commerce sites.
		- (+)
		- (-) Stateful websites - sites that requires form input, payment system - will definitely be out of reach (or basically very hard to implement) with this system.
		- (-) We're essentially building our own framework, we tried experimenting with NextJS export, but we couldn't get it to work in the time allocated for this (we have to move fast).
	- We did not move forward with this solution, but it is somewhat of an optimal solution for web vital score.
- Make the existing renderer load faster. How about we optimize the existing renderer?
	- Context: Renderer and editor currently use the same code to render the websites, this is to make sure that the editor and renderer both are showing the exact same result (live preview).
	- (option: a) Make the code load faster. Code split, trim down the javascript, remove unused packages, dynamic loading, etc.
		- Pros & cons:
			- (+) We maintains the consistent implementation for editor and renderer, nice!
			- (-) We coupled the editor and renderer too tightly, we don't have a lot of wiggle room in the editor which we require to move fast.
		- We tried this approach for a week or two to see how big of an impact optimizing the code that we have really have on the performance. We concluded that:
			- The SEO problems are not solved by this solution, no matter how performant the app is, we still need to load too many crucial javascript libraries.
	- (option: b) Refactor. 
		- From experimentation of (option:a) we learned a few things:
			- The library that is heavy to load is mostly our editing library `SlateJS` and its plugins to make sure that every functionalities work (undo, redo, etc).
			- The loading of slate cannot happen on server side which prevents the html of an entire page to be loaded.
			- We only need our components implementation for renderer and a little bit of logic.
		- Refactor the necessary components out: `core` (the definitions of containers, paragraphs, links, columns, buttons, etc) and its `components` implementation. Then we can fully scrape off the entire `slate` from our renderer.
			- Pros & cons:
				- (+) We can utilize NextJS's ISR to its maximum potential by somewhat pre-rendering the pages.
				- (+) Components are reusable in both editor and renderer, ensuring consistency of the styling.
				- (-) A lot of work to refactor the components, not only because there's a lot of component to be re-worked, but it has to also be usable for Slate since we're not omitting slate in the editor.
			- 

> What did you learn from that project that you will try to replicate moving forward? 

**Learnings**
- Engineers spent most of their time optimizing/maintaining/building/etc something that shouldn’t exist in the first place
	- Removing the editing related code from the `renderer` is game changer, it forces our team to think about what to put into the codebase. It's not the number of lines added to the codebase, but also the number of lines *removed*.
- Code composition, how do you break down a webpage into smaller components (think of lego bricks) that can be assembled or re-assembled into different looking websites (think of millenium falcon legos)
	- There's a unique slider of simplicity here. High Composability, difficult UX, Low Composability, bad UX.
		- The more composable the components are, usually the more difficult it is for the user to use.
			- The most composable components are the basic building blocks of the webpage: html.
				- But if you go to this direction, we'll end up complicating the editor (think of webflow) which are notorious for its difficult interface (it has an entire university dedicated to it!)
		- We can opt for non composable components, think of prebuilt components that user can use. For example: Hero section. User can select different layout for the hero section, but they can't move the text around or move the buttons around.
			- This is easier for the user because it's just a matter of selecting which one you want to use.
			- But it is really difficult to extend its functionality, do we really need to modify the code whenever we want to add new types of components?
- Smaller but notable learnings:
	- Unstable frameworks are pure headaches, Slate is still unstable, along with the plugins (which are also unstable). 
	- Separation of concerns works well for refactoring code. Refactor for the purpose of making the code easier to work on. In this case we separated the core package, component, and app layer (editor and renderer).
		- This enables us to build on top of this *rapidly*, we're able to create simple link in bio (dump.link), email marketing, digital product (ecommerce), AI website builder.


### AI Website builder

> *your contributions to the project* - This entire section
> *What were some of the tradeoffs and challenges along the way?* - Pros & cons

The main point: how can we retain the customer longer. We don't want to compete with webflow head on, but we want to increase retention, how do we do it?

**Problem**
- We know that as our clients grow, they do not really want to maintain their own websites, they will want to hire design agencies to make rapid changes or entire redesign of the website.
- There are plenty of AI website builder at the time (10web, framer, etc) however they don't work well (they generate roughly the same thing, mid tier result that doesn’t look good)
- The solution is to come up with a better end result than existing solution:
	- Make the end result (generated website) as diverse and have the potential to be more diverse
	- Has to be transferable to other platforms (including Typedream). This is key because(?)

**Approaches** - some solutions we’ve thought about (roughly chronological):
- Let the AI generate html since it’s very good at it. But we found that the output of standard non finetuned models are low tier websites. Checkout the pizza restaurant’s website generated by ai. Ended up not taking this route.
	- Pros & cons:
		- (+) We can leverage existing LLM without much work.
		- (-) Bad result
		- (-) Difficult to control
- Let the AI generate layouts of a good website think of yaml for website layout, convert that into Typedream’s structure. This is a brilliant idea if you want to save token cost, but in the end it still outputs same shitty websites as the first solution.
	- Pros & cons:
		- Roughly the same as the first solution
- At this point I took another look at existing ai powered solutions. At the time, it was v0.dev, I was wondering why were they able to generate nicer looking UI with the same llm that I’m using, it didn’t make sense to me. Then I noticed that all their components roughly have the same styling. When I take a look at the code generated, they were using pre-existing libraries!!
- Went back to drawing board with a simple idea: use existing templates. But how? How can we teach the ai to use the components/templates that we have?
	- I went full circle to the idea of using an llm to generate predefined template, but it doesn't really work because it needs to be pretrained to understand the templates that we have.
	- I also considered generating a simpler yaml structure that generates something like a list of sections with template ids. But we couldn't figure out the consistency issues at the time (it hallucinates in picking the right template for the right section)
	- Then as I was trying to fix some bugs on email marketing feature, I saw template strings implemented in emails (something like {{.first_name}} ) To say something like `Hey David,`, etc.
		- So basically at this point, we break the problem into an even smaller pieces. We divide the AI process into 3
			- Generating supplemental context about the website user is building (this is what you see during onboarding process).
			- Pick sections that are appropriate for home page. for example, you don't need a pricing section if it is a personal website.
			- Generate the content/copywriting for each section.
		- Why these 3?
			- We know for sure that AI are still inconsistent at scale, there's going to be a lot of failures
			- This small systems allow us to have better re-try-ability in each step of the process
			- Smaller task = better reliability
		- Pros & cons:
			- 
	- I want to highlight the importance of string templating at this point.
		- This provides rapid development as this is just string replace instead of generating the entire template in JSON format that we use. We can simply create the template inside Typedream, copy the JSON, change all text to be mustache-like `{{.some_variable}}`, and then copy that into our database. (we already have a simple admin system to add these so our contractors are able to do this themselves)
		- It really makes things easier to understand, there's no complicated process here, it's just the LLM generates the data required by each unique chosen section's template. Think of a simple javascript object or python dictionary. Then we insert that object to processing function along with the string template text, it will replace every occurence of the object properties as the values.
		- The downside is, dependency. If we ever decide that we don't want to use `height` property for container anymore, then we'll have to go to each of the templates that we have, we replace the `height` with the new property.(or provide backward compatibility, but we all know that sucks.)
		- Another downside typos are to be expected during development, there was a point in time where I lack sleep, when I try to figure out what went wrong with a specific template, I just wasn't careful with the variable names so it didn't get replaced by the string processor. And there's no error!!!
	- There's a lot more detail here including how to make the processes faster, it does have 
		- State machines to make sure that the processes are all managed and processed in the most async way possible, but not conflicting
	- 

> What did you learn from that project that you will try to replicate moving forward? 

**Learnings**
- Current AI systems are not AGI yet, what this means to us is that we have to break the problem into reasonable size that can individually be solved by a small AI system. Then we combine the result (which can also be done by an AI). This increases the reliability of the system, and also adds more room for collaboration between engineers. 

[[Airtable - Engineering Interview Prep - ChatGPT Solution]]