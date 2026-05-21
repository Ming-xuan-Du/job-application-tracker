import { useEffect, useState } from "react";

type Application = {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
};

type ApplicationForm = {
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
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
  });

  const [editingId, setEditingId] = useState<number | null>(null);

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
    });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Job Application Tracker</h1>

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

        <button type="submit">
          {editingId === null ? "Add Application" : "Update Application"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "8px" }}>
            Cancel Edit
          </button>
        )}
      </form>

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