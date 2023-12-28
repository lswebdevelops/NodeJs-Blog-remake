// In your routeHelpers.js file
const isActiveRoute = (targetRoute, currentRoute) => {
    return targetRoute === currentRoute ? 'active' : '';
  };
  
  module.exports = isActiveRoute;
  