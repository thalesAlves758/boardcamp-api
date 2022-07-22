import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

const PORT = process.env.PORT || 4000; /* eslint-disable-line */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
