FLAN-T5 better than davinci when you fine tuneinci when you fine tune
Google scholar to read papers
Multi call to open ai to generate the multiple sec

-----

Getting data from websites:
1. Get HTML
2. Fetch the contents of all the scripts and styles.
3. Inline them into the HTML
4. Output the html file.


Game plan:
1. Generate a simple site that serves HTML, CSS and javascript to render a button on runtime.
2. Create a script to get data from (1) and do step 1-4 on Getting data from websites.

Try out generating AST from https://github.com/robertkrimen/otto#parser

Track anything that uses document (either by calling operations on it, accessing properties, etc), remove everything else

--------

Stream data
https://rob-blackbourn.medium.com/beyond-eventsource-streaming-fetch-with-readablestream-5765c7de21a1

-----

Slash command is important! Need to maintain the flow of doing slash command

Add different command types. or maybe everything is a command, but they all have different functions, some add blocks, some execute callbacks?

/generate will show popup.

/generate -> slash command is pretty difficult because AI blocks isn't technically a block, it's just a trigger for the popup to show up that will ask user for info.



### Implementation details

There need to be a function that is exported from `dream-editor` specifically to handle automated insertion using browser events. Interface something like:

``` javascript
const editorWriter = (character: string, options: {at: Path}): void => {
  // handles creating browser event.
}
```

This function is attached to the `editor` reference.

```javascript

// inside PlateProvider somewhere
const useEditorWriter = () => {
	// fetches editor cos you need it to refer to the root element
	const e = useTPlateEditorRef()

	const domNode = toDOMNode(e);

	// define writer
	const writer = (character: string, options: {at: Path}) => {
		// create browser event
		// dispatch event to the root slate element dom node.
		
		return;
	}  
	returns writer; // interface defined as above
}

```



### Findings

When you dispatchElement to inside the editor, it says:

>DOMException: Blocked a frame with origin "http://localhost:3000" from accessing a cross-origin frame.

But in production mode it does not show this.

### /dream

Every plugin should be a command

**What do we call when we select from the slash command?**
