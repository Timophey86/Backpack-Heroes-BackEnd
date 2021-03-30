const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;
const asyncLocalStorage = require("../../services/als.service");

async function query(filterBy) {
  const criteria = _buildCriteria(filterBy);
  try {
    const collection = await dbService.getCollection("projs"); //bring the collection
    var projs = await collection.find(criteria).toArray();

    return projs;
  } catch (err) {
    logger.error("cannot find projs", err);
    throw err;
  }
}

async function getById(id) {
  try {
    const collection = await dbService.getCollection("projs"); //bring the collection
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
      throw new Error(`Can't remove someone elses project`);
    }
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
  if (filterBy.category) {
    criteria.tags = filterBy.category;
  }
  if (filterBy.location) {
    criteria["loc.country"] = filterBy.location;
  }
  if (filterBy.userId) {
    criteria["host._id"] = filterBy.userId;
  }
  if (filterBy.from) {
    criteria.startsAt = {};
    criteria.startsAt.$lt = parseInt(filterBy.from);
  }
  if (filterBy.to) {
    criteria.endAt = {};
    criteria.endAt.$gte = parseInt(filterBy.to);
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
