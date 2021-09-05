const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { projects } = require('./data.json')

app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.locals.data = projects;
   res.render('index');
});

app.get('/about', (req, res) => {
   res.render('about');
});

const getProjectData = projectId => projects[projectId];

app.get('/project/:id', (req, res) => {
   const { id } = req.params,
   projectData = getProjectData(id);
   res.render('project', { projectData });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});
