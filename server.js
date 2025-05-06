// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-database.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom routes for AI endpoints
server.get('/ai/predict-completion/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const prediction = router.db.get('ai.taskPredictions').get(taskId).value();
  res.jsonp(prediction || { 
    predictedDays: Math.floor(Math.random() * 10) + 1,
    confidence: Math.floor(Math.random() * 30) + 60,
    factors: [
      { factor: "AI generated prediction", impact: 0 }
    ]
  });
});

server.get('/ai/analyze-risk/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const analysis = router.db.get('ai.riskAnalysis').get(taskId).value();
  res.jsonp(analysis || {
    riskScore: Math.floor(Math.random() * 100),
    factors: [
      { 
        factor: "AI generated risk factor", 
        impact: Math.floor(Math.random() * 10),
        description: "This is an automatically generated risk factor"
      }
    ],
    mitigationSuggestions: ["Consider reviewing this task carefully"]
  });
});

// Add more custom AI endpoints as needed

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});