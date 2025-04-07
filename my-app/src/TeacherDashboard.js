import React, { useState } from "react";
import "./TeacherDashboard.css";
import { FaUserTie, FaSignOutAlt, FaCar, FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const TeacherDashboard = ({ teacher, onLogout }) => {
  const [vehicles, setVehicles] = useState(teacher.vehicles || []);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("2-wheeler");
  const [allocatedSlots, setAllocatedSlots] = useState({});

  const MAX_SLOTS = {
    "2-wheeler": 40,
    "4-wheeler": 50
  };

  const generatePass = () => `PASS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const registerVehicle = (e) => {
    e.preventDefault();

    const currentTypeCount = vehicles.filter(v => v.type === vehicleType).length;
    if (currentTypeCount >= 1) {
      alert(`You can only register one ${vehicleType}.`);
      return;
    }

    const globalCount = vehicles.filter(v => v.type === vehicleType).length;
    if (globalCount >= MAX_SLOTS[vehicleType]) {
      alert(`No slots available for ${vehicleType}s. Max limit reached.`);
      return;
    }

    const pass = generatePass();
    const newVehicle = { number: vehicleNumber, type: vehicleType, pass };
    const slot = `SLOT-${Math.floor(Math.random() * 100)}`;

    setVehicles([...vehicles, { ...newVehicle, slot }]);
    setAllocatedSlots((prev) => ({ ...prev, [pass]: slot }));
    alert(`Vehicle registered with pass: ${pass} and allocated slot: ${slot}`);

    setVehicleNumber("");
    setVehicleType("2-wheeler");
  };

  const deleteVehicle = (pass) => {
    setVehicles(vehicles.filter((v) => v.pass !== pass));
    setAllocatedSlots((prev) => {
      const updated = { ...prev };
      delete updated[pass];
      return updated;
    });
    alert(`Vehicle with pass ${pass} has been removed.`);
  };

  return (
    <div className="teacher-dashboard">
      <h2><FaUserTie /> Teacher Dashboard</h2>
      <p><strong>Email:</strong> {teacher.email}</p>

      
            <div className="logout-container">
              <button className="logout-button" onClick={onLogout}>
                <FaSignOutAlt />Logout</button>
            </div>

      <div className="vehicle-register-section">
        <h3><FaPlusCircle /> Register Vehicle</h3>
        <form onSubmit={registerVehicle}>
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option value="2-wheeler">2-Wheeler</option>
            <option value="4-wheeler">4-Wheeler</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>

      <div className="vehicle-list-section">
        <h3><FaCar /> Registered Vehicles</h3>
        {vehicles.length === 0 ? (
          <p>No vehicles registered.</p>
        ) : (
          <ul className="vehicle-list">
            {vehicles.map((v) => (
              <li key={v.pass} className="vehicle-item">
                <span><strong>Number:</strong> {v.number}</span>
                <span><strong>Type:</strong> {v.type}</span>
                <span><strong>Pass:</strong> {v.pass}</span>
                <span><strong>Slot:</strong> {v.slot || allocatedSlots[v.pass]}</span>
                <button onClick={() => deleteVehicle(v.pass)} className="delete-button">
                  <FaTrashAlt /> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
