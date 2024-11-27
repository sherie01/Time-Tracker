import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import "./App.css";

function App() {
  const employees = ["Sherie", "Jesper", "Harley", "Jordan", "Romarc"];
  
  const [employeeStates, setEmployeeStates] = useState(
    employees.reduce((acc, employee) => {
      acc[employee] = {
        isClockedIn: false,
        lastTimestamp: null,
        totalHours: 0,
        clockInTime: null,
      };
      return acc;
    }, {})
  );

  const resetAllEmployees = () => {
    const resetData = employees.reduce((acc, employee) => {
      acc[employee] = {
        isClockedIn: false,
        lastTimestamp: null,
        totalHours: 0,
        clockInTime: null,
      };
      return acc;
    }, {});
    setEmployeeStates(resetData);
  };

  return (
    <div className="Container">
      <h2>
        Ellry Cafe <br /> Time Tracker
      </h2>
      <EmployeeList employees={employees} employeeStates={employeeStates} setEmployeeStates={setEmployeeStates} />
      <button onClick={resetAllEmployees} className="reset-button">
        Reset All
      </button>
    </div>
  );
}

const EmployeeList = ({ employees, employeeStates, setEmployeeStates }) => {
  const handleStatusChange = (employee, status, timestamp) => {
    console.log(
      `${employee} ${status ? "clocked in" : "clocked out"} at ${timestamp}`
    );
    setEmployeeStates(prev => ({
      ...prev,
      [employee]: {
        ...prev[employee],
        isClockedIn: status,
        lastTimestamp: timestamp,
        clockInTime: status ? timestamp : prev[employee].clockInTime,
      }
    }));
  };

  return (
    <div className="List">
      {employees.map((employee) => (
        <TimeTracker
          key={employee}
          employee={employee}
          employeeData={employeeStates[employee]}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};

const TimeTracker = ({ employee, employeeData, onStatusChange }) => {
  const { isClockedIn, lastTimestamp, totalHours, clockInTime } = employeeData;

  const handleClockToggle = () => {
    const currentTime = new Date();
    if (isClockedIn) {
      const hoursWorked = (currentTime - clockInTime) / (1000 * 60 * 60);
      onStatusChange(employee, false, currentTime);
    } else {
      onStatusChange(employee, true, currentTime);
    }
  };

  return (
    <div className="Track">
      <div className="Clock">
        <h3>{employee}</h3>
        <p className={`text-small ${isClockedIn ? "text-working" : "text-resting"}`}>
          {isClockedIn ? "Working" : "Resting"}
        </p>
        {lastTimestamp && (
          <p className="time">
            Last action: {format(lastTimestamp, "MM/dd/yyyy hh:mm:ss aa")}
          </p>
        )}
        <p className="time">Total hours: {totalHours.toFixed(2)}</p>

        <div className="Button">
          <button
            onClick={handleClockToggle}
            className={`button ${isClockedIn ? "clock-in" : "clock-out"}`}
          >
            {isClockedIn ? "Take a Break" : "Clock in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
