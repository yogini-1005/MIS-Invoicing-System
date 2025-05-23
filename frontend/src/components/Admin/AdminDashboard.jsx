import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalUsers: 0,
    totalLeads: 0,
    invoiceTrend: [],
    userTrend: [],
    leadTrend: []
  });

  const [stats, setStats] = useState({
    invoicesByMonth: [],
    userGrowth: [],
    leadConversion: 0
  });

  const [activities, setActivities] = useState([]);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');

  useEffect(() => {
    // Simulated data fetch
    const fetchData = async () => {
      try {
        // Summary data
        setSummary({
          totalInvoices: 8,
          totalUsers: 2,
          totalLeads: 45,
          invoiceTrend: [10, 15, 12, 18, 20, 25, 20],
          userTrend: [2, 3, 1, 4, 5, 2, 3],
          leadTrend: [5, 8, 6, 10, 7, 9, 5]
        });

        // Stats data
        setStats({
          invoicesByMonth: [
            { month: 'Jan', count: 8 },
            { month: 'Feb', count: 12 },
            { month: 'Mar', count: 15 },
            { month: 'Apr', count: 18 },
            { month: 'May', count: 20 }
          ],
          userGrowth: [
            { month: 'Jan', count: 2 },
            { month: 'Feb', count: 5 },
            { month: 'Mar', count: 7 },
            { month: 'Apr', count: 10 },
            { month: 'May', count: 15 }
          ],
          leadConversion: 32
        });

        // Activities data
        setActivities([
          { id: 1, user: 'John Doe', action: 'created a new invoice', time: '2 mins ago' },
          { id: 2, user: 'System', action: 'completed nightly backup', time: '1 hour ago' },
          { id: 3, user: 'Jane Smith', action: 'updated profile information', time: '3 hours ago' },
          { id: 4, user: 'Mike Johnson', action: 'submitted a support ticket', time: '5 hours ago' },
          { id: 5, user: 'System', action: 'performed database optimization', time: 'Yesterday' }
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const handleAssistantQuery = () => {
    // Simulate AI response
    const responses = [
      "Based on current trends, you can expect a 15% increase in invoices this month.",
      "Your system is performing optimally with 99.9% uptime this week.",
      "There are 5 pending actions that require your attention.",
      "User growth has increased by 20% compared to last month."
    ];
    setAssistantResponse(responses[Math.floor(Math.random() * responses.length)]);
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin!</h1>
      <p className="text-muted">Here's an overview of your system</p>

      {/* Quick Stats with Sparklines */}
      <div className="dashboard-cards">
        <div className="card shadow-sm">
          <h4>Total Invoices</h4>
          <p>{summary.totalInvoices}</p>
          <div className="sparkline">
            {summary.invoiceTrend.map((val, i) => (
              <div key={`invoice-${i}`} style={{ height: `${val * 2}px` }}></div>
            ))}
          </div>
        </div>
        <div className="card shadow-sm">
          <h4>Total Users</h4>
          <p>{summary.totalUsers}</p>
          <div className="sparkline">
            {summary.userTrend.map((val, i) => (
              <div key={`user-${i}`} style={{ height: `${val * 5}px` }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Data Visualization */}
      <div className="data-visualization mt-4">
        <h3>System Analytics</h3>
        <div className="chart-container">
          <div className="chart-card">
            <h5>Invoices by Month</h5>
            <div className="bar-chart pb-4">
              {stats.invoicesByMonth.map((month, i) => (
                <div key={`invoice-month-${i}`} className="bar" style={{ height: `${month.count * 5}px` }}>
                  <span>{month.count}</span>
                  <small>{month.month}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <h5>User Growth</h5>
            <div className="line-chart">
              {stats.userGrowth.map((point, i) => (
                <div 
                  key={`user-growth-${i}`} 
                  className="point" 
                  style={{ 
                    left: `${i * 30}px`, 
                    bottom: `${point.count * 5}px` 
                  }} 
                />
              ))}
              <div className="line"></div>
            </div>
            <div className="x-axis">
              {stats.userGrowth.map((point, i) => (
                <small key={`x-axis-${i}`}>{point.month}</small>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        {/* Real-Time Activity Feed */}
        <div className="activity-feed">
          <h3>Recent Activity</h3>
          <ul>
            {activities.map(activity => (
              <li key={activity.id}>
                <div className="activity-item">
                  <strong>{activity.user}</strong> 
                  <span>{activity.action}</span>
                  <small className="text-muted">{activity.time}</small>
                </div>
              </li>
            ))}
          </ul>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={() => window.location.href = "/activity-log"}
          >
            View Full Activity Log
          </button>
        </div>

        {/* Admin Assistant */}
        <div className="admin-assistant">
          <h3>Admin Assistant</h3>
          <div className="assistant-container">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control"
                placeholder="Ask me anything about your system..."
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAssistantQuery()}
              />
              <button 
                className="btn btn-info"
                onClick={handleAssistantQuery}
              >
                Ask
              </button>
            </div>
            {assistantResponse && (
              <div className="assistant-response alert alert-info">
                <p>{assistantResponse}</p>
              </div>
            )}
            <div className="assistant-examples">
              <small className="text-muted">Try asking:</small>
              <ul>
                <li>"How many new users this week?"</li>
                <li>"What's our invoice status?"</li>
                <li>"Show system alerts"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}