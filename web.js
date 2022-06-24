import express from 'express';
import bodyParser from 'body-parser';
import router from './server/routes';
import logger from './server/middleware/logger';

const app = express();

app.use(bodyParser.json());
app.use('/', router);

app.listen(process.env.PORT || 8080);
