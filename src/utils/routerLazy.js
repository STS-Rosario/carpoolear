/**
 * Lazy-load Vue Router to avoid circular dependency
 * (stores → router → routes → components → stores).
 * `getLazyRouter()` returns a Promise — do not chain `.push` / `.go` on it without awaiting.
 */
let _router;

export async function getLazyRouter() {
    if (!_router) {
        const routerModule = await import('../router');
        _router = routerModule.default;
    }
    return _router;
}

export function lazyRouterPush(location) {
    return getLazyRouter().then((r) => r.push(location));
}

/** Fire-and-forget navigation; swallows rejection (e.g. duplicate navigation). */
export function fireLazyRouterPush(location) {
    lazyRouterPush(location).catch(() => {});
}
