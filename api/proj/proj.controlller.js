const logger = require("../../services/logger.service");
const projService = require("./proj.service.js");
const userService = require('../user/user.service')

async function getProjs(req, res) {
  try {
    const projs = await projService.query(req.query);
    res.json(projs);
  } catch (err) {
    logger.error("Cannot get projs", err);
    res.status(500).send({
      err: "Failed to get projs",
    });
  }
}

// Get a single proj by id
async function getProjById(req, res) {
  try {
    const projId = req.params.projId;
    const proj = await projService.getById(projId);
    res.json(proj);
  } catch (err) {
    logger.error("Cannot get proj by id", err);
    res.status(500).send({
      err: "Failed to get proj by id",
    });
  }
}

// add a new proj

async function addProj(req, res) {
  try {
    var currProj= req.body
    var currUser = {
      _id: req.session.user._id,
      fullname: req.session.user.fullname,
      imgUrl: req.session.user.imgUrl,
    };
    currProj.host = currUser
    const savedProj = await projService.add(currProj);
    // var miniProj = {
    //     _id:savedProj._id,
    //     name: savedProj.name,
    //     startsAt: savedProj.startsAt,
    //     startsEnd: savedProj.startsEnd
    // }
    
    // req.session.user.myProjs.push(miniProj)
    // await userService.update(req.session.user)

    res.json(savedProj);
  } catch (err) {
    logger.error("Cannot add proj ", err);
    res.status(500).send({
      err: "Failed to add proj",
    });
  }
}

async function updateProj(req, res) {
  try {
    const proj = req.body;
    if (proj.host._id !== req.session.user._id) throw new Error(`Can't update someone elses project`);
    const savedProj = await projService.update(proj);
    res.json(savedProj);
  } catch (err) {
    res.status(500).send("cannot update proj");
  }
}

// remove proj by id
async function removeProj(req, res) {
  // const {nickname} = req.cookies
  try {
    const projId = req.params.projId;
    await projService.remove(projId, req.session.user._id);
    res.json("Deleted...");
  } catch (err) {
    res.status(500).send(err);
  }
}

function _createProj(name) {
  return {
    _id: utilService.makeId(),
    name,
    price: 0,
    type: "regular",
    createdAt: Date.now(),
    inStock: true,
  };
}

module.exports = {
  getProjs,
  getProjById,
  addProj,
  updateProj,
  removeProj,
};
