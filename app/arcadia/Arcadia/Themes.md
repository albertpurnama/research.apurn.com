- [[#Variables|Variables]]
- [[#Features|Features]]
- [[#Where do we store it?|Where do we store it?]]
- [[#How do we load it?|How do we load it?]]


**Case 1**: Button A with default theme color.
```javascript
{
	color: 
}
```

**Case 2:** Button A with specific color (non-themed color)
for example, user specifically want the color to be #111, but it's not defined in the color pallette

**Case 3:** Button A with themed color that's different from default color
For example, we want primary button style but secondary colors. *Is there even a specific case for something like this?*

**Dark mode vs Light mode**

Every theme should always have dark mode vs light mode theme values.


1. How do you override the theme to user configured value?
		For example, if button.primary.text  is set to var(--text-lighter) in the theme and then user set a specific button's color into #000 instead of the default value, what happens here?
2. 
3. 


### Variables

--primary-text
--secondary-text
--primary-button-background
--primary-button-text
--secondary-button-background

--navigation-background
--navigation-text


Theme colors are mapped to block type, For text (leaf): it's mapped to its block type (heading or paragraph) and its font style (subtitle, small text, etc)


### Features

- Preview of the page in the custom theme color popup
- Generate color pallete.
- Combination from squarespace.

### Where do we store it?

in `space.customization`

### How do we load it?

Somehow load it in renderer?


Resources on CSS framework
https://ui.shadcn.com/docs/theming
https://cva.style/docs/getting-started/variants
https://tailwindcss.com/

The plan is to try to use tailwind + cva for our styling system

