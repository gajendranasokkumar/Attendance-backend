const DashboardService = require("../services/dashboardService")

class DashboardController {
    async getOptionsDetails(req, res) {
    try {
      const optionsDetails = await DashboardService.getOptionsDetails();
      res.json(optionsDetails);
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
}

module.exports = new DashboardController();