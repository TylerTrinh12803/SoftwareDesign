// Routes/notificationRoutes.js
import express from 'express';
const router = express.Router();

// In-memory notifications data
let notifications = [
  { id: 1, title: 'Test Notification', message: 'This is a test.', unread: true },
  { id: 2, title: 'Second Notification', message: 'Another test.', unread: true }
];

// GET all notifications
router.get('/', (req, res) => {
  res.json(notifications);
});

// Dismiss all notifications
router.delete('/dismiss-all', (req, res) => {
  notifications = notifications.map(n => ({ ...n, unread: false }));
  res.send('All notifications have been marked as read.');
});

// Dismiss a single notification
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = notifications.findIndex(n => n.id === id);
  if (index === -1) {
    res.status(404).send('Notification not found');
  } else {
    notifications.splice(index, 1);
    res.send(`Notification with id ${id} has been dismissed.`);
  }
});

export default router;
