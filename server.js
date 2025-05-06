// // server.js
// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('mock-database.json');
// const middlewares = jsonServer.defaults();

// server.use(middlewares);

// // Custom routes for AI endpoints
// server.get('/ai/predict-completion/:taskId', (req, res) => {
//   const taskId = req.params.taskId;
//   const db = router.db;
//   const prediction = db.get('ai.taskPredictions').get(taskId).value();
//   res.jsonp(prediction || { 
//     predictedDays: Math.floor(Math.random() * 10) + 1,
//     confidence: Math.floor(Math.random() * 30) + 60,
//     factors: [
//       { factor: "AI generated prediction", impact: 0 }
//     ]
//   });
// });

// server.get('/ai/analyze-risk/:taskId', (req, res) => {
//   const taskId = req.params.taskId;
//   const db = router.db;
//   const analysis = db.get('ai.riskAnalysis').get(taskId).value();
//   res.jsonp(analysis || {
//     riskScore: Math.floor(Math.random() * 100),
//     factors: [
//       { 
//         factor: "AI generated risk factor", 
//         impact: Math.floor(Math.random() * 10),
//         description: "This is an automatically generated risk factor"
//       }
//     ],
//     mitigationSuggestions: ["Consider reviewing this task carefully"]
//   });
// });

// server.get('/ai/generate-checklist/:taskId', (req, res) => {
//   const taskId = req.params.taskId;
//   const db = router.db;
//   const checklist = db.get('ai.suggestedChecklists').get(taskId).value();
//   res.jsonp(checklist || [
//     { content: "Auto-generated checklist item 1", confidence: 90 },
//     { content: "Auto-generated checklist item 2", confidence: 85 }
//   ]);
// });

// server.get('/ai/analyze-bottlenecks/:workflowId', (req, res) => {
//   const workflowId = req.params.workflowId;
//   const db = router.db;
//   const bottlenecks = db.get('ai.bottleneckAnalysis').get(workflowId).value();
//   res.jsonp(bottlenecks || []);
// });

// server.get('/ai/suggest-wip-limits/:workflowId', (req, res) => {
//   const workflowId = req.params.workflowId;
//   const db = router.db;
//   const suggestions = db.get('ai.wipLimitSuggestions').get(workflowId).value();
//   res.jsonp(suggestions || {});
// });

// server.get('/ai/project-summary/:workflowId', (req, res) => {
//   const workflowId = req.params.workflowId;
//   const db = router.db;
//   const summary = db.get('ai.projectSummary').get(workflowId).value();
//   res.jsonp(summary || {
//     summary: "Auto-generated project summary",
//     keyMetrics: { averageCycleTime: 5, averageLeadTime: 8 },
//     risks: [{ description: "Auto-generated risk", severity: 5 }],
//     recommendations: ["Auto-generated recommendation"]
//   });
// });

// // Add custom routes for task service
// server.get('/tasks/workflow/:workflowId', (req, res) => {
//   const workflowId = req.params.workflowId;
//   const db = router.db;
//   const tasks = db.get('tasks').filter(task => {
//     // In a real scenario, you would filter by workflow ID
//     // For this mock, we'll just return all tasks
//     return true;
//   }).value();
//   res.jsonp(tasks);
// });

// server.patch('/tasks/:taskId/move', (req, res) => {
//   const taskId = req.params.taskId;
//   const { stageId } = req.body;
//   const db = router.db;
  
//   const task = db.get('tasks').find({ id: taskId }).value();
//   if (task) {
//     task.stageId = stageId;
//     task.updatedAt = new Date().toISOString();
    
//     // Update the task in the database
//     db.get('tasks').find({ id: taskId }).assign(task).write();
    
//     res.jsonp(task);
//   } else {
//     res.status(404).jsonp({ error: "Task not found" });
//   }
// });

// server.post('/tasks/:taskId/comments', (req, res) => {
//   const taskId = req.params.taskId;
//   const comment = req.body;
//   const db = router.db;
  
//   const task = db.get('tasks').find({ id: taskId }).value();
//   if (task) {
//     const newComment = {
//       id: `comment-${Date.now()}`,
//       createdAt: new Date().toISOString(),
//       ...comment
//     };
    
//     task.comments.push(newComment);
//     task.updatedAt = new Date().toISOString();
    
//     // Update the task in the database
//     db.get('tasks').find({ id: taskId }).assign(task).write();
    
//     res.jsonp(newComment);
//   } else {
//     res.status(404).jsonp({ error: "Task not found" });
//   }
// });

// server.put('/tasks/:taskId/checklists/:checklistId', (req, res) => {
//   const taskId = req.params.taskId;
//   const checklistId = req.params.checklistId;
//   const checklist = req.body;
//   const db = router.db;
  
//   const task = db.get('tasks').find({ id: taskId }).value();
//   if (task) {
//     const checklistIndex = task.checklists.findIndex(cl => cl.id === checklistId);
//     if (checklistIndex !== -1) {
//       task.checklists[checklistIndex] = {
//         ...task.checklists[checklistIndex],
//         ...checklist
//       };
//       task.updatedAt = new Date().toISOString();
      
//       // Update the task in the database
//       db.get('tasks').find({ id: taskId }).assign(task).write();
      
//       res.jsonp(task.checklists[checklistIndex]);
//     } else {
//       res.status(404).jsonp({ error: "Checklist not found" });
//     }
//   } else {
//     res.status(404).jsonp({ error: "Task not found" });
//   }
// });

// // Set default port to 3000 or use environment variable
// const port = process.env.PORT || 3000;

// server.use(router);
// server.listen(port, () => {
//   console.log(`JSON Server is running on port ${port}`);
// });
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-database.json'); // or 'db.json' depending on which file you want to use
const middlewares = jsonServer.defaults();

const port = 3000;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});