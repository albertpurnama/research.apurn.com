**Tell me about yourself**
5 years software engineering.
Backend engineering for first year.
Second year frontend lead.

Move to kata.ai as Design Language System AskaraUI.
Done warungpintar
refactoring some codebase.
Migrating from JS to typescript.

**Why Typescript?**
Need static types.

**How would you describe Design Language System?**
Designer make the DLS.
Engineering make the design first.

**At what size of the company X did you first join?**

**What do you like about joining the team at that size?**


**What do you not like about it?**


**Any challenges on working on a team? If so, explain to us**


**Have you been training someone else**

**Have you worked at a small-scale startup before?**

**Are you comfortable with unstructured work?**
Most of them breaking apart bigger task to smaller task.
Engineering describe the technical stuff.

**Why are you interested in Typedream?**

**Why do you want to move from your current position?**

**Do you have any suggestions (product, etc.) that you can help implement if you get the opportunity to work with Typedream?**


**What do you want to learn from Typedream?**


**Where do you see yourself 5 years from now**
Still want to be IC.

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
If Typedream is using SlateJS, imo, Typedream is using simplicity as a base. What's the competitive advantage from webflow?

60% meetings.

in Warpin define the tasks ourself, and synchronize the work every week.

Is there any way I can contribute to other teams?

Familiar with Go.

Warpin has gowork, event on November.

Based in Malang. seeing real person is better, need office lol.

**Anything you want me to know that we haven't discussed yet**

**Salary expectation**
<= Rp 25 mio

Want take part time job too if possible.

### Technical

>From your take home project, you were tasked to make some custom components using SlateJS. Can you go through your code and tell us briefly what each part of your component do?

- didn't use `isHotkey`  because he wants to use his own implementation.
- Heading and blockquote.
- renderLeaf vs renderElement
	- Always render element first, then the leaf.
	- if we use leaf, it can be partial(?)
	- Seems to understand splitting the leaf.

in slateJS, we can make serializer to serialize the data.

>If you have used any text editing applications, you must've used undo or redo feature. We have the same feature in SlateJS. We know that you are not familiar with this feature in SlateJS yet, but can you spend about 10 to 15 minutes trying to find out how undo or redo feature work in Slate?

Doesn't immediately google, but think about how it works. 
Uses stack.

went to slatejs and went to slate history. 8.05
look around the docs... 8.07
went to slate github package 8.07
but went back to docs.slatejs.org 

Hint: If encounter a bug....

If you encounter a bug, just copy all the files in slate github.

2 different stack on undos and redos.
operation.inverse -> change the order of the value of the batch?


#### Replit question
https://replit.com/@apurn/slate-plugin#pages/index.tsx

Start at 8.24
found `insertBreak` in the editor.
found `insertText` immediately.

used `e.insertText`
inserted plugin at 8.25

8.26
didn't use the old insertBreak behavior
looking for the const {insertBreak} = e;

8.28
added break lines like `e.insertText('mirza\n')`

8.31
Given the clue `const { insertBreak } = e;`


How would you score yourself? 9/10