import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Target, Users, Trophy, History, Plus, Settings } from 'lucide-react';

// API base URL
const API_BASE = 'http://localhost:5001/api';

// Navigation Component
const Navigation = ({ currentGroup }) => {
  return (
    <nav className="card" style={{ marginBottom: '24px' }}>
      <div className="flex flex-between">
        <div className="flex gap-4">
          <Link to="/" className="btn btn-secondary">
            <Users size={20} />
            Groups
          </Link>
          {currentGroup && (
            <>
              <Link to={`/group/${currentGroup.id}`} className="btn btn-secondary">
                <Trophy size={20} />
                Leaderboard
              </Link>
              <Link to={`/group/${currentGroup.id}/snipes`} className="btn btn-secondary">
                <Target size={20} />
                Record Snipe
              </Link>
              <Link to={`/group/${currentGroup.id}/history`} className="btn btn-secondary">
                <History size={20} />
                History
              </Link>
            </>
          )}
        </div>
        {currentGroup && (
          <Link to={`/group/${currentGroup.id}/settings`} className="btn btn-secondary">
            <Settings size={20} />
            Settings
          </Link>
        )}
      </div>
    </nav>
  );
};

// Groups List Component
const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      console.log('Fetching groups from:', `${API_BASE}/groups`);
      const response = await axios.get(`${API_BASE}/groups`);
      console.log('Groups response:', response.data);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      console.log('Creating group:', newGroupName);
      const response = await axios.post(`${API_BASE}/groups`, { name: newGroupName });
      console.log('Group created:', response.data);
      setNewGroupName('');
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Loading groups...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="text-center mb-4">SNIPES Game</h1>
        <p className="text-center mb-4">Track your campus photo snipes and compete on the leaderboard!</p>
        
        <form onSubmit={createGroup} className="mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter group name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button type="submit" className="btn">
              <Plus size={20} />
              Create Group
            </button>
          </div>
        </form>

        <div className="grid grid-3">
          {groups.map((group) => (
            <Link key={group.id} to={`/group/${group.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{group.name}</h3>
              <p>{group.players.length} players</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Group Context
const GroupContext = React.createContext();

// Group Layout Component
const GroupLayout = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
  }, [groupId, fetchGroup]);

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${API_BASE}/groups/${groupId}`);
      setGroup(response.data);
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Loading group...</h2>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Group not found</h2>
        </div>
      </div>
    );
  }

  return (
    <GroupContext.Provider value={{ group, setGroup, fetchGroup }}>
      <div className="container">
        <Navigation currentGroup={group} />
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/snipes" element={<RecordSnipe />} />
          <Route path="/history" element={<GameHistory />} />
          <Route path="/settings" element={<GroupSettings />} />
        </Routes>
      </div>
    </GroupContext.Provider>
  );
};

// Leaderboard Component
const Leaderboard = () => {
  const { group } = React.useContext(GroupContext);
  
  const sortedPlayers = [...group.players].sort((a, b) => b.points - a.points);

  return (
    <div className="card">
      <h2 className="text-center mb-4">{group.name} - Leaderboard</h2>
      
      <div>
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="leaderboard-item">
            <div className="leaderboard-rank">#{index + 1}</div>
            <div className="leaderboard-info">
              <div className="leaderboard-name">{player.name}</div>
              <div className="leaderboard-stats">
                <span>Kills: {player.kills}</span>
                <span>Victims: {player.victims}</span>
              </div>
            </div>
            <div className="leaderboard-points">
              {player.points > 0 ? '+' : ''}{player.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Record Snipe Component
const RecordSnipe = () => {
  const { group, fetchGroup } = React.useContext(GroupContext);
  const [sniperId, setSniperId] = useState('');
  const [victimId, setVictimId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sniperId || !victimId || sniperId === victimId) return;

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/snipes`, {
        groupId: group.id,
        sniperId,
        victimId
      });
      
      setSniperId('');
      setVictimId('');
      fetchGroup();
    } catch (error) {
      console.error('Error recording snipe:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-center mb-4">Record a Snipe</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sniper</label>
          <select
            className="form-control"
            value={sniperId}
            onChange={(e) => setSniperId(e.target.value)}
            required
          >
            <option value="">Select sniper...</option>
            {group.players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Victim</label>
          <select
            className="form-control"
            value={victimId}
            onChange={(e) => setVictimId(e.target.value)}
            required
          >
            <option value="">Select victim...</option>
            {group.players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn" disabled={submitting || !sniperId || !victimId || sniperId === victimId}>
          <Target size={20} />
          {submitting ? 'Recording...' : 'Record Snipe'}
        </button>
      </form>
    </div>
  );
};

// Game History Component
const GameHistory = () => {
  const { group } = React.useContext(GroupContext);
  const [snipes, setSnipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnipes();
  }, [group.id, fetchSnipes]);

  const fetchSnipes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/groups/${group.id}/snipes`);
      setSnipes(response.data.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching snipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <h2>Loading history...</h2>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-center mb-4">Game History</h2>
      
      {snipes.length === 0 ? (
        <p className="text-center">No snipes recorded yet!</p>
      ) : (
        <div>
          {snipes.map((snipe) => (
            <div key={snipe.id} className="p-4" style={{ borderBottom: '1px solid #e9ecef' }}>
              <div className="flex flex-between">
                <div>
                  <strong>{snipe.sniperName}</strong> sniped <strong>{snipe.victimName}</strong>
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {new Date(snipe.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Group Settings Component
const GroupSettings = () => {
  const { group, fetchGroup } = React.useContext(GroupContext);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [killPoints, setKillPoints] = useState(group.settings.killPoints);
  const [deathPoints, setDeathPoints] = useState(group.settings.deathPoints);
  const [saving, setSaving] = useState(false);

  const addPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      await axios.post(`${API_BASE}/groups/${group.id}/players`, {
        name: newPlayerName
      });
      setNewPlayerName('');
      fetchGroup();
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const removePlayer = async (playerId) => {
    try {
      await axios.delete(`${API_BASE}/groups/${group.id}/players/${playerId}`);
      fetchGroup();
    } catch (error) {
      console.error('Error removing player:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/groups/${group.id}/settings`, {
        killPoints: parseInt(killPoints),
        deathPoints: parseInt(deathPoints)
      });
      fetchGroup();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3 className="mb-4">Player Management</h3>
        
        <form onSubmit={addPlayer} className="mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              className="form-control"
              placeholder="Player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <button type="submit" className="btn">
              <Plus size={20} />
              Add Player
            </button>
          </div>
        </form>

        <div>
          {group.players.map((player) => (
            <div key={player.id} className="flex flex-between p-4" style={{ borderBottom: '1px solid #e9ecef' }}>
              <span>{player.name}</span>
              <button
                onClick={() => removePlayer(player.id)}
                className="btn btn-danger"
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Scoring Settings</h3>
        
        <div className="form-group">
          <label>Points per Kill</label>
          <input
            type="number"
            className="form-control"
            value={killPoints}
            onChange={(e) => setKillPoints(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Points per Death</label>
          <input
            type="number"
            className="form-control"
            value={deathPoints}
            onChange={(e) => setDeathPoints(e.target.value)}
          />
        </div>

        <button onClick={saveSettings} className="btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupsList />} />
        <Route path="/group/:groupId/*" element={<GroupLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
