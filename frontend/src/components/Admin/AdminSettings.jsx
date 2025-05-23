import React, { useState } from "react";
import "./AdminSettings.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    theme: "light",
    itemsPerPage: 10,
    emailNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate saving settings
    toast.success("Settings saved successfully!");
    console.log("Saved Settings:", settings);
  };

  return (
    <div className="admin-settings-container">
      <h2>Admin Settings</h2>
      <form onSubmit={handleSave} className="admin-settings-form">

        <div className="form-group">
          <label>Theme:</label>
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        <div className="form-group">
          <label>Items Per Page:</label>
          <input
            type="number"
            name="itemsPerPage"
            value={settings.itemsPerPage}
            onChange={handleChange}
            min="5"
            max="100"
          />
        </div>

        <div className="form-group d-flex align-items-center justify-content-center">
          <label>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
            Enable Email Notifications
          </label>
        </div>

        <button type="submit" className="save-btn">Save Settings</button>
      </form>
      <ToastContainer />
    </div>
  );
}
