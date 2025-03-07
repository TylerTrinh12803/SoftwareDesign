import express from 'express';
//import { db } from '../config/db.js';  // Ensure the path is correct

const router = express.Router();

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notifications');
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Dismiss a single notification
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
        if (result.affectedRows) {
            res.send(`Notification with id ${req.params.id} has been dismissed.`);
        } else {
            res.status(404).send('Notification not found');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error dismissing notification' });
    }
});

// Dismiss all notifications
router.delete('/dismiss-all', async (req, res) => {
    try {
        await db.query('UPDATE notifications SET unread = false');
        res.send('All notifications have been marked as read.');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error marking all notifications as read' });
    }
});

export default router;
