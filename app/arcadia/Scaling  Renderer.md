The problem:
We have so many components, the bundle size is large, and the JS that's passed through the browser is going to get bigger.

Assumptions:
1. More components (or block types) will result in higher JS files shipped to client's browser, which results in slower performance.

Experiments:
1. Try creating a simple NextJS project that does:
	1. From a JSON object, render multiple components that has different packages, make some of the packages use large javascript dependency
	2. From this structure, we need to structure the code/infra in such a way that:
		1. Each page that is server side rendered (that is each path) sends just enough javascript depending on the JSON object that we passed in as a prop to that page (getStaticProps)
