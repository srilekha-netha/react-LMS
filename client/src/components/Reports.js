// src/components/Reports.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import "./StudentDashboard.css"; // ensure responsive styles

// Move fake data outside component to satisfy hook dependencies
const fakeEngagement = [
  { courseTitle: "React Basics", totalUnlocks: 120 },
  { courseTitle: "NodeJS Mastery", totalUnlocks: 75 },
  { courseTitle: "MongoDB Atlas", totalUnlocks: 50 },
];
const fakeCompletion = [
  { title: "React Basics", rate: 65 },
  { title: "NodeJS Mastery", rate: 40 },
  { title: "MongoDB Atlas", rate: 30 },
];

export default function Reports() {
  const [activeLearners, setActiveLearners] = useState(null);
  const [engagement, setEngagement] = useState([]);
  const [completionRates, setCompletionRates] = useState([]);

  useEffect(() => {
    // Active Learners
    axios
      .get("/api/admin/reports/active-learners?since=2025-01-01")
      .then((r) => setActiveLearners(r.data.count))
      .catch((err) => {
        console.error(err);
        setActiveLearners(200); // fake count
      });

    // Engagement
    axios
      .get("/api/admin/reports/engagement")
      .then((r) => setEngagement(r.data.length ? r.data : fakeEngagement))
      .catch((err) => {
        console.error(err);
        setEngagement(fakeEngagement);
      });

    // Completion Rates
    axios
      .get("/api/admin/reports/completion-rates")
      .then((r) => setCompletionRates(r.data.length ? r.data : fakeCompletion))
      .catch((err) => {
        console.error(err);
        setCompletionRates(fakeCompletion);
      });
  }, []); // empty deps now safe since fakes are stable

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">📊 Admin Reports</h1>

      {/* Active Learners */}
      <div className="row mb-4">
        <div className="col">
          <div className="alert alert-info">
            Active Learners: <strong>{activeLearners ?? "Loading..."}</strong>
          </div>
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="m-0">Course Engagement</h3>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => exportCSV(engagement, "engagement.csv")}
          >
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagement} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="courseTitle" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalUnlocks" fill="#0d6efd" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Completion Rates Chart */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="m-0">Completion Rates (%)</h3>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => exportCSV(completionRates, "completion-rates.csv")}
          >
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={completionRates}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="title" />
            <YAxis unit="%" />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="rate" fill="#198754" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
