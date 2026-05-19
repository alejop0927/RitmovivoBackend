import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as feedbackController from '../controllers/feedback.controller';

const router = Router();

router.get('/clase/:claseId', feedbackController.getFeedback);
router.post('/', authenticate, feedbackController.postFeedback);
router.delete('/:id', authenticate, feedbackController.deleteFeedback);

export default router;