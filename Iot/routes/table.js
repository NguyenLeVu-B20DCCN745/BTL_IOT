const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const cors = require('cors');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456VU',
    database: 'mqtt'
});

router.use(cors());



router.get('/history', (req, res) => {
  let page = req.query.page;  
  const limit = 10;  // Số lượng mục trên mỗi trang

  // Kiểm tra xem có tham số page không
  if (page < 1) {
    page = 1;  // Nếu page nhỏ hơn 1, đặt lại thành 1
  }

  const offset = (page - 1) * limit;

  // Truy vấn để lấy tổng số phần tử
  const countQuery = 'SELECT COUNT(*) AS total FROM history_action'; 
  db.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error executing count query: ' + countErr.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    const totalItems = countResults[0].total;

    let dataQuery = 'SELECT * FROM history_action ORDER BY time DESC';

    // Kiểm tra xem có tham số page không
    if (page) {
      dataQuery = 'SELECT * FROM history_action ORDER BY time DESC LIMIT ?, ? ';
      db.query(dataQuery, [offset, limit], (dataErr, dataResults) => {
        if (dataErr) {
          console.error('Error executing data query: ' + dataErr.stack);
          res.status(500).send('Internal Server Error');
          return;
        }

        const responseData = {
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          data: dataResults,
        };

        res.json(responseData);
      });
    } else {
      // Nếu không có tham số page, lấy tất cả dữ liệu
      db.query(dataQuery, (dataErr, dataResults) => {
        if (dataErr) {
          console.error('Error executing data query: ' + dataErr.stack);
          res.status(500).send('Internal Server Error');
          return;
        }

        const responseData = {
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / limit),
          data: dataResults,
        };

        res.json(responseData);
      });
    }
  });
});


router.get('/data', (req, res) => {
  const page = req.query.page ;  // Trang hiện tại, mặc định là trang 1
  const limit = 10;  // Số lượng mục trên mỗi trang

  // Truy vấn để lấy tổng số phần tử
  const countQuery = 'SELECT COUNT(*) AS total FROM sensor_data';
  db.query(countQuery, (countErr, countResults) => {
    if (countErr) {
      console.error('Error executing count query: ' + countErr.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    const totalItems = countResults[0].total;

    let dataQuery = 'SELECT * FROM sensor_data ORDER BY time_recorded DESC';

    // Kiểm tra xem có tham số page không
    if (page) {
      const offset = (page - 1) * limit;
      dataQuery = 'SELECT * FROM sensor_data ORDER BY time_recorded DESC LIMIT ?, ? ';
      db.query(dataQuery, [offset, limit], (dataErr, dataResults) => {
        if (dataErr) {
          console.error('Error executing data query: ' + dataErr.stack);
          res.status(500).send('Internal Server Error');
          return;
        }

        const responseData = {
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          data: dataResults,
        };

        res.json(responseData);
      });
    } else {
      // Nếu không có tham số page, lấy tất cả dữ liệu
      db.query(dataQuery, (dataErr, dataResults) => {
        if (dataErr) {
          console.error('Error executing data query: ' + dataErr.stack);
          res.status(500).send('Internal Server Error');
          return;
        }

        const responseData = {
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / limit),
          data: dataResults,
        };

        res.json(responseData);
      });
    }
  });
});

router.get('/search', (req, res) => {
  const dataType = req.query.dataType || ''; // Loại dữ liệu là 'Data' hoặc 'Action'

  if (dataType === 'Action') {
    // Truy vấn cho loại 'Action'
    const actionTypeSearch = req.query.actionType || '';
    const deviceTypeSearch = req.query.deviceType || '';

    const actionQuery = `
      SELECT * FROM history_action
      WHERE action LIKE ? AND device LIKE ?
    `;

    const actionValues = [
      `%${actionTypeSearch}%`,
      `%${deviceTypeSearch}%`,
    ];

    db.query(actionQuery, actionValues, (actionErr, actionResults) => {
      if (actionErr) {
        console.error('Error executing action query: ' + actionErr.stack);
        res.status(500).send('Internal Server Error');
        return;
      }

      const responseData = {
        data: actionResults,
      };

      res.json(responseData);
    });
  } else {
    // Truy vấn cho loại 'Data'
    //const temperatureSearch = req.query.temperature || '';
    //const humiditySearch = req.query.humidity || '';
    const moistureSearch = req.query.moisture_level || '';
    const timeSearch = req.query.time_recorded || '';

    const dataQuery = `
      SELECT * FROM sensor_data
      WHERE moisture_level LIKE ? AND time_recorded LIKE ?
    `;

    const dataValues = [
      //`%${temperatureSearch}%`,
      //`%${humiditySearch}%`,
      `%${moistureSearch}%`,
      `%${timeSearch}%`,
    ];

    db.query(dataQuery, dataValues, (dataErr, dataResults) => {
      if (dataErr) {
        console.error('Error executing data query: ' + dataErr.stack);
        res.status(500).send('Internal Server Error');
        return;
      }

      const responseData = {
        data: dataResults,
      };

      res.json(responseData);
    });
  }
});

router.get('/count', (req, res) => {
  const sql = `
    SELECT 
      COUNT(CASE WHEN action = 'ON' AND device = 'AutoPump' THEN 1 END) AS soLuongON_AUTO,
      COUNT(CASE WHEN action = 'OFF' AND device = 'AutoPump' THEN 1 END) AS soLuongOFF_AUTO,
      COUNT(CASE WHEN action = 'ON' AND device = 'ManualPump' THEN 1 END) AS soLuongON_MANUAL,
      COUNT(CASE WHEN action = 'OFF' AND device = 'ManualPump' THEN 1 END) AS soLuongOFF_MANUAL
    FROM history_action
    WHERE action IN ('ON', 'OFF') AND device IN ('AutoPump', 'ManualPump');
  `;

  // Thực hiện truy vấn SQL
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Trả về kết quả truy vấn dưới dạng JSON
      res.json(results[0]);
    }
  });
});
module.exports = router;
