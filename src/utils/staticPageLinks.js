const INTERNAL_STATIC_PAGE_ROUTES = {
    '/division-de-gastos': 'division_de_gastos',
    '/verificacion-cuenta': 'verificacion_cuenta'
};

export function bindInternalStaticPageLinks(container, router) {
    if (!container || !router) {
        return;
    }

    container.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        const routeName = INTERNAL_STATIC_PAGE_ROUTES[href];
        if (!routeName) {
            return;
        }

        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            router.push({ name: routeName });
        });
    });
}
