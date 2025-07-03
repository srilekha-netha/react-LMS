// src/components/Reports.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function Reports() {
  const [activeLearners, setActiveLearners] = useState(0);
  const [engagement, setEngagement]         = useState([]);
  const [completionRates, setCompletionRates] = useState([]);

  // Fetch on mount
  useEffect(() => {
    axios.get("/api/admin/reports/active-learners?since=2025-01-01")
      .then(r => setActiveLearners(r.data.count))
      .catch(console.error);

    axios.get("/api/admin/reports/engagement")
      .then(r => setEngagement(r.data))
      .catch(console.error);

    axios.get("/api/admin/reports/completion-rates")
      .then(r => setCompletionRates(r.data))
      .catch(console.error);
  }, []);

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  return (
    <div className="container py-4">
      <h1>📊 Admin Reports</h1>

      {/* Active Learners */}
      <div className="row mb-4">
        <div className="col">
          <div className="alert alert-info">
            Active Learners: <strong>{activeLearners}</strong>
          </div>
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="mb-5">
        <h3>Course Engagement</h3>
        <button
          className="btn btn-sm btn-outline-secondary mb-2"
          onClick={() => exportCSV(engagement, "engagement.csv")}
        >
          Export CSV
        </button>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagement}>
            <XAxis dataKey="courseTitle" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalUnlocks" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Completion Rates Chart */}
      <div className="mb-5">
        <h3>Completion Rates (%)</h3>
        <button
          className="btn btn-sm btn-outline-secondary mb-2"
          onClick={() => exportCSV(completionRates, "completion-rates.csv")}
        >
          Export CSV
        </button>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={completionRates}>
            <XAxis dataKey="title" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="rate" fill="#198754" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
