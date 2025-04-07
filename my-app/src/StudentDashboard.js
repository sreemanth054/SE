import React, { useState } from "react";
import "./StudentDashboard.css";
import { FaUserGraduate, FaIdCard,  FaSignOutAlt, FaBus } from "react-icons/fa";

const StudentDashboard = ({ student, onLogout }) => {
  const [firstName, lastName] = student.email.split("@")[0].split("_");
  const [busRoute, setBusRoute] = useState(student.registeredBus || null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleRegister = () => {
    if (!selectedBus) {
      alert("Please select a bus route to register.");
      return;
    }
    const chosen = student.busRecords.find((bus) => bus.route === selectedBus);
    setBusRoute({ route: chosen.route, timing: chosen.timing });
    alert(`Registered for bus: ${chosen.route}`);
  };

  // Inject sample bus records only once
  if (!student.busRecords || student.busRecords.length === 0) {
    const generateTimings = (count) => {
      const timings = [];
      let hour = 7;
      let minute = 0;

      for (let i = 0; i < count; i++) {
        const timeStr = `${hour}:${minute.toString().padStart(2, "0")} AM`;
        timings.push(timeStr);
        minute += 2.5;
        if (minute >= 60) {
          minute -= 60;
          hour++;
        }
      }
      return timings;
    };

    const createRoutes = (city, count) => {
      const timings = generateTimings(count);
      return Array.from({ length: count }, (_, i) => ({
        route: `${city} Route ${i + 1}`,
        timing: timings[i],
        city,
      }));
    };

    student.busRecords = [
      ...createRoutes("Vijayawada", 20),
      ...createRoutes("Guntur", 20),
      ...createRoutes("Tenali", 10),
    ];
  }

  const filteredBusRecords = student.busRecords?.filter((bus) => bus.city === selectedCity);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">🎓 Student Dashboard</h2>
        <div className="dashboard-info">
          <p>
            <FaUserGraduate className="icon" /> <strong>Name:</strong>{" "}
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}{" "}
            {lastName.charAt(0).toUpperCase() + lastName.slice(1)}
          </p>
          <p>
            <FaIdCard className="icon" /> <strong>Enrollment Number:</strong>{" "}
            {student.enrollmentNumber}
          </p>

          {busRoute ? (
            <div>
              {showDetails && (
                <div className="bus-detail-view">
                  <p><strong>Route:</strong> {busRoute.route}</p>
                  <p><strong>Timing:</strong> {busRoute.timing}</p>
                </div>
              )}
            </div>
          ) : (
            <p><FaBus className="icon" /> <strong>Bus Route:</strong> Not Registered</p>
          )}
        </div>

        {!busRoute ? (
          <div>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedBus("");
              }}
              className="bus-select-dropdown"
            >
              <option value="">Select City</option>
              <option value="Vijayawada">Vijayawada</option>
              <option value="Guntur">Guntur</option>
              <option value="Tenali">Tenali</option>
            </select>
            <br />
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="bus-select-dropdown"
              disabled={!selectedCity}
            >
              <option value="">Select Bus Route</option>
              {filteredBusRecords && filteredBusRecords.map((bus, index) => (
                <option key={index} value={bus.route}>
                  {bus.route} - {bus.timing}
                </option>
              ))}
            </select>
            <button onClick={handleRegister} className="bus-register-button">
              Register for Bus
            </button>
          </div>
        ) : (
          <button className="bus-details-button" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Bus Details" : "View Bus Details"}
          </button>
        )}

       
             <div className="logout-container">
               <button className="logout-button" onClick={onLogout}>
                 <FaSignOutAlt />Logout</button>
             </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
