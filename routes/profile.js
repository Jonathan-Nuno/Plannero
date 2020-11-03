const express = require('express')
const router = express.Router()
const models = require('../models')



router.get('/', async (req, res) => {
    let projectCompleted = await projectState(req, 'Completed')
    console.log(projectCompleted)
    res.render('profile', { projectCompleted: projectCompleted })
})

// router.get('/', (req, res) => {
//     models.Project.findAll({
//         where: {status: 'Completed', user_id: req.session.username}
//     }).then((project) => {
//         console.log(project)
//         res.render('profile', {project: project})
//     })
// })

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

function projectState(req, state) {
    models.Project.findAll({
        where: { status: state, user_id: req.session.username }
    }).then((project) => {
        return project
    })
    
}


module.exports = router