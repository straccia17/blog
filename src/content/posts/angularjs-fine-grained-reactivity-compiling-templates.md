---
title: 'From Angular.js to Fine-Grained Reactivity: Compiling Templates at Build-Time'
published: 2026-06-30
description: 'How a build-time compiler can migrate legacy Angular.js templates to fine-grained reactivity without rewriting templates or controllers.'
author: 'Carlo Straccialini'
series: 'From Angular.js to Fine-Grained Reactivity'
tags: ['javascript', 'angularjs', 'compilers', 'reactivity', 'performance']
---

We are in 2026, but in some corners of the enterprise world, it still feels like 2014. One of those places is the frontend stack of my current company.

Over a decade ago, when we launched as a new digital retail bank in the Italian market, we had to choose our technology foundation. We adopted a third-party product—a widget container—that brought Angular.js along as its primary frontend framework.

Fast forward ten years: hundreds of banking features have been shipped, and our architecture has ballooned into a massive fleet of **about 450 Angular.js widgets**. Today, our codebase is colossal, making a traditional "rip-and-replace" migration look like an impossible mountain to climb.

Yet, staying still is no longer an option:

* **The Legacy Trap:** Critical external dependencies—including Angular.js itself—are no longer maintained, posing security and compliance risks.

* **Architecture Friction:** Integrating modern architectural patterns or modern design systems is extremely hard without adopting fragile workarounds (like heavy Web Component wrappers).

* **The Talent Crunch:** Hiring junior or mid-level developers has become an uphill battle. No one wants to build a career on a tech stack from 2012; the market speaks React, Vue, and modern Angular.

## Our Path

During the pandemic, our internal team took the first big step toward freedom: we completely ripped out the legacy third-party widget container and replaced it with a custom, in-house solution. With that constraint gone, the Angular.js lock-in was officially broken.

We faced two clear paths for the migration:

* **The Traditional Route:** Pick a modern framework, hire a massive IT consulting company, and spend millions of euros over a risky, 2-year rewrite—only to potentially find ourselves in the exact same legacy trap a decade from now.

* **The Engineer's Route:** Develop a custom solution internally, just as we successfully did for our widget container.

Driven by engineering pragmatism, **we chose the second path.** Inspired by the build-time philosophy of Svelte and the fine-grained reactivity of Solid.js, we decided to build a custom compiler. Our goal? Transform legacy Angular.js HTML templates into highly optimized, modern JS modules based on fine-grained reactivity—**without changing a single line of our existing template or controller files.**

## The Core Concepts

To understand how we achieved this, let's look at how Angular.js works under the hood.

```html
<!-- Template -->
<p>Hello {{ name }}!</p>
```

```javascript
// Controller
function SimpleController($scope) {
    $scope.name = "Mario";
}
```

At runtime, the framework parses the template, reads the `$scope` object, and replaces the dynamic variables to output vanilla HTML:

```html
<p>Hello Mario!</p>
```

This mechanism is driven by the Angular.js **Digest Cycle**. During this cycle, the framework evaluates all dynamic expressions (interpolations between `{{` and `}}`) and recomputes their values to check for changes.

Doing this at scale is an incredibly expensive operation. Because the browser doesn't natively know *which* specific part of the DOM needs an update, a single property change on a `$scope` can trigger a dirty-checking loop across the entire view.

## Shifting to Build-Time: What Can We Do?

Our golden constraint was strict: **do not touch the template or controller source code.** Starting from the exact same template:

```html
<!-- Template -->
<p>Hello {{ name }}!</p>
```

We built a custom template compiler (written in Go) that processes this HTML at build-time and outputs highly efficient, raw JavaScript:

```javascript
// Compiled JavaScript Output
function template() {
    const p_0 = document.createElement("p");
    const text_1 = document.createTextNode("");
    p_0.append(text_1);

    return {
        mount(container) {
            container.append(p_0);
        },
        update(change) {
            if ("name" in change) {
                text_1.data = "Hello " + change.name + "!";
            }
        }
    }
}
```

This compiled function returns an object with two lifecycle methods:

* `mount`: Used by our lightweight runtime to inject the element into the DOM container.

* `update`: The real heart of our framework. When a property changes, this function targets and mutates **one specific TextNode in the DOM**, surgically updating the UI.

The browser no longer needs to scan the entire page. Instead, the runtime immediately knows that when `name` changes, this exact `update` function must be invoked.

But how does the runtime intercept these changes without a digest cycle? This is where the modern **JavaScript Proxy API** comes into play—and that is exactly what we will explore in the next part of this series.

---

*Thanks for reading! I’m a Frontend Architect passionate about compilers, reactivity, and performance. Let's connect on [LinkedIn](https://www.linkedin.com/in/carlostraccialini/) to stay updated with the next parts of this journey.*
