**Tell me about yourself**
Lulus dari kampus indo 2021
Ruangguru after college
Wander
1.5 minggu after probation, seluruh team asia di layoff. Timezone problem

RoboGuru
Only create dashboards, CRUD system.

**At what size of the company X did you first join?**
16 engineers, total 18 before laid off.

**What do you like about joining the team at that size?**


**What do you not like about it?**


**Any challenges on working on a team? If so, explain to us**


**Have you been training someone else**


**Have you worked at a small-scale startup before?**


**Are you comfortable with unstructured work?**


**Why are you interested in Typedream?**
- Projectnya menarik, something never thought before

**Why do you want to move from your current position?**


**Do you have any suggestions (product, etc.) that you can help implement if you get the opportunity to work with Typedream?**


**What do you want to learn from Typedream?**


**Where do you see yourself 5 years from now**
- Managerial as the target


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
async or sync?


**Anything you want me to know that we haven't discussed yet**
Never worked on a small startup before.
Usually working with other people in a single project.
Several freelance project.

**Salary expectation**
Wander is US based salary.
< Rp 25 mio gross.


### Technical

>From your take home project, you were tasked to make some custom components using SlateJS. Can you go through your code and tell us briefly what each part of your component do?

renderElement is custom component?
render different types of the element
belum cek semua attributes ada apa aja

renderLeaf yang inline instead of blocks.

Slate nampung semua editor state
Editable buat nampilin and also handles the user interaction.

onKeyDown handle user behavior.

sempet bingung kenapa ada insertNodes ada insertFragment?

Tried using v0.90 doesn't work.

store `editor.children` for the database.


>If you have used any text editing applications, you must've used undo or redo feature. We have the same feature in SlateJS. We know that you are not familiar with this feature in SlateJS yet, but can you spend about 10 to 15 minutes trying to find out how undo or redo feature work in Slate?

Documentation not clear
open repository, open source code.
Sometimes made patch to open source repository.

Immediately went to undo function in withHistory

explained the Batch object, along with the pointer.

looking for when the undo function is added?

`apply` adds the stuff into the undo or redo array.

explain the undo and redo pop and push.

explained what operation is.

Sort of explained the operation inverse part.

children only for rendering, so it's not for history.
