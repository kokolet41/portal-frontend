import React, { useState, useEffect } from 'react';

function App() {
  // 1. State Management
  const [view, setView] = useState('list'); // 'list' or 'profile'
  const [clients, setClients] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch Directory List on Component Mount
  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(process.env.REACT_APP_API_LIST_URL);
      if (!response.ok) throw new Error("Backend connection unstable.");
      const data = await response.json();
      setClients(data);
      setView('list');
    } catch (err) {
      console.error(err);
      setError("Failed to fetch client records from CodeIgniter API.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Selected Client's Financial Ledger
  const fetchClientProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_VIEW_URL}/${id}`);
      if (!response.ok) throw new Error("Relational stream broken.");
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setActiveProfile(data);
      setView('profile');
    } catch (err) {
      console.error(err);
      setError("Failed to pull financial ledger profile for this account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'system-ui', paddingBottom: '60px' }}>
      
      {/* Top Header Navbar */}
      <nav style={{ backgroundColor: '#6f42c1', padding: '15px 0', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>⚛️ React.js Microservice Node</span>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Relational API Consumer</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 15px' }}>
        
        {/* Status Messages */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#6c757d' }}>
            <p style={{ marginTop: '15px' }}>Asynchronously streaming from CodeIgniter endpoint...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb', marginBottom: '20px' }}>
            ⚠️ {error} <br /><small>Ensure your local XAMPP stack is actively serving database outputs.</small>
          </div>
        )}

        {/* VIEW 1: MAIN DIRECTORY TABLE LAYOUT */}
        {!loading && !error && view === 'list' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: '#212529', margin: 0, fontWeight: 'bold' }}>Corporate Directory</h2>
                <p style={{ color: '#6c757d', margin: '4px 0 0 0' }}>Click any client account name to mount their relational invoices ledger state.</p>
              </div>
              <button onClick={fetchDirectory} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#6f42c1', border: '1px solid #6f42c1', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                🔄 Refresh Feeds
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', color: '#495057' }}>
                    <th style={{ padding: '12px 16px' }}>ID</th>
                    <th style={{ padding: '12px 16px' }}>Client Name</th>
                    <th style={{ padding: '12px 16px' }}>Company Name</th>
                    <th style={{ padding: '12px 16px' }}>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#6c757d' }}>{client.id}</td>
                      <td style={{ padding: '16px' }}>
                        <button 
                          onClick={() => fetchClientProfile(client.id)}
                          style={{ background: 'none', border: 'none', color: '#0d6efd', padding: 0, font: 'inherit', cursor: 'pointer', fontWeight: '600' }}
                        >
                          {client.name}
                        </button>
                      </td>
                      <td style={{ padding: '16px', color: '#495057' }}>{client.company}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', backgroundColor: client.status === 'Active' ? '#198754' : '#dc3545' }}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* VIEW 2: DYNAMIC RELATIONAL BILLING LEDGER */}
        {!loading && !error && view === 'profile' && activeProfile && (
          <div>
            <button onClick={() => setView('list')} style={{ padding: '6px 12px', backgroundColor: '#fff', color: '#6c757d', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontWeight: '500' }}>
              &larr; Return to Directory
            </button>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              
              {/* Account Profile Sidebar Card */}
              <div style={{ flex: '1 1 300px', backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #6f42c1', height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#212529', fontWeight: 'bold' }}>{activeProfile.client.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 20px 0' }}>Corporate Metadata File</p>
                <div style={{ marginBottom: '12px' }}><strong style={{ fontSize: '0.9rem', color: '#495057' }}>Company</strong><span style={{ display: 'block', color: '#6c757d', marginTop: '2px' }}>{activeProfile.client.company}</span></div>
                <div style={{ marginBottom: '12px' }}><strong style={{ fontSize: '0.9rem', color: '#495057' }}>Email Address</strong><span style={{ display: 'block', color: '#6c757d', marginTop: '2px' }}>{activeProfile.client.email}</span></div>
                <div style={{ marginBottom: '20px' }}><strong style={{ fontSize: '0.9rem', color: '#495057' }}>Phone Contact</strong><span style={{ display: 'block', color: '#6c757d', marginTop: '2px' }}>{activeProfile.client.phone}</span></div>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', backgroundColor: activeProfile.client.status === 'Active' ? '#198754' : '#dc3545' }}>
                  Account Status: {activeProfile.client.status}
                </span>
              </div>

              {/* Related Invoices Balance Spreadsheet Ledger */}
              <div style={{ flex: '2 1 600px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #dee2e6', fontWeight: 'bold', color: '#212529', backgroundColor: '#fff' }}>
                  📊 Accounting Ledgers & Outstanding Metrics
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', color: '#495057' }}>
                      <th style={{ padding: '12px 24px' }}>Invoice Number</th>
                      <th style={{ padding: '12px 24px' }}>Total Amount</th>
                      <th style={{ padding: '12px 24px' }}>Amount Paid</th>
                      <th style={{ padding: '12px 24px' }}>Balance Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProfile.invoices.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#6c757d' }}>No active financial receipts cataloged for this account node.</td>
                      </tr>
                    ) : (
                      activeProfile.invoices.map(inv => {
                        const amt = parseFloat(inv.amount) || 0;
                        const paid = parseFloat(inv.amount_paid) || 0;
                        const outstanding = (amt - paid).toFixed(2);
                        
                        return (
                          <tr key={inv.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ padding: '16px 24px', fontWeight: '600', color: '#6f42c1' }}>
                              {inv.invoice_number}
                            </td>
                            <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>
                              ₦{amt.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </td>
                            <td style={{ padding: '16px 24px', color: '#198754', fontWeight: '500' }}>
                              ₦{paid.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </td>
                            <td style={{ padding: '16px 24px', color: '#dc3545', fontWeight: 'bold' }}>
                              ₦{parseFloat(outstanding).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
