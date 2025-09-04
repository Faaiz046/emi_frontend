export class RouteParser {
  constructor() {
    this.routes = new Map();
    this.paramPattern = /:(\w+)/g;
  }

  // Register routes with their patterns
  register(path, component) {
    // Convert route pattern to regex
    const regexPattern = this.convertToRegex(path);
    this.routes.set(regexPattern, { path, component });
  }

  // Convert route pattern like "/user/:user_id" to regex
  convertToRegex(routePath) {
    const regexString = routePath
      .replace(this.paramPattern, '([^/]+)') // Replace :param with capture group
      .replace(/\//g, '\\/'); // Escape forward slashes
    
    return new RegExp(`^${regexString}$`);
  }

  // Match current path against registered routes
  match(currentPath) {
    for (const [regex, routeInfo] of this.routes) {
      const match = currentPath.match(regex);
      if (match) {
        const params = this.extractParams(routeInfo.path, match);
        return {
          component: routeInfo.component,
          params,
          path: routeInfo.path
        };
      }
    }
    return null;
  }

  // Extract parameter values from the match
  extractParams(routePath, match) {
    const params = {};
    const paramNames = [...routePath.matchAll(this.paramPattern)].map(m => m[1]);
    
    // Skip first match (full string), start from index 1
    paramNames.forEach((paramName, index) => {
      params[paramName] = match[index + 1];
    });
    
    return params;
  }
}
