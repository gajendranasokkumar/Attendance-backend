// scheduler.js

// Function to be executed
function myFunction() {
    console.log("Function executed at " + new Date());
    // Your code here
  }
  
  // Function to calculate the delay until a specific time
  function calculateDelay(targetHour, targetMinute, targetSecond) {
    const now = new Date();
    const targetTime = new Date();
  
    targetTime.setHours(targetHour, targetMinute, targetSecond, 0);
  
    let delay = targetTime.getTime() - now.getTime();
  
    // If the target time is in the past, set it for the next day
    if (delay < 0) {
      targetTime.setDate(targetTime.getDate() + 1);
      delay = targetTime.getTime() - now.getTime();
    }
  
    return delay;
  }
  
  // Function to set a timeout for the target time
  function scheduleFunction(targetHour, targetMinute, targetSecond) {
    const delay = calculateDelay(targetHour, targetMinute, targetSecond);
  
    setTimeout(() => {
      myFunction();
      // Reschedule the function to run at the same time the next day
      scheduleFunction(targetHour, targetMinute, targetSecond);
    }, delay);
  }
  
  // Schedule the function to run at 15:30:00 (3:30 PM)
  scheduleFunction(7, 30, 0);
  
  // Keep the server running
  console.log("Scheduler running. Waiting for the specified time...");
  