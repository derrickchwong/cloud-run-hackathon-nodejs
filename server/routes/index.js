import express from 'express';
import controller from '../controllers';

const router = express.Router();

router.route('/')
  .get(controller.get)
  .post(controller.action);

export default router;
