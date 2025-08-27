const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// In-memory data storage (in production, use a database)
let groups = {};
let snipes = [];

// Initialize with the Biryani Baes group and players from the image
const initializeDefaultGroup = () => {
  const defaultGroupId = 'biryani-baes';
  groups[defaultGroupId] = {
    id: defaultGroupId,
    name: 'Biryani Baes SNIPES',
    players: [
      { id: 'anvita', name: 'Anvita', kills: 10, victims: 9, points: 50 },
      { id: 'aashna', name: 'Aashna', kills: 9, victims: 6, points: 150 },
      { id: 'hazel', name: 'Hazel', kills: 5, victims: 10, points: -250 },
      { id: 'joel', name: 'Joel', kills: 1, victims: 3, points: -100 },
      { id: 'luisa', name: 'Luisa', kills: 2, victims: 8, points: -200 },
      { id: 'niki', name: 'Niki', kills: 14, victims: 8, points: 250 },
      { id: 'patrick', name: 'Patrick', kills: 5, victims: 9, points: -200 },
      { id: 'riya', name: 'Riya', kills: 21, victims: 8, points: 650 },
      { id: 'sameeh', name: 'Sameeh', kills: 10, victims: 12, points: -100 },
      { id: 'sara', name: 'Sara', kills: 1, victims: 9, points: -450 },
      { id: 'shrina', name: 'Shrina', kills: 17, victims: 7, points: 500 }
    ],
    settings: {
      killPoints: 50,
      deathPoints: -50
    }
  };
};

// Initialize default data
initializeDefaultGroup();

// API Routes

// Get all groups
app.get('/api/groups', (req, res) => {
  res.json(Object.values(groups));
});

// Get specific group
app.get('/api/groups/:groupId', (req, res) => {
  const group = groups[req.params.groupId];
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }
  res.json(group);
});

// Create new group
app.post('/api/groups', (req, res) => {
  const { name } = req.body;
  const groupId = uuidv4();
  
  groups[groupId] = {
    id: groupId,
    name,
    players: [],
    settings: {
      killPoints: 50,
      deathPoints: -50
    }
  };
  
  res.status(201).json(groups[groupId]);
});

// Add player to group
app.post('/api/groups/:groupId/players', (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;
  
  if (!groups[groupId]) {
    return res.status(404).json({ error: 'Group not found' });
  }
  
  const playerId = uuidv4();
  const newPlayer = {
    id: playerId,
    name,
    kills: 0,
    victims: 0,
    points: 0
  };
  
  groups[groupId].players.push(newPlayer);
  res.status(201).json(newPlayer);
});

// Remove player from group
app.delete('/api/groups/:groupId/players/:playerId', (req, res) => {
  const { groupId, playerId } = req.params;
  
  if (!groups[groupId]) {
    return res.status(404).json({ error: 'Group not found' });
  }
  
  groups[groupId].players = groups[groupId].players.filter(
    player => player.id !== playerId
  );
  
  res.json({ message: 'Player removed successfully' });
});

// Record a snipe
app.post('/api/snipes', (req, res) => {
  const { groupId, sniperId, victimId } = req.body;
  
  if (!groups[groupId]) {
    return res.status(404).json({ error: 'Group not found' });
  }
  
  const sniper = groups[groupId].players.find(p => p.id === sniperId);
  const victim = groups[groupId].players.find(p => p.id === victimId);
  
  if (!sniper || !victim) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  // Update player stats
  sniper.kills += 1;
  sniper.points += groups[groupId].settings.killPoints;
  
  victim.victims += 1;
  victim.points += groups[groupId].settings.deathPoints;
  
  // Record the snipe
  const snipe = {
    id: uuidv4(),
    groupId,
    sniperId,
    sniperName: sniper.name,
    victimId,
    victimName: victim.name,
    timestamp: new Date().toISOString()
  };
  
  snipes.push(snipe);
  
  res.status(201).json(snipe);
});

// Get snipes for a group
app.get('/api/groups/:groupId/snipes', (req, res) => {
  const { groupId } = req.params;
  const groupSnipes = snipes.filter(snipe => snipe.groupId === groupId);
  res.json(groupSnipes);
});

// Update group settings
app.put('/api/groups/:groupId/settings', (req, res) => {
  const { groupId } = req.params;
  const { killPoints, deathPoints } = req.body;
  
  if (!groups[groupId]) {
    return res.status(404).json({ error: 'Group not found' });
  }
  
  groups[groupId].settings = {
    killPoints: killPoints || groups[groupId].settings.killPoints,
    deathPoints: deathPoints || groups[groupId].settings.deathPoints
  };
  
  res.json(groups[groupId].settings);
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
