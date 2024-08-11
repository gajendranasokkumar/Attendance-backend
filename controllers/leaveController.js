const leaveService = require("../services/leaveService");

class LeaveController {
  async applyLeave(req, res) {
    try {
      const leaveDetails = req.body;
      const appliedLeave = await leaveService.applyLeave(leaveDetails);
      res.status(200).json(appliedLeave);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  async getLeaveList(req, res) {
    try {
      const leaveList = await leaveService.getLeaveList();
      res.status(200).json(leaveList);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  async updateLeaveStatus(req, res) {
    const { formId, currentStatus } = req.body;
    try {
      let updatedLeave = await leaveService.updateLeaveStatus(formId, currentStatus);
      res.json(updatedLeave);
    } catch (error) {
      res.status(400).send("Cannot Update Status");
    }
  }

  async getCurrentLeaveCount(req, res) {
    const { id } = req.body;
    try {
      const count = await leaveService.getCurrentLeaveCount(id);
      res.status(200).send(count);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new LeaveController();
