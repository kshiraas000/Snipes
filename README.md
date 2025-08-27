# SNIPES Game 🎯

A web application for tracking campus photo snipes and competing on leaderboards! Perfect for friend groups who love taking sneaky photos of each other around campus.

## Features

### 🎮 Core Game Features
- **Player Management**: Add/remove players in each group
- **Snipe Recording**: Simple form to record who sniped whom
- **Automatic Scoring**: 
  - Each kill = +50 points
  - Each death = -50 points
  - Customizable scoring system
- **Dynamic Leaderboard**: Sorted by points, showing kills, victims, and total score
- **Game History**: Complete feed of all snipe events with timestamps

### 🏗️ Technical Features
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Leaderboard updates instantly when snipes are recorded
- **Group Management**: Create multiple groups for different friend circles
- **Mobile Friendly**: Works perfectly on phones and tablets

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd snipes-game
   npm install
   cd client
   npm install
   cd ..
   ```

2. **Start the development servers:**
   ```bash
   # Terminal 1 - Start backend server
   npm run dev
   
   # Terminal 2 - Start frontend (in a new terminal)
   npm run client
   ```

3. **Open your browser:**
   - Backend API: http://localhost:5000
   - Frontend App: http://localhost:3000

## Usage

### Getting Started
1. **Create a Group**: Start by creating a new group for your friend circle
2. **Add Players**: Add all your friends to the group
3. **Record Snipes**: Use the "Record Snipe" page to log when someone gets sniped
4. **View Leaderboard**: Check the leaderboard to see who's winning!

### Default Data
The app comes pre-loaded with the "Biryani Baes SNIPES" group and all the players from your current manual system, so you can start using it immediately!

## API Endpoints

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get specific group
- `POST /api/groups` - Create new group

### Players
- `POST /api/groups/:groupId/players` - Add player to group
- `DELETE /api/groups/:groupId/players/:playerId` - Remove player

### Snipes
- `POST /api/snipes` - Record a snipe
- `GET /api/groups/:groupId/snipes` - Get snipes for a group

### Settings
- `PUT /api/groups/:groupId/settings` - Update scoring settings

## Project Structure

```
snipes-game/
├── server.js              # Express backend server
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## Customization

### Scoring System
You can customize the scoring system in the group settings:
- Change points per kill
- Change points per death
- Settings apply to all future snipes

### Styling
The app uses modern CSS with:
- Gradient backgrounds
- Card-based layout
- Smooth hover animations
- Responsive design
- Mobile-first approach

## Deployment

### Production Build
```bash
# Build the React app
cd client
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

## Contributing

Feel free to contribute to this project! Some ideas:
- Add photo upload functionality
- Implement user authentication
- Add notifications for new snipes
- Create mobile app versions
- Add more game modes

## License

MIT License - feel free to use this for your own SNIPES games!

---

**Happy Sniping! 🎯📸**
