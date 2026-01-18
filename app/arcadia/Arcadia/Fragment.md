A fragment is one or more elements that can be re-used and synchronized anywhere.

this can be, but not limited to:
- Forms
- Sync containers.
- CMS

## Who has this problem?

Anyone who's using the features above.
- CoachIQ

The problem is that when you duplicate page, you don't move the data of sync containers and forms:
1. Forms will go missing, it will become empty form block (`Connect Form` empty form)
2. Sync container will go unlinked.


## Fragments sizing

Fragment root property that exist in the page will override the base fragment (the one stored in the db).

For example, imagine form like:
```javascript
const formA = {
	type: 'form',
	width: 500,
	height: 700,
	children: [...]
	form_id: 'form-reference-id'
}
```

is stored on `space.customization` or wherever this may be.

Imagine a scenario where `formA` gets loaded into a page in the editor.

```javascript
const pageValue = [
	{
		type: 'root',
		children: [
			{...formA},
		]
	}
]
```

But imagine that we resize this form inside the page, so that the width and/or height is different

```javascript
const pageValue = [
	{
		type: 'root',
		children: [
			{
				...formA,
				height: 200,
				width: 700,
			},
		]
	}
]
```

What will get rendered on the final page? **The height/width inside the page will be chosen**
The properties set in the page editor takes precedence over fragment's properties


### Problem 1: sync containers, forms, and CMS are not duplicated properly when we duplicate the templates.

Iteratively:
1. Make some notices that, if this page has `form` or `collection` or `sync_container`, we might want to set up a UX for it to let the user manually setup the form.
2. Automate the form generation. (check the page content first, then define what needs to be done)

##### May 25th note on Problem 1
We're manually duplicating each form that exists on each of the duplicated page. The PRs:
1. Related to sync containers (https://github.com/typedreamhq/api/pull/294) This sets up the common abstraction around iterating and mutating page content.
2. Related to duplicating form ( https://github.com/typedreamhq/api/pull/295) I still think there can be improvements in this part, I don't particularly like how I need to create a similar-ish logic on duplicating section template in the frontend (TBD).

**Internal link**
We need to handle these cases:
1. Copying a single page that has internal link to other pages.
	1. What should we do in this case? Should we remove the link? or make it an external link?
		1. We should remove those links in this case (will need discussion with Putri)
2. Copying a page with sub pages.
	1. Should we detect whether there is an internal link to the sub pages? like wise if there's internal link from sub page to parent page? Should we represent these in a graph, then recreate the graph in the newly generated pages?
	2. For other links that's not included in the pages, we follow (1).1

I think I should handle case 2 first, as (2).1 and (1).1 handle the exact same case. So if (2) contains (1), resolving (2) means resolving (1) too.



