import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/index.css';

function DashboardPage() {
  const { user } = useAuth();
  const [transport, setTransport] = useState('');
  const [hotel, setHotel] = useState('');
  const [food, setFood] = useState('');
  const [activities, setActivities] = useState('');

  const totalBudget = useMemo(() => {
    const values = [transport, hotel, food, activities].map((value) => Number(value) || 0);
    return values.reduce((sum, value) => sum + value, 0);
  }, [transport, hotel, food, activities]);

  if (!user?.isAdmin) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="section" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell dashboard-page">
      <Navbar activePage="dashboard" />
      
      <main className="section">
        <header className="section-heading" style={{ marginBottom: '40px' }}>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Welcome back, {user.name}</h1>
          <p>Manage travel budgets and oversee platform activities.</p>
        </header>

        <section className="budget" id="dashboard" style={{ marginTop: 0 }}>
          <div className="budget-panel">
            <div>
              <p className="eyebrow">Budget Estimator Tool</p>
              <h3>Calculate travel expenses</h3>
            </div>
            <div className="budget-inputs">
              <label>
                Transport (₹)
                <input
                  type="number"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  placeholder="Enter amount"
                />
              </label>
              <label>
                Hotel (₹)
                <input
                  type="number"
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                  placeholder="Enter amount"
                />
              </label>
              <label>
                Food (₹)
                <input
                  type="number"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="Enter amount"
                />
              </label>
              <label>
                Activities (₹)
                <input
                  type="number"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Enter amount"
                />
              </label>
            </div>
            <button className="calc-btn" type="button">
              Save Report
            </button>
          </div>
          <div className="budget-summary">
            <p>Total Estimated Budget</p>
            <strong>₹ {totalBudget.toLocaleString()}</strong>
            <span>Admin View: Reviewing estimated costs for the current cycle.</span>
          </div>
        </section>

        {/* Add more admin features here to make it feel like a real dashboard */}
        <section className="section" style={{ marginTop: '60px' }}>
          <h3>Platform Overview</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <p>User Growth</p>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+24%</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <p>Active Itineraries</p>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>142</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏨</div>
              <p>Hotel Bookings</p>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>89</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>Admin Panel v1.0</div>
        <div>TravelSphere Internal</div>
      </footer>
    </div>
  );
}

export default DashboardPage;

