const express = require('express')
const router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
    models.Project.findAll({
        where: {user_id: req.session.username}
    }).then((projects) => {
        let completedProjects = projects.filter((project) =>{
            return project.dataValues.status == 'Completed'
        })
        let workingOnProjects = projects.filter((project) =>{
            return project.dataValues.status == 'Working on'
        })
        let planToDoProjects = projects.filter((project) =>{
            return project.dataValues.status == 'Plan to do'
        })

        res.render('profile', {completedProjects: completedProjects, workingOnProjects: workingOnProjects, planToDoProjects: planToDoProjects})
    })
})

router.get('/create-project', (req, res) => {
    res.render('create-project')
})

router.get('/project-details/:projectId', (req, res) => {
    const projectId = req.params.projectId

    models.Project.findAll({
        where: { id: projectId }
    }).then((project) => {
        res.render('project-details', { project: project })
    })
})

router.get('/categories', (req, res) => {
        res.render('categories')
})

router.post('/categories/:statusCat', (req, res) => {
    const statusCat = req.params.statusCat

    models.Project.findAll({
        where: {status: statusCat, user_id: req.session.username}
    }).then((projects) => {
        res.redirect('/categories', { projects: projects })
    })
})

router.post('/project-details', (req, res) => {
    const projectName = req.body.projectName
    const projectDescription = req.body.projectDescription
    // Keep name consistent
    const projectStatus = "Plan to do"
    const userId = req.session.username
    console.log(userId)

    let newProject = models.Project.build({
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        user_id: userId
    })
    newProject.save().then(() => {
        let project_id = newProject.dataValues.id.toString()
        let url = './project-details/' + project_id
        res.redirect(url)
    })
})

function projectsFilter(projects, status) {
    projects.filter((project) =>{
        return project.dataValues.status == status
    })
}



module.exports = router