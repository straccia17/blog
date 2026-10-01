---
title: 'React vs. Our Fine-Grained Runtime: Two Different Rendering Models'
published: 2026-10-01
description: 'How React rendering and reconciliation differ from our compiler-driven, fine-grained approach to updating the DOM.'
author: 'Carlo Straccialini'
series: 'From Angular.js to Fine-Grained Reactivity'
tags: ['javascript', 'react', 'reactivity', 'compilers', 'performance']
---

Before continuing our series on fine-grained reactivity, let's take a closer look at how our approach differs from React's.

This is not a general comparison of the two technologies. We will focus on one question: **what happens between a state change and a DOM update?** Features such as routing, data fetching, server rendering, and the wider ecosystem are outside the scope of this article.

## How React Updates the UI

[React](https://react.dev/) is a library for building user interfaces from components. A component combines rendering logic with markup and can hold state that changes over time.

Here is a simple counter:

```jsx
import { useState } from 'react'

export default function ButtonCounter() {
  const [count, setCount] = useState(0)

  const handleClick = () => setCount((current) => current + 1)

  return (
    <>
      <button onClick={handleClick}>Add 1</button>
      <p>Count: {count}</p>
    </>
  )
}
```

Two foundational React concepts appear in this example:

- **JSX** is a JavaScript syntax extension that lets us write HTML-like markup inside a component.

- **State** lets a component retain data between renders. Calling the `setCount` function queues another render with the new value.

Assigning directly to `count` would neither persist the change nor notify React. State must be updated through its setter.

## Render and Commit

React describes a screen update in three steps: trigger, render, and commit. In our example, the flow looks like this:

1. React performs the initial render by calling `ButtonCounter` to determine what should appear on screen.

2. React commits the result by creating the required DOM nodes.

3. When the user clicks the button, `setCount` queues another render.

4. React calls `ButtonCounter` again and calculates what has changed since the previous render.

5. During the commit phase, React applies only the necessary DOM operations—in this case, updating the text inside the paragraph.

The important distinction is that the **render phase calculates what the UI should look like**, while the **commit phase applies the required changes to the DOM**. React's [Render and Commit guide](https://react.dev/learn/render-and-commit) explains this process in more detail.

Rendering a component does not necessarily mean changing the DOM. Consider this variation:

```jsx
import { useState } from 'react'

export default function ButtonCounter() {
  const [, setCount] = useState(0)

  const handleClick = () => setCount((current) => current + 1)

  return <button onClick={handleClick}>Add 1</button>
}
```

The state still changes after every click, so React renders the component again. However, the returned JSX does not depend on that state. React finds no change that needs to be committed, so it leaves the DOM untouched.

React has several ways to avoid unnecessary work, and its implementation is considerably more sophisticated than this short overview. The key point for this comparison is its default update model: a state update triggers rendering so React can determine whether the UI must change.

## How Our Runtime Differs

Our approach moves much of that discovery work to build time. The compiler analyzes each template, identifies its dynamic expressions, and generates the exact DOM operations needed to update them.

For a template like this:

```html
<p>Hello {{ name }}!</p>
```

the generated update function already knows that a change to `name` affects one specific text node:

```javascript
update(change) {
    if ('name' in change) {
        textNode.data = 'Hello ' + change.name + '!';
    }
}
```

At runtime, our reactive layer connects a state mutation to this generated function. It does not need to re-execute the whole component or compare two representations of its output to discover which DOM operation is required; the compiler has already established that relationship.

The two models can be summarized like this:

| React                                                 | Our fine-grained runtime                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| A state update queues a render                        | A state mutation identifies its dependants                         |
| Rendering calculates the changes required             | The compiler generates the relevant update operation at build time |
| The commit phase applies the necessary DOM operations | The runtime calls the generated DOM operation directly             |

This approach can reduce runtime work because it does not need to re-execute component render functions and reconcile their latest output to discover DOM changes. The trade-off is that our compiler and runtime must correctly handle dependency tracking, nested data, control flow, lifecycle behavior, and every template feature we support. React solves a much broader and more general problem.

## Conclusion

This comparison is not an argument that React is bad or that nobody should use it. React has a mature ecosystem, a capable team and community, and years of production experience behind it. Its rendering model also enables features and scheduling strategies that are beyond the scope of this article.

Our constraints led us to make a different trade-off: analyze legacy templates ahead of time, build a dependency graph, and update only the DOM nodes affected by a mutation. That design helps us modernize a large Angular.js codebase without rewriting all of its templates and controllers.

As described in the [first article in this series](/posts/angularjs-fine-grained-reactivity-compiling-templates), this work is inspired mainly by [Solid's fine-grained reactivity](https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity) and [Svelte's compiler-based approach](https://svelte.dev/).

In the next article, I will explain why we chose this architecture and which constraints made it a good fit for our company.

---
