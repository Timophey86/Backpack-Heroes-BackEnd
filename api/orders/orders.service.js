const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;
const asyncLocalStorage = require("../../services/als.service");

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection("orders"); //bring to DB
    const orders = await collection.find(criteria).toArray();
    const ordersToReturn = orders.reduce((acc, order) => {
      if (order.host._id === filterBy.userId) {
        acc["host"] = [...(acc["host"] || []), order];
      }
      if (order.member._id === filterBy.userId) {
        acc["reserved"] = [...(acc["reserved"] || []), order];
      }
      return acc;
    }, {});

    return ordersToReturn;
  } catch (err) {
    logger.error("cannot find orders", err);
    throw err;
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection("orders");
    // remove only if user is owner/admin
    const query = { _id: ObjectId(orderId) };
    await collection.deleteOne(query);
    // return await collection.deleteOne({ _id: ObjectId(orderId), byUserId: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err);
    throw err;
  }
}

async function add(order) {
  try {
    // peek only updatable fields!
    const collection = await dbService.getCollection("orders");
    await collection.insertOne(order);
    return order;
  } catch (err) {
    logger.error("cannot insert order", err);
    throw err;
  }
}

async function update(order) {
  try {
    const collection = await dbService.getCollection("orders"); //bring the collection
    order._id = ObjectId(order._id);
    await collection.updateOne({ _id: order._id }, { $set: order });

    return order;
  } catch (err) {
    console.log(err);
    logger.error("cannot insert order", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.userId) {
    criteria.$or = [
      { "host._id": filterBy.userId },
      { "member._id": filterBy.userId },
    ];
  }
  return criteria;
}

module.exports = {
  query,
  remove,
  add,
  update,
};
