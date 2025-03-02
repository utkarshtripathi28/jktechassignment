const path = require("path");

function getPathFromRegex(regexp) {
  return regexp.toString().replace("/^", "").replace("?(?=\\/|$)/i", "").replace(/\\\//g, "/");
}

function combineStacks(acc, stack) {
  if (stack.handle.stack) {
    const routerPath = getPathFromRegex(stack.regexp);
    return [...acc, ...stack.handle.stack.map((stack) => ({ routerPath, ...stack }))];
  }
  return [...acc, stack];
}

function getStacks(app) {
  // Express 3
  if (app.routes) {
    // convert to express 4
    return Object.keys(app.routes)
      .reduce((acc, method) => [...acc, ...app.routes[method]], [])
      .map((route) => ({ route: { stack: [route] } }));
  }

  // Express 4
  if (app._router && app._router.stack) {
    return app._router.stack.reduce(combineStacks, []);
  }

  // Express 4 Router
  if (app.stack) {
    return app.stack.reduce(combineStacks, []);
  }

  // Express 5
  if (app.router && app.router.stack) {
    return app.router.stack.reduce(combineStacks, []);
  }

  return [];
}

module.exports = function expressListRoutes(app, opts) {
  const stacks = getStacks(app);
  let stackArray = [];
  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        for (const route of stack.route.stack) {
          stackArray.push(stack.routerPath + "" + stack.route.path.split("/")[1]);
        }
      }
    }
  }
  return stackArray;
};
