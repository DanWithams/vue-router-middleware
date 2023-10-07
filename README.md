# vue-router-middleware

## Example

Middleware can be defined somewhere sensible on the route object.

```javascript
    ...
    {
        name: 'my-route-auth-protected-route',
        path: '/my-route-auth-protected-route',
        middleware: [ auth ],
    },
    {
        name: 'my-route-guest-protected-route',
        path: '/my-route-guest-protected-route',
        middleware: [ guest ],
    },
    {
        name: 'my-route-auth-protected-route-with-permission',
        path: '/my-route-guest-protected-route',
        middleware: [ auth, can('view', 'users') ],
    },
    ...
````

Define the beforeEach guard on the router, and pass

```javascript
router.beforeEach(async (to, from) => { // Do not included 'next' argument
    
    const result = await MiddlewareResolver.create(to.middleware || [])
        .resolveAll(to, from);

    return result;
});
```
The middleware themselves must be callable. They can be functions or closures. They can optionally receive the to and from arguments.

They must return a valid return type for the router beforeEach guard, for example, a string of the path, or an object which works with route.push();

```javascript
// Function example
function auth() {
    const store = getUserStore(); // Get the data which determines the user login state
    
    if (store.isLoggedIn === false) {
        return { name: 'login-route-name' }; // Redirect
    }
    
    return true; // Continue to 'to' route 
}

// Closure example
function canView(model, permission) {
    return (to, from) => {
        const store = getUserPermissionsStore(); // Get the data which determines the users permissions
        if (store.can(model, permission)) {
            return from; // Returning from will route back;
        }
        return true; // Continue to 'to' route
    };
}
```