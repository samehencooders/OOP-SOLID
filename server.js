const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db-1.json');
const middlewares = jsonServer.defaults();
const routes = require('./routes.json');

// Set up middleware
server.use(middlewares);

// Add CORS headers if needed
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Rewrite routes
server.use(jsonServer.rewriter(routes));

// Custom behavior before responses
router.render = (req, res) => {
  if (req.method === 'GET' && req.url.includes('/user-data')) {
    // You can modify the response here
    res.jsonp(res.locals.data);
  } else {
    res.jsonp(res.locals.data);
  }
};

// Use the router
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`- http://localhost:${PORT}/api/gamification/user-data`);
  console.log(`- http://localhost:${PORT}/api/gamification/system`);
});