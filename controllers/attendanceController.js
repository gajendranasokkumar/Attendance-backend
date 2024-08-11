const AttendanceService = require("../services/attendanceService");

class AttendanceController {
  async getCheckInDetails(req, res) {
    try {
      const { id, date } = req.body;
      const checkInDetails = await AttendanceService.getCheckInDetails({
        id,
        date,
      });
      res.status(200).json(checkInDetails);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching check-in details",
        error: error.message,
      });
    }
  }

  async checkIn(req, res) {
    try {
      const { id, date, checkintime, checkouttime, ...checkINDetails } = req.body;

      const result = await AttendanceService.checkIn(
        id,
        date,
        checkintime,
        checkouttime,
        checkINDetails
      );

      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error during check-in", error: error.message });
    }
  }

  async checkOut(req, res) {
    try {
      const checkOutData = req.body;
      const result = await AttendanceService.checkOut(checkOutData);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error during check-out", error: error.message });
    }
  }

  async getAttendanceHistory(req, res) {
    try {
      const history = await AttendanceService.getAttendanceHistory();
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching attendance history",
        error: error.message,
      });
    }
  }

  async punchCheckIn(req, res) {
    try {
      const { punchid } = req.body;
      const result = await AttendanceService.punchCheckIn({ punchid });
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error during punch check-in", error: error.message });
    }
  }

  async punchCheckOut(req, res) {
    try {
      const { punchid } = req.body;
      const result = await AttendanceService.punchCheckOut({ punchid });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error during punch check-out",
        error: error.message,
      });
    }
  }

  async requestAttendance(req, res) {
    try {
      const requestDetails = req.body;
      const result = await AttendanceService.requestAttendance(requestDetails);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error requesting attendance", error: error.message });
    }
  }

  async getRequestForms(req, res) {
    try {
      const forms = await AttendanceService.getRequestForms();
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching request forms",
        error: error.message,
      });
    }
  }

  async updateAttendanceRequest(req, res) {
    const { formId, currentStatus } = req.body;
    if (currentStatus.toUpperCase() == "PERMITTED") {
      try {
        const updatedAttendance = await AttendanceService.permitAttendance(
          formId,
          currentStatus
        );
        res.json(updatedAttendance);
      } catch (error) {
        res.status(400).send(error.message);
      }
    } else {
      try {
        const updatedAttendance = await AttendanceService.rejectAttendance(
          formId,
          currentStatus
        );
        res.json(updatedAttendance);
      } catch (error) {
        res.status(400).send(error.message);
      }
    }
  }

  async getAttendanceDetails(req, res) {
    const { id, month } = req.query;
    try {
      const attendanceDetails = await AttendanceService.getAttendanceDetails(
        id,
        month
      );
      res.json(attendanceDetails);
    } catch (error) {
      res.status(500).send("Error fetching documents");
    }
  }

  async getWorkingHours(req, res) {
    const { weekStart, weekEnd, id } = req.query;
  
    try {
      const workingHours = await AttendanceService.getWorkingHoursForWeek(weekStart, weekEnd, id);
      res.json(workingHours);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = new AttendanceController();
