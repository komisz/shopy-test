export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.routerOutletEl = document.querySelector('[data-router-outlet]');

    this._loadInitialRoute();

    window.addEventListener('popstate', this._handlePopstate.bind(this));
  }

  loadRoute(...pathSegments) {
    const pathname = `/${pathSegments.join('/')}`;
    history.pushState({}, '', pathname);

    const matchedRoute = this._matchPathToRoute(pathSegments);
    this.routerOutletEl.innerHTML = this._getRouteTemplate(matchedRoute);
  }

  // ?: 🧹 in-case of cleanup needed
  // removeEventListeners() {
  //   window.removeEventListener('popstate', this._handlePopstate.bind(this));
  // }

  _matchPathToRoute(pathSegments) {
    for (const route of this.routes) {
      const routePathSegments = route.path.split('/').slice(1);

      if (routePathSegments.length !== pathSegments.length) {
        continue;
      }

      const routeParams = {};

      const isMatch = routePathSegments.every((segment, i) => {
        if (segment[0] === ':') {
          const paramName = segment.slice(1);
          routeParams[paramName] = decodeURIComponent(pathSegments[i]);
          return true;
        }
        return segment === pathSegments[i];
      });

      if (isMatch) {
        return { ...route, params: routeParams };
      }
    }

    //? 💡 no route found
    return null;
  }

  _getPathSegments() {
    const pathname = window.location.pathname;
    return pathname ? pathname.split('/').slice(1) : [];
  }

  _handlePopstate() {
    const pathSegments = this._getPathSegments();
    const matchedRoute = this._matchPathToRoute(pathSegments);

    this.routerOutletEl.innerHTML = this._getRouteTemplate(matchedRoute);
  }

  _loadInitialRoute() {
    this.loadRoute(...this._getPathSegments());
  }

  _getRouteTemplate(route) {
    let template;

    if (route && route.get) {
      template = route.get(route.params);
    } else {
      //? 💡 hardcoded 404 template from routes.js
      template = this.routes[this.routes.length - 1].get();
    }

    return template;
  }
}
