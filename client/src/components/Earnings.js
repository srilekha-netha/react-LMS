import React, { useEffect, useState } from "react";

function Earnings() {
  const [earnings, setEarnings] = useState({
    total: 0,
    redeemedCoupons: 0,
    reportUrl: "#",
  });

  useEffect(() => {
    // Dummy data – Replace with real backend/API response
    const dummyData = {
      total: 12500,
      redeemedCoupons: 35,
      reportUrl: "/downloads/earning-report-june.pdf", // Replace with actual download path
    };
    setEarnings(dummyData);
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="mt-4 mb-3">Earnings Dashboard</h2>

      <div className="card shadow-sm" style={{ maxWidth: "480px" }}>
        <div className="card-body">
          <h5 className="card-title">Overview</h5>
          <p className="card-text">
            <strong>Total Earnings:</strong>{" "}
            <span className="fs-4 text-success">₹{earnings.total.toLocaleString()}</span>
          </p>
          <p className="card-text">
            <strong>Coupons Redeemed:</strong>{" "}
            <span className="badge bg-primary">{earnings.redeemedCoupons}</span>
          </p>
          <hr />
          <a
            href={earnings.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
          >
            <i className="bi bi-download me-1"></i> Download Report
          </a>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
