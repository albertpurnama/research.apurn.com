[[Ibe - 1 on 1]]


#### Feedback Queue
- Caught an edge case on the navbar part. Specifically if there is a navbar on the space customization, and if there is a navbar from page content
- 

-----


# Phone Interview

**Ruangguru**
- Internal tools
	- last 3 months
- Toko crypto
	- 2018 - 2022
	- Mobile using react native.

From working at medleys, what have you learned?
- Wanted to go into web3.
- Never worked in a project before
	- Reksadana crypto
- Learned UI/UX design
	- Complex UI/UX design
		- X-state machine for the state.
		- Layouting

Devi friend of Ferdy referred Ibe

**Why is it taking a long time to build MVP?**
- Harus ulang dari awal.
- Ga banyak interaksi, no communication

**Cannot full-time, because:**
- Design system in ruangguru.
- Plasmic-generated code can be maintained.
	- Figma -> Plasmic -> Frontend

**Finished Design System**
- Early next year

**Part time working 8PM - 1AM/2AM**

- There's no interesting job after the design system



**Worked at a startup?**

**Any challenges on working on a team? If so, explain to us**

**Have you been training someone else**

**Why are you interested in Typedream?**

**Why do you want to move from your current position?**

**Do you have any suggestions (product, etc.) that you can help implement if you get the opportunity to work with Typedream?**

**What do you want to learn from Typedream?**

**Where do you see yourself 5 years from now**



### Any Questions:
- Getting into a new team daunting
- Kenapa bikin Typedream.

#### Salary Expectation
Part-time: Rp 11-12 mio.
Full-time: Rp 20an mio.

- 22 mio Gross.

March 2023

## Technical

[https://github.com/ibedwi/playground-slate](https://github.com/ibedwi/playground-slate)


>From your take home project, you were tasked to make some custom components using SlateJS. Can you go through your code and tell us briefly what each part of your component do?

Yang dimanipulasi dari editor nya itu element node.
nodes can add properties, in the beginning only children!
Type changes the block type.
To use typescript with Slate properly, re-define/extend slate module.
Explained Editable, understand div contentEditable.
renderLeaf -> text node
renderElement -> renderElement defines a lot of other elements not text element.

>If you have used any text editing applications, you must've used undo or redo feature. We have the same feature in SlateJS. We know that you are not familiar with this feature in SlateJS yet, but can you spend about 10 to 15 minutes trying to find out how undo or redo feature work in Slate?


- Tried to add withHistory to project.
- Found the code. looked at withHistory.
	- Stack of operations stored in editor.
	- Undo removes the stack.
	- Operation removed is added to the redo stack.

Good.
