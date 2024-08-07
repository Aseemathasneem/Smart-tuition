// routes/session.route.js
import express from 'express';
import { markAttendance } from '../controllers/session.controller.js';


const router = express.Router();

router.put('/:sessionId/leave', markAttendance);

export default router;
