const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const mysql = require('mysql2');
const cors = require('cors');
const ip = require('ip');

const myIPv4Address = ip.address('public', 'ipv4');
const mqttServer = `mqtt://${myIPv4Address}`;
const mqttTopic = 'moisture';

const mqttClient = mqtt.connect(mqttServer);
router.use(cors());

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(mqttTopic);
});

const sensorData = {};

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

mqttClient.on('message', (topic, message) => {
  if (topic === mqttTopic) {
    try {
      const data = JSON.parse(message.toString());
      sensorData.moisture_level = data.moisture;
      sensorData.dust = 0;

      const query = 'INSERT INTO sensor_data (moisture_level) VALUES (?)';
      db.query(query, [sensorData.moisture_level], (error, results) => {
        if (error) {
          console.error('Failed to insert data into MySQL:', error);
        } else {
          console.log('Inserted data into MySQL');
          console.log(sensorData);
        }
      });
      console.log(sensorData);
    } catch (error) {
      console.error('Failed to parse MQTT message:', error);
    }
  }
});

router.get('/sensor', (req, res) => {
  res.json(sensorData);
});

module.exports = router;
