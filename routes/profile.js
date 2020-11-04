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
            return project.dataValues.status == 'Working_on'
        })
        let planToDoProjects = projects.filter((project) =>{
            return project.dataValues.status == 'Plan_to_do'
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
    const spaceCat = statusCat.replace(/_/g, " ")
    models.Project.findAll({
        where: {status: statusCat, user_id: req.session.username}
    }).then((projects) => {
        res.render('categories', { projects: projects, spaceCat: spaceCat })
    })
})

router.post('/project-details', (req, res) => {
    const projectName = req.body.projectName
    const projectDescription = req.body.projectDescription
    const projectStatus = "Plan_to_do"
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

router.post('/delete-project',(req,res) => {

    const projectId = req.body.projectId 
    models.Project.destroy({
        where: {
            id: projectId
        }
    }).then(deletedProject => {
        console.log(deletedProject)
        res.redirect('/profile') 
    })
})

router.post('/update-project',(req,res) => {
    
    const projectId = req.body.projectId
    models.Project.findAll({
        where: {id: projectId}
    }).then((project) => {
        res.render('update-project', {project: project})
    })
})

router.post('/update-project/confirm',(req,res) => {
    
    const projectId = req.body.projectId
    const projectName = req.body.projectName
    const projectDescription = req.body.projectDescription
    const url = '/profile/project-details/' + projectId.toString()
    models.Project.update({
        name: projectName, 
        body: projectDescription
    },{
        where: {
            id: projectId 
        }
    }).then((project) => {
        res.redirect(url)
    })
})



module.exports = router