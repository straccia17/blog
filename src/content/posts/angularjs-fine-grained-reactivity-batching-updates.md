---
title: 'From Angular.js to Fine-Grained Reactivity: Part 3 — How to Optimize the Render Phase'
published: 2026-07-29
description: 'Batching reactive scope mutations with microtasks to avoid redundant template updates and visual flicker.'
author: 'Carlo Straccialini'
series: 'From Angular.js to Fine-Grained Reactivity'
tags: ['javascript', 'angularjs', 'reactivity', 'performance']
---

In the last [article](/posts/angularjs-fine-grained-reactivity-proxy-runtime) of this series, we saw how to use the Proxy API to notify changes to the templates. For example, this controller:

```javascript
// simple-controller.js
export function SimpleController($scope) {
    $scope.name = "Mario";
}
```

produces a change like this:

```javascript
let changes = {
    name: "Mario",
};

update(changes);
```

Suppose now that we have a controller with multiple assignments:

```javascript
// simple-controller.js
export function SimpleController($scope) {
    $scope.name = "Mario";
    $scope.age = 24;
}
```

This snippet triggers multiple `update` calls because each individual assignment produces a new change:

```javascript
let changes = {
    name: "Mario",
};

update(changes);

changes = {
    age: 24,
};

update(changes);
```

In a real-world controller, there are many more scope assignments than we've seen in this simple example. If we consider a real enterprise app, we could have dozens of controller executions, with multiple assignments for each of them.

---

Another common problem we might encounter is multiple assignments to the same property; this can lead to a flickering effect on the rendered view.

```javascript
// simple-controller.js
export function SimpleController($scope) {
    $scope.name = "Mario";

    // Age computation can last up to 100ms
    const age = computeAge();

    $scope.name = `${$scope.name} ${age}`;
}
```

Let me explain how it works.

The first assignment `$scope.name = "Mario"` produces a change that immediately calls the `update` function from the template, so the view is updated. For a fraction of a second, the current user sees the string "Mario" on the screen.

After some time, due to the computation time of the `age` variable, the second assignment `$scope.name = \`${$scope.name}${age}\`;` is executed. This second call to the same `update` function causes a redraw of the browser window so the user can finally see "Mario 24" (assuming the result of `computeAge()` is 24).

Depending on that computation time, the user might actually see this visual flickering, making it a real risk for the user experience.

## Solution: Queueing Mutations via Microtasks

An elegant solution to this problem comes from the event loop and the microtask queue.

I'm sure that many of you are familiar with concepts like Promises, `setTimeout`, `setInterval`, and async JavaScript in general. And obviously, you also know the "magic" event loop and how it works. But microtasks? What are they?

A microtask is a function that runs after the calling function has returned, but before the event loop moves to the next tick and checks its macrotask queue. In particular, in a browser environment, it runs before the view is updated with the new values.

To learn more about microtasks, you can study this [article](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) on the MDN docs.

To solve the problem of multiple mutations, we can simply merge all the changes before calling the `update` function. In the next section, you can see a simple implementation of these two concepts.

## Building the Batching Engine

```javascript
let pendingChanges = {};
let isScheduled = false;

function scheduleUpdate(change, updateFn) {
    // Merge changes (overwriting previous values for the same key -> solves flickering!)
    Object.assign(pendingChanges, change);

    if (!isScheduled) {
        isScheduled = true;
        queueMicrotask(() => {
            updateFn(pendingChanges);
            pendingChanges = {};
            isScheduled = false;
        });
    }
}
```

Our proxies must now call this new `scheduleUpdate` method instead of calling the `update` function directly when they intercept a `set` operation.

`Object.assign` solves the problem of multiple mutations to the same key because it always overwrites the global `pendingChanges` object with the latest change. Then, a microtask that will eventually call the real `update` function is enqueued.

The `isScheduled` variable acts as a guard to avoid enqueuing multiple redundant microtasks with an empty `pendingChanges` object.

## Conclusion & What's Next

We have just solved the problem of multiple mutations within the same controller execution, so does everything work perfectly now? Not quite... if you think about it for a minute, you might guess our next challenge.

What happens with `$scope.person.name = 'Mario'`? Until now, we only support changes on top-level properties, but here we are updating a nested property. We will encounter the exact same problem with arrays.

In the next article, we'll dive into how to track, solve, and notify this kind of deep changes.

---

*Thanks for reading! I’m a Frontend Architect passionate about compilers, reactivity, and performance. Let's connect on [LinkedIn](https://www.linkedin.com/in/carlostraccialini/) to stay updated with the next parts of this journey.*
