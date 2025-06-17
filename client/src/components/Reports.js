import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // ✅ Stable reference for fetchReports
  const fetchReports = useCallback(() => {
    setLoading(true);
    axios
      .get(`/api/admin/reports?month=${month}&year=${year}`)
      .then((res) => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, [month, year]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleExport = () => {
    axios({
      url: `/api/admin/reports/export?month=${month}&year=${year}`,
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${month}_${year}.csv`);
      document.body.appendChild(link);
      link.click();
    });
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="container mt-4">
      <h3>📊 Reports & Analytics</h3>

      <div className="d-flex align-items-center gap-3 my-3">
        <select
          className="form-select w-auto"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {months.map((m, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="form-control w-auto"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />

        <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
          <i className="bi bi-download me-1"></i> Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading report data...</p>
      ) : reportData ? (
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body">
                <h6>Active Users</h6>
                <h4>{reportData.activeUsers}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body">
                <h6>Course Completions</h6>
                <h4>{reportData.completedCourses}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body">
                <h6>Revenue (₹)</h6>
                <h4>₹{reportData.revenue}</h4>
              </div>
            </div>
          </div>

          <div className="col-md-12 mt-3">
            <div className="card shadow">
              <div className="card-body">
                <h6>Engagement Summary</h6>
                <p>
                  Total Logins: {reportData.totalLogins} <br />
                  Average Time on Platform: {reportData.avgTime} mins <br />
                  Most Popular Course: {reportData.topCourse}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No data available for selected month/year.</p>
      )}
    </div>
  );
}

export default Reports;
