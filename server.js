let express = require('express');
let app = express();

let port = process.env.PORT || 8080;

app.use(express.static('public'))

app.get('/test/', (req, res) => {  
    res.send(`Hello World!`);
});

app.get('/', (req, res) => {  
    res.sendFile(`index.html`, {root: __dirname});
});


app.listen(port, () => {
  console.log('app listening on port:', port);
});
    