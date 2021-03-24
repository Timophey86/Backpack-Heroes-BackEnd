const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy) {
  
  const criteria = _buildCriteria(filterBy);
  console.log(filterBy);
  
  try {
    const collection = await dbService.getCollection("projs"); //bring the collection
    var projs = await collection.find().toArray();
    if (filterBy.userId) {
      const projsToReturn = projs.filter((proj) => {
        return proj.host._id === filterBy.userId;
      });
      return projsToReturn;
    } else{ 
      
      return projs}
    // const regex = new RegExp(filterBy.name, 'i')
    // var projsForDisplay = gProj.filter(proj => {
    //       return regex.test(proj.name) && (proj.type === filterBy.type || filterBy.type === 'all')
    //             && (JSON.stringify(proj.inStock) === filterBy.inStock || filterBy.inStock === 'all')
  } catch (err) {
    logger.error("cannot find projs", err);
    throw err;
  }
}

async function getById(id) {
  try {
    const collection = await
   dbService.getCollection("projs"); //bring the collection
    const proj = await collection.findOne({ _id: ObjectId(id) });
    return proj;
  } catch (err) {
    logger.error("cannot find proj by id", err);
    throw err;
  }
}

async function remove(id, userId) {
  try {
    const proj = await getById(id);
    if (proj.host._id !== userId) {
      throw new Error(`Can't remove someone elses project`)}
    const collection = await dbService.getCollection("projs"); //bring the collection
    const query = { _id: ObjectId(id) };
    await collection.deleteOne(query);
  } catch (err) {
    logger.error(`cannot remove proj ${projId}`, err);
    throw err;
  }
}

async function add(proj) {
  try {
    const collection = await dbService.getCollection("projs"); //bring the collection
    await collection.insertOne(proj);
    return proj;
  } catch (err) {
    logger.error("cannot insert proj", err);
    throw err;
  }
}

async function update(proj) {
  try {
    const collection = await dbService.getCollection("projs"); //bring the collection
    proj._id = ObjectId(proj._id);
    await collection.updateOne({ _id: proj._id }, { $set: proj });

    return proj;
  } catch (err) {
    console.log(err);
    logger.error("cannot insert proj", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  var criteria = {};
  if (filterBy.name) {
    const txtCriteria = { $regex: filterBy.name, $options: "i" };
    criteria.name = txtCriteria;
  }
  if (filterBy.type && filterBy.type !== "all") {
    criteria.type = filterBy.type;
  }
  if (filterBy.userId) {
    criteria = `{"host._id":"${filterBy.userId}"}`;
  }
  return criteria;
}

module.exports = {
  query,
  getById,
  remove,
  add,
  update,
};
