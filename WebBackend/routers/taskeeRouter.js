const taskeeRoutee = require("express").Router();
const taskee = require("../taskee");

taskeeRoutee.get(`/taskee`, async (req, res) => {
  try {
    const result = await taskee.findAll();
    res.status(200).json({ result });
  } catch (e) {
    console.log(e);
    res.status(500).json([e]);
  }
});

taskeeRoutee.get(`/taskee/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await taskee.findOne(id);
    res.status(200).json({ result });
  } catch (e) {
    console.log(e);
    res.status(500).json([e]);
  }
});

taskeeRoutee.post(`/taskee`, async (req, res) => {
  try {
    const data = req.body;
    const result = await taskee.createUpdate(data);
    res.status(200).json({ result });
  } catch (e) {
    console.log(e);
    res.status(500).json([e]);
  }
});

taskeeRoutee.delete(`/taskee/:id`, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await taskee.remove(id);
    res.status(200).json({result});
  } catch (e) {
    console.log(e);
    res.status(500).json([e]);
  }
});

module.exports = taskeeRoutee;
