/**
 * List of routes that should bypass JWT authentication.
 * Used with middleware like `jwtParser.unless({ path: jwtExcludedRoutes })`
 */

const jwtExcludedRoutes = [

  { url: "/login", methods: ["POST"] },

  { url: "/admin", methods: ["POST"] },

  { url: "/plant-reading", methods: ["GET"] },
];

export default jwtExcludedRoutes;