const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { projects } = require('./data.json')

// Set template to pug
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.locals.data = projects;
   res.render('index');
});

app.get('/about', (req, res) => {
   res.render('about');
});

// helper method for retrieving selected project data
const getProjectData = projectId => projects[projectId];

app.get('/project/:id', (req, res) => {
   const { id } = req.params,
   projectData = getProjectData(id);
   if (projectData) {
      res.render('project', { projectData });
   } else {
      const err = new Error();
      err.status = 404;
      err.message = `You chose a project that doesn't exist (yet)`;
      res.render('page-not-found', { err })
   }
});

/* Used for testing potential server errors */
app.use('/error', (req, res, next) => {
   const err = new Error();
   err.status = 500;
   err.message = `There's an issue on our end`;
   next(err);
});

/* 404 Error Handler for non-existent routes */
app.use((req, res, next) => {
   const err = new Error(`It's 2021... that doesn't exist yet`)
   res.status(404).render('page-not-found', { err });
});

/* Global Error Handler */
app.use((err, req, res, next) => {
   if (err.status === 404) {
      res.status(err.status).render('not-found', { err });
   } else {
      err.message = err.message || 'Whoops... looks like an issue on the server';
      res.status(err.status || 500).render('server', { err });
   }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});
