**Tell me about yourself**
- Full time FE at Stockbit -> 3 years
	- 1 year 2 months
- 3rd company stockbit.

**At what size of the company X did you first join?**
- 30 people.
- Include mobile engineer.

**What do you like about joining the team at that size?**
7 people in the first company. 4 engineers.
Moved from this company because of new opportunity in new field.
Want to have the experience in bigger team

For bigger company:
- If you have something to do/say, the process is longer.

Smaller company:
- Communication is easier

**What do you not like about it?**


**Any challenges on working on a team? If so, explain to us**


**Have you been training someone else**


**Have you worked at a small-scale startup before?**


**Are you comfortable with unstructured work?**


**Why are you interested in Typedream?**
- Global scale company
- Make easier tool for other people.

**Why do you want to move from your current position?**
- No pressure to move away from stockbit.

**Do you have any suggestions (product, etc.) that you can help implement if you get the opportunity to work with Typedream?**


**What do you want to learn from Typedream?**


**Where do you see yourself 5 years from now**
- more managerial.
- not FE anymore.

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


**Anything you want me to know that we haven't discussed yet**


**Salary expectation**
- Rp 20 - 21 million now
- Rp 27 - 29 million

Untuk pindah ada resiko nya, karena gak ada push factor.

### Technical

>From your take home project, you were tasked to make some custom components using SlateJS. Can you go through your code and tell us briefly what each part of your component do?

SlateJS Editable
renderElement
	- Element tertentu rendernya gimana
	- 

renderLeaf
- Inline custom?
- Kurang lebih sama dengan yang di renderelement?

Trying to set leaf bold. 
```
{text: 'lalala', leaf: {bold: ???}}
```

Trying to find what the property is.

```
[
	{text: "some", leaf: {bold: true}}
	{text: "bold", leaf: {bold: true}}
	{text: "text", leaf: {bold: true}}
]
```


>If you have used any text editing applications, you must've used undo or redo feature. We have the same feature in SlateJS. We know that you are not familiar with this feature in SlateJS yet, but can you spend about 10 to 15 minutes trying to find out how undo or redo feature work in Slate?

search for "undo"
found withHistory docs, not the gthub tho  8.08
found withHistory github 8.09
search for issues on `withHistory`

pake history buat track state di dlm editornya.

mesti disuruh jelasin dulu pake source code nya.

- save in an array(?)

Setiap save bakal remove dari history?
nge-reverse dari node history yang disimpen.
doesn't really explain what reverse is, and says that the undos is just the state of the editor.



