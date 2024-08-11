const employeeService = require("../services/employeeService");

class EmployeeController {
  async addEmployee(req, res) {
    const employeeDetails = req.body;
    console.log(employeeDetails);

    try {
      const newEmployee = await employeeService.createEmployee(employeeDetails);
      res.status(201).json(newEmployee);
    } catch (err) {
      console.error("Error creating employee:", err);
      res
        .status(400)
        .json({ error: "Cannot Create Employee", details: err.message });
    }
  }

  async updateEmployee(req, res) {
    const { id, ...updateemp } = req.body;

    try {
      const updatedEmployee = await employeeService.updateEmployee(
        id,
        updateemp
      );
      if (!updatedEmployee) {
        return res.status(404).send({ message: "Employee not found" });
      }
      res.send(updatedEmployee);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async getAllEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.send(employees);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const result = await employeeService.deleteEmployeeById(id);
      
      if (!result) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async fetchManagers(req, res) {
    try {
      const managers = await employeeService.fetchManager();
      res.send(managers);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async getEmpListForManager(req, res) {
    const idArray = Array.isArray(req.body) ? req.body : [req.body];
    try {
      const employees = await employeeService.getEmployeesByIds(idArray);
      res.send(employees);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async uploadExcel(req, res) {
    const employeeDetails = req.body;

    try {
      await employeeService.uploadExcel(employeeDetails);
      res
        .status(200)
        .json({ message: "Row data received and processed successfully" });
    } catch (err) {
      console.error("Error creating employee:", err);
      res
        .status(400)
        .json({ error: "Cannot Create Employee", details: err.message });
    }
  }
}

module.exports = new EmployeeController();
