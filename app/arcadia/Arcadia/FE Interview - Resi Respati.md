Github:
https://github.com/resir014/nextjs-tailwindcss-quickstart

Jakarta.

**Tell me about yourself**
Full time work career c88 financial cekaja.com Junior web dev.
- Daily maintenance homepage, etc.

Kata.ai 2018
4 years there. FE engineer kata platform chatbot
docs.kata.ai
Promoted to Senior here.
Developed Design System.

Warung Pintar platform engineer.
Improve developer experience here.
Implementing developer portal
product dev team migration to typescript.
Warpin got acquired by sirclo

**At what size of the company X did you first join?**
45 people 10-20 engineers.
20-30 people all split 4-5 different squads.

**What do you like about joining the team at that size?**


**What do you not like about it?**


**Any challenges on working on a team? If so, explain to us**


**Have you been training someone else**


**Have you worked at a small-scale startup before?**


**Are you comfortable with unstructured work?**
Daily standups as usual.
Friday talk session.
Boardgames on friday

**Why are you interested in Typedream?**


**Why do you want to move from your current position?**


**Do you have any suggestions (product, etc.) that you can help implement if you get the opportunity to work with Typedream?**


**What do you want to learn from Typedream?**


**Where do you see yourself 5 years from now**


**Job Description**  

-   Defines and execute on an execution plan to build features or internal system maintenance/upgrade, understands the purpose of the features, and works on scoping work down into smaller, actionable parts.
-   Work closely with founders and design to implement fast new feature concepts
-   Understand the priorities of tasks, adjusts well to shifting priorities when necessary, and able to handle larger responsibilities such as deployments or crisis management
-   Strives to reduce technical debt, manages larger refactors and/or system upgrades, and helps others to do the same or participate.
-   Able to estimate scope of work, and when those estimates are off, coordinates with the founders to address risks, and take ownership.
-   Works on our code & system architecture, thinking through problems and anticipating usage into the future. Builds systems that scale to the appropriate amount.
-   Effectively communicates when there are problems, understanding risks and impact of any proposed changes. Listens well when others express tradeoffs next to other priorities.
-   Helps support the work of their peers by reviewing and providing mentoring
-   Actively participates in Engineering & team efforts that help streamline our workflow

## END
**Do you have any questions for me?**
Working arrangement. Fully remote.
Are all basic benefits provided?
Any interesting projects in the pipeline?

**Anything you want me to know that we haven't discussed yet**
None.

**Salary expectation**
Rp 22.5 mio jt +- 5%

Mid feb - 3rd week feb

### Technical

>From your take home project, you were tasked to make some custom components using SlateJS. Can you go through your code and tell us briefly what each part of your component do?

- Organized code in modules system
	- Slate related stuff in modules
- nodes, elements, leaf.
- match-result-element -> just a custom component element.
- Toggle button from radix.
- Mark is basically what's highlighted??

renderElement vs renderLeaf
renderElement is block, renderLeaf

Why dynamic import?
Anything that is rendered in the server there might be server mismatch.

>If you have used any text editing applications, you must've used undo or redo feature. We have the same feature in SlateJS. We know that you are not familiar with this feature in SlateJS yet, but can you spend about 10 to 15 minutes trying to find out how undo or redo feature work in Slate?

- Jumps into history editor
- Goes to history.ts immediately.
- Batch of undos and redos feature
- Slate History applies the operation.

Adds history property. includes undo and redos stack. everytime we add , we add into the undo and redo stack.

- explained the inverse correctly.

**Why didn't you reach this conclusion before?**
Didn't really know what operation does,
Once you think more about it, you make more sense of things.

1.  Take a 10- 15 minutes to read through plugins section of the docs.

3.  Explain to me what you think plugin is.

Add some additional behavior or functions

5.  How would you augment the editor the behavior so that the "return"/"enter" key, it creates new line and also writes text <his-name>?

initialized the editor `withCrazyExitBreak`.
inserted console.log in `editor.insertBreak`
inserted `Transforms.insertText` inside the plugin.
hinted `editor.insertText`
used `editor.insertNode`


