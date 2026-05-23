const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
const friendsRoutes = require('./routes/friends');


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", require("./routes/userRoutes"));

app.get('/', (req, res) => {
  res.send('Connectere backend running!');
});

module.exports = app;