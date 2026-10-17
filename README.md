# મહુવા APMC (MERN)

## ચલાવવાની રીત
1. MongoDB ચાલુ રાખો.
2. `server/.env.example` ને `server/.env` નામે કોપી કરી વિગતો ભરો.
3. `npm run install-all`
4. ટર્મિનલ 1: `npm run server` (અથવા `cd server && npm run dev`) | ટર્મિનલ 2: `npm run client`
5. એડમિન પાસવર્ડ બદલવો હોય: `.env` બદલી `cd server && npm run reset-admin`

## સ્ટ્રક્ચર
```
server/
  server.js            શરૂઆત (env, DB, socket, listen)
  app.js               Express app + રૂટ જોડાણ
  socket.js            Socket.io (લાઈવ બોલી)
  config/settings.js   કમિશન / ફી
  models/              Mongoose મોડેલ (User, Crop, Bid, Patti, Bill ...)
  middleware/          auth (JWT + રોલ), wrap, upload (ફોટા)
  routes/              auth, public, crops, trader, admin, agent, payment
  services/bids.js     બોલી પેનલ લોજિક
  utils/               helpers, seedAdmin
  scripts/reset-admin.js
client/src/
  main.jsx, App.jsx    એન્ટ્રી અને રૂટિંગ
  api.js               fetch + લોગિન (દરેક ટેબનું અલગ)
  hooks/useLoad.js     ડેટા લોડ હૂક
  constants.js
  pages/               Home, Auth, Farmer, Trader, Admin, AgentDash
  components/          Navbar, Guard, Msg, Pattis, Scanner, TrendChart,
                       PayButton, BidPanel, AdminAgents
  style.css
```
