const Plan = require('../models/plan');

const planController = {};

planController.get = async function (req, res) {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
}

planController.create = async function (req, res) {
  const { title, description, discount } = req.body;

  try {
    const isCreated = await Plan.findOne({title});

    if (isCreated) {
      res.status(409).json({ message: 'Plan already exist' });
      return;
    }

    await Plan.create({
      title,
      description,
      discount
    });
    res.status(201).json({ message: 'Plan was successfully added' });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

planController.changeFields = async function (req, res) {
  const { planId, title, description, discount } = req.body;

  const changes = {};
  title && (changes.title = title);
  description && (changes.description = description);
  discount && (changes.discount = discount);

  try {
    const plan = await Plan.findById(planId);

    if (!plan) {
      res.status(404).json({ message: 'Plan is not defined' });
    }

    await plan.update({
      ...changes
    });
    res.status(200).json({ message: 'Plan was successfully changed' });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
}

module.exports = planController;