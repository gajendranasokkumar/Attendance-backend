const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const leaveController = require('../controllers/leaveController');
const employeeController = require('../controllers/employeeController');
const attendanceController = require('../controllers/attendanceController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', homeController.getHome)

router.post('/', authController.login);
router.post('/checkuser', authController.checkUser);
router.post('/verifyotp', authController.verifyOTP);
router.post('/updatepassword', authController.updatePassword);

router.post('/leaveform', leaveController.applyLeave);
router.get('/leavelist', leaveController.getLeaveList);
router.post('/updateleave', leaveController.updateLeaveStatus);
router.post('/currentleavecount', leaveController.getCurrentLeaveCount);

router.post('/addemployee', employeeController.addEmployee);
router.post('/updateEmployee', employeeController.updateEmployee);
router.delete('/deleteEmployee/:id', employeeController.deleteEmployee);
router.get('/getAllEmployees', employeeController.getAllEmployees);
router.get('/fetchmanager', employeeController.fetchManagers);
router.post('/getEmpListForManager', employeeController.getEmpListForManager);
router.post('/uploadexcel', employeeController.uploadExcel);

router.post('/getCheckInDetails', attendanceController.getCheckInDetails);
router.post('/checkin', attendanceController.checkIn);
router.post('/checkout', attendanceController.checkOut);
router.post('/getAttendanceHistory', attendanceController.getAttendanceHistory);
router.post('/punchcheckin', attendanceController.punchCheckIn);
router.post('/punchcheckout', attendanceController.punchCheckOut);
router.post('/requestattendance', attendanceController.requestAttendance);
router.get('/getrequestforms', attendanceController.getRequestForms);
router.post('/updateattendancerequest', attendanceController.updateAttendanceRequest);
router.get('/getattendancedetails', attendanceController.getAttendanceDetails);
router.get('/getworkinghours', attendanceController.getWorkingHours);

router.get('/getOptionsDetails', dashboardController.getOptionsDetails);

module.exports = router;