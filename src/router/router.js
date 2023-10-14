export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.routerOutletEl = document.querySelector('[data-router-outlet]');
    this._loadInitialRoute();

    window.addEventListener('popstate', this._handlePopstate.bind(this));
  }

  loadRoute(...pathSegments) {
    const pathname = `${pathSegments.join('/')}`;
    history.pushState({}, '', pathname);
    this._handleRouting(pathname);
  }

  _handlePopstate() {
    const pathname = window.location.pathname;
    this._handleRouting(pathname);
  }

  _handleRouting(pathname) {
    const { matchedRoute, params } = this._matchPathToRoute(pathname);

    this.routerOutletEl.innerHTML = matchedRoute
      ? matchedRoute.get(params)
      : '<h1>404 - Not Found</h1>';
  }

  _matchPathToRoute(pathname) {
    let params = {}; // !: hack to be returned
    const matchedRoute = this.routes.find((route) => {
      const regex = new RegExp(`^${route.path.replace(/:\w+/g, '([^/]+)')}$`);
      const matches = pathname.match(regex);
      if (matches) {
        const keys = route.path.match(/:(\w+)/g) || [];
        params = keys.reduce((acc, key, index) => {
          acc[key.replace(':', '')] = decodeURIComponent(matches[index + 1]);
          return acc;
        }, {});

        return { ...route, params };
      }
      return false;
    });

    return { matchedRoute, params };
  }

  _loadInitialRoute() {
    const pathname = window.location.pathname;
    this._handleRouting(pathname);
  }
}
