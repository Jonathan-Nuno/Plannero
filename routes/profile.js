const express = require('express')
const router = express.Router()
const models = require('../models')



router.get('/', (req, res) => {
    res.render('profile')
})
router.get('/create-project', (req, res) =>{
    res.render('create-project')
})

router.get('/project-details/:projectId', (req, res) => {
    const projectId = req.params.projectId

    models.Project.findAll({
        where: {id: projectId}
    }).then((project) => {
        res.render('project-details', {project: project})
    })
})





router.post('/project-details' ,(req, res) => {
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
    newProject.save().then(()=> {
        let project_id = newProject.dataValues.id.toString()
        let url = '/project-details/' + project_id
        res.redirect(url)
    })
})

module.exports = router