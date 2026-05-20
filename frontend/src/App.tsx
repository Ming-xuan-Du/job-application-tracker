import { useEffect, useState } from "react";

type Application = {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
};

function App() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Job Application Tracker</h1>

      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <h3>{app.company}</h3>
              <p>
                <strong>ID:</strong> {app.id}
              </p>
              <p>
                <strong>Position:</strong> {app.position}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <p>
                <strong>Date Applied:</strong> {app.date_applied}
              </p>
              <p>
                <strong>Notes:</strong> {app.notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;