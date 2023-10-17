import routes from './routes.js';

class Router {
  constructor(routes) {
    this.routes = routes;
    this.routerOutletEl = document.querySelector('[data-router-outlet]');
    this._loadInitialRoute();

    window.addEventListener('popstate', this._handlePopstate.bind(this));
  }

  loadRoute(pathname, queryString) {
    const path = queryString ? `${pathname}?${queryString}` : pathname;
    this._navigateToPath(path);
  }

  _navigateToPath(path) {
    history.pushState({}, '', path);
    this._handleRouting(window.location.pathname);
    window.scrollTo(0, 0);
    document.dispatchEvent(new Event('routeChange'));
  }

  _handlePopstate() {
    this._handleRouting(window.location.pathname);
    document.dispatchEvent(new Event('routeChange'));
  }

  _handleRouting(pathname) {
    const { matchedRoute, params } = this._matchPathToRoute(pathname);
    this._renderRoute(matchedRoute, params);
  }

  _matchPathToRoute(pathname) {
    let params = {};
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

  _renderRoute(matchedRoute, params) {
    this.routerOutletEl.innerHTML = matchedRoute
      ? matchedRoute.get(params)
      : '<h1>404 - Not Found</h1>';
    window.scrollTo(0, 0);
  }

  _loadInitialRoute() {
    this._handleRouting(window.location.pathname);
    document.dispatchEvent(new Event('routeChange'));
  }
}

export const router = new Router(routes);
