import { csrfProtection } from '../app';
import authController from '../auth/controller';
import express from 'express';
import projectController from '../controllers/project.controller';
import flagController from '../controllers/flag.controller';
import evalController from '../controllers/eval.controller';

const router = express.Router();

router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


router.use('/auth', authController);
router.use('/projects', projectController);



router.use('/', flagController);
router.use('/', evalController);

export default router;
