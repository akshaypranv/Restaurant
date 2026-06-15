const db = require('../config/db');

// POST /api/v1/contact - Public contact submission
const createSubmission = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const queryStr = `
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, email, subject, message];

    const result = await db.query(queryStr, values);

    return res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/contact - Admin list all submissions
const getSubmissions = async (req, res, next) => {
  try {
    const queryStr = `
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC;
    `;
    const result = await db.query(queryStr);

    return res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/contact/:id/read - Admin mark submission as read
const markAsRead = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const queryStr = `
      UPDATE contact_submissions
      SET read = true
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(queryStr, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found',
        code: 'NOT_FOUND'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  markAsRead
};
