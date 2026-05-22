import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Application = {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
  deadline: string;
};

type ApplicationForm = {
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
  deadline: string;
};

const API_URL = "http://127.0.0.1:8000/applications";

function App() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [formData, setFormData] = useState<ApplicationForm>({
    company: "",
    position: "",
    status: "Applied",
    date_applied: "",
    notes: "",
    deadline: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("deadline");

  const fetchApplications = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      status: "Applied",
      date_applied: "",
      notes: "",
      deadline: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    resetForm();
    fetchApplications();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchApplications();
  };

  const handleEdit = (application: Application) => {
    setEditingId(application.id);

    setFormData({
      company: application.company,
      position: application.position,
      status: application.status,
      date_applied: application.date_applied,
      notes: application.notes,
      deadline: application.deadline,
    });
  };

  const filteredApplications = applications
  .filter((app) => {
    const searchText = searchTerm.toLowerCase();

    return (
      app.company.toLowerCase().includes(searchText) ||
      app.position.toLowerCase().includes(searchText) ||
      app.notes.toLowerCase().includes(searchText)
    );
  })
  .filter((app) => {
    if (statusFilter === "All") {
      return true;
    }

    return app.status === statusFilter;
  })
  .sort((a, b) => {
    if (sortOption === "deadline") {
      return a.deadline.localeCompare(b.deadline);
    }

    if (sortOption === "company") {
      return a.company.localeCompare(b.company);
    }

    if (sortOption === "date_applied") {
      return b.date_applied.localeCompare(a.date_applied);
    }

    return 0;
  });

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (app) => app.status == "Applied"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status == "Interview"
  ).length;

  const offerCount = applications.filter(
    (app) => app.status == "Offer"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status == "Rejected"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  const upcomingDeadlineCount = applications.filter(
    (app) => app.deadline && app.deadline >= today
  ).length;

  const statusCharData = [
    {status: "Applied", count: appliedCount},
    {status: "Interview", count: interviewCount},
    {status: "Offer", count: offerCount},
    {status: "Rejected", count: rejectedCount},
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Job Application Tracker</h1>

      <h2>Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "24px"
        }}
      >
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", minWidth: "140px" }}>
          <h3>Total</h3>
          <p>{totalApplications}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", minWidth: "140px" }}>
          <h3>Applied</h3>
          <p>{appliedCount}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", minWidth: "140px" }}>
          <h3>Interview</h3>
          <p>{interviewCount}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", minWidth: "140px" }}>
          <h3>Offer</h3>
          <p>{offerCount}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", minWidth: "140px" }}>
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", minWidth: "140px" }}>
          <h3>Upcoming Deadlines</h3>
          <p>{upcomingDeadlineCount}</p>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
          height: "300px",
        }}
      >
        <h3>Applications by Status</h3>

        <ResponsiveContainer width="100%" height="80%">
          <BarChart data ={statusCharData}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>{editingId === null ? "Add Application" : "Edit Application"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <label>Company: </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Position: </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Status: </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Date Applied: </label>
          <input
            type="date"
            name="date_applied"
            value={formData.date_applied}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Notes: </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>

        <div style={{marginBottom: "12px"}}>
          <label>Deadline: </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">
          {editingId === null ? "Add Application" : "Update Application"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "8px" }}>
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Search / Filter / Sort</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ marginBottom: "12px"}}>
          <label>Search: 
            <input
              type = "text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search company, position, notes"
            />
          </label>
        </div>

        <div style={{ marginBottom: "12px"}}>
          <label> Status Filter: </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value = "All">All</option>
            <option value = "Applied">Applied</option>
            <option value = "Interview">Interview</option>
            <option value = "Offer">Offer</option>
            <option value = "Rejected">Rejected</option>
          </select>
        </div>
        <div style={{ marginBottom: "12px"}}>
          <label>Sort By: </label>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value = "deadline">Deadline</option>
            <option value="company">Company</option>
            <option value="date_applied">Date Applied</option>
          </select>
        </div>
      </div>

      <h2>Applications</h2>

      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div>
          {filteredApplications.map((app) => (
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
                <strong>Deadline:</strong> {app.deadline || "No deadline"}
              </p>

              <p>
                <strong>Notes:</strong> {app.notes}
              </p>

              <button onClick={() => handleEdit(app)}>Edit</button>

              <button
                onClick={() => handleDelete(app.id)}
                style={{ marginLeft: "8px" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;