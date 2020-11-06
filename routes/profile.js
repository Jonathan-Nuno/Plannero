const express = require('express')
const router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
    if (req.session.guest == true){
        displayName = 'Guest'
    } else{
        displayName = req.session.name
    }
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

        res.render('profile', {completedProjects: completedProjects, workingOnProjects: workingOnProjects, planToDoProjects: planToDoProjects, displayName:displayName})
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
        const projectStatus = project[0].dataValues.status
        const statusText = projectStatus.replace(/_/g, " ")
        res.render('project-details', { project: project, statusText: statusText })
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
    const projectStatus = req.body.projectStatus
    const userId = req.session.username
    

    let newProject = models.Project.build({
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        user_id: userId
    })
    newProject.save().then(() => {
        let project_id = newProject.dataValues.id.toString()
        let url = '/profile/project-details/' + project_id
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
        res.redirect('/profile') 
    })
})

router.post('/update-project',(req,res) => {
    
    const projectId = req.body.projectId
    models.Project.findAll({
        where: {id: projectId}
    }).then((project) => {
        const projectStatus = project[0].dataValues.status
        const statusText = projectStatus.replace(/_/g, " ")
        res.render('update-project', {project: project, statusText: statusText})
    })
})

router.post('/update-project/confirm',(req,res) => {
    
    const projectId = req.body.projectId
    const projectName = req.body.projectName
    const projectDescription = req.body.projectDescription
    const projectStatus = req.body.projectStatus
    const url = '/profile/project-details/' + projectId.toString()
    models.Project.update({
        name: projectName, 
        description: projectDescription,
        status: projectStatus
    },{
        where: {
            id: projectId 
        }
    }).then((project) => {
        res.redirect(url)
    })
})



module.exports = router