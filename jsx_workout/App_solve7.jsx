import { useState, useEffect } from "react";

function OrganizationCard({ avatarUrl, reposUrl, nodeId, login, onClick }) {
  return (
    <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "0.5rem" }} onClick={onClick}>
      <img src={avatarUrl} alt="Avatar" style={{ width: "100%", borderRadius: "0.5rem" }} />
      <p>ID: {nodeId}</p>
      <p>Repo URL: {reposUrl}</p>
    </div>
  );
}

function OrganizationModal({ login, onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "0.5rem" }}>
        <p>Login: {login}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  useEffect(() => {
    fetch("https://api.github.com/users/hadley/orgs")
      .then((response) => response.json())
      .then((data) => setOrganizations(data))
      .catch((error) => console.log(error));
  }, []);

  const handleCardClick = (org) => {
    setSelectedOrganization(org);
  };

  const handleModalClose = () => {
    setSelectedOrganization(null);
  };

  return (
    <div style={{ backgroundColor: "#282c34", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        {organizations.map((org) => (
          <OrganizationCard
            key={org.node_id}
            avatarUrl={org.avatar_url}
            reposUrl={org.repos_url}
            nodeId={org.node_id}
            login={org.login}
            onClick={() => handleCardClick(org)}
          />
        ))}
      </div>
      {selectedOrganization && <OrganizationModal login={selectedOrganization.login} onClose={handleModalClose} />}
    </div>
  );
}

export default App;
