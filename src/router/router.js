export default class Router {
  constructor(routes) {
    this.routes = routes;
    this._loadInitialRoute();
  }

  loadRoute(...urlParts) {
    const matchedRoute = this._matchUrlToRoute(urlParts);

    const url = `/${urlParts.join('/')}`;
    history.pushState({}, '', url);

    const routerOutletElement = document.querySelectorAll(
      '[data-router-outlet]'
    )[0];

    if (matchedRoute.path) {
      routerOutletElement.innerHTML = matchedRoute.getTemplate(
        matchedRoute.params
      );
    } else {
      routerOutletElement.innerHTML =
        this.routes[this.routes.length - 1].getTemplate();
    }
  }

  _matchUrlToRoute(urlSegments) {
    const routeParams = {};
    const matchedRoute = this.routes.find((route) => {
      const routePathSegments = route.path.split('/').slice(1);

      if (routePathSegments.length !== urlSegments.length) {
        return false;
      }

      const match = routePathSegments.every(
        (routePathSegment, i) =>
          routePathSegment === urlSegments[i] || routePathSegment[0] === ':'
      );

      if (match) {
        routePathSegments.forEach((segment, i) => {
          if (segment[0] === ':') {
            const propName = segment.slice(1);
            routeParams[propName] = decodeURIComponent(urlSegments[i]);
          }
        });
      }
      return match;
    });

    return { ...matchedRoute, params: routeParams };
  }

  _loadInitialRoute() {
    const splittedPath = window.location.pathname.split('/');
    const pathParts = splittedPath.length > 1 ? splittedPath.slice(1) : '';

    this.loadRoute(...pathParts);
  }
}
