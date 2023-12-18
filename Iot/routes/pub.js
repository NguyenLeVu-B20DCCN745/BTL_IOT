const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const mysql = require('mysql2');
const ip = require('ip');
const cors = require('cors');

const myIPv4Address = ip.address('public', 'ipv4');
const mqttServer = `mqtt://${myIPv4Address}`;
const autoPumpTopic = 'auto_pump';
const manualPumpTopic = 'manual_pump';

const client = mqtt.connect(mqttServer);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456VU',
  database: 'mqtt'
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

router.use(cors());
router.use(express.json());

client.on('error', (error) => {
  console.error('MQTT error:', error);
});

// Xử lý bật/tắt bơm tự động
router.post('/auto', (req, res) => {
  const { isAutoPumpOn } = req.body;
  const action = isAutoPumpOn ? 'ON' : 'OFF';

  client.publish(autoPumpTopic, action, (err) => {
    if (err) {
      return res.status(500).json({ error: 'MQTT Publish Error' });
    }

    const currentTime = new Date();
    const query = 'INSERT INTO history_action (action, device, time) VALUES (?, ?, ?)';
    db.query(query, [action, 'AutoPump', currentTime], (error, results) => {
      if (error) {
        console.error('Failed to insert data into MySQL:', error);
      } else {
        console.log('Inserted data into MySQL');
        console.log(action);
      }
    });

    res.json({ message: `AutoPump turned ${action}` });
  });
});

// Xử lý bật/tắt bơm thủ công
router.post('/manual', (req, res) => {
  const { isManualPumpOn } = req.body;
  const action = isManualPumpOn ? 'ON' : 'OFF';

  client.publish(manualPumpTopic, action, (err) => {
    if (err) {
      return res.status(500).json({ error: 'MQTT Publish Error' });
    }

    const currentTime = new Date();
    const query = 'INSERT INTO history_action (action, device, time) VALUES (?, ?, ?)';
    db.query(query, [action, 'ManualPump', currentTime], (error, results) => {
      if (error) {
        console.error('Failed to insert data into MySQL:', error);
      } else {
        console.log('Inserted data into MySQL');
        console.log(action);
      }
    });

    res.json({ message: `ManualPump turned ${action}` });
  });
});

module.exports = router;
