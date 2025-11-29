var jwtExcludedRoutes = [{
  url: "/login",
  methods: ["POST"]
}, {
  url: "/reset/email",
  methods: ["POST"]
}, {
  url: "/reset/check",
  methods: ["POST"]
}, {
  url: "/reset/update",
  methods: ["PUT"]
}, {
  url: "/supervisor",
  methods: ["POST"]
}, {
  url: "/invite-user",
  methods: ["POST"]
}, {
  url: "/validate-referral",
  method: ["POST"]
}, {
  url: "/sign-up",
  method: ["PUT"]
}, // { url: "/product", methods: ["POST"] },
// { url: "/admin", methods: ["POST"] },
{
  url: "/users",
  methods: ["GET"]
}, // { url: "/user", methods: ["POST"] },
// { url: "/coming-up", methods: ["GET"] },
{
  url: "/order",
  methods: ["POST"]
}, // { url: "/order", methods: ["PUT"] },
{
  url: "/support-ticket",
  methods: ["POST"]
}, {
  url: "/support-ticket",
  methods: ["PUT"]
}, {
  url: /\/invoices\/(.)/,
  methods: ['POST']
}, {
  url: /\/invoices\/(.)/,
  methods: ['GET']
}, {
  url: "/invoices",
  methods: ['GET']
}, {
  url: "/invoice",
  methods: ['POST']
}, {
  url: "/invoice",
  methods: ['PUT']
}, {
  url: "/webhook/ahlstrom",
  methods: ["POST"]
}, {
  url: "/webhook/penrith",
  methods: ["POST"]
}, {
  url: "/public/bags",
  methods: ['GET']
}, {
  url: "/sites",
  methods: ['GET']
}, {
  url: "/site",
  methods: ["POST"]
}, {
  url: /\/charcode\/( .)/,
  methods: ['GET']
}, {
  url: "/charcodes",
  methods: ['PUT']
}, {
  url: "/bags",
  methods: ['GET']
}, {
  url: "/reports/weekly",
  methods: ['POST']
}, {
  url: "/plans",
  methods: ['POST']
}, {
  url: "/plans",
  methods: ['PUT']
}, {
  url: "/plans",
  methods: ['DELETE']
} // { url: "/bags", methods: ['DELETE']},
];
export default jwtExcludedRoutes;