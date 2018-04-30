const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use('/', express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`Palette Picker server running on ${app.get('port')}.`);
});