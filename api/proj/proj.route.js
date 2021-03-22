const express = require('express')
const {log} = require('../../middlewares/logger.middleware')
const {requireAuth, requireAdmin} =  require('../../middlewares/requireAuth.middleware')
const router = express.Router()
const { getProjs, getProjById, addProj,updateProj,removeProj} = require('./proj.controlller')
 
// router.get('/', log,  getProjs)
// router.get('/:ProjId', log, getProjById)
// router.post('/', log, requireAuth, requireAdmin, addProj)
// router.put('/:ProjId', log, requireAuth, updateProj)
// router.delete('/:ProjId', log, requireAuth, requireAdmin, removeProj)
router.get('/',  getProjs)
router.get('/:projId', getProjById)
router.post('/',log, requireAuth, addProj)
router.put('/:projId',log, requireAuth, updateProj)
router.delete('/:projId',log, requireAuth, removeProj)


module.exports = router