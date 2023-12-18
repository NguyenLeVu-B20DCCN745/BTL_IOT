const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

const pub = require('./routes/pub');
const sub = require('./routes/sub');
const history = require('./routes/table');
app.use(cors());

app.use('/api', pub,sub,history);
// app.use('/api/sensor',sub);
// app.use('/api/history', history);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
