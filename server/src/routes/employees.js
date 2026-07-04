const express = require('express');
const router = express.Router();
const pool = require('../db');

// ========== GET all employees (with search & sort) ==========
router.get('/', async (req, res) => {
    try {
        const { q, sortBy, order } = req.query;

        let sql = 'SELECT * FROM employees WHERE 1=1';
        const params = [];

        // Search (LIKE on name, empl, email)
        if (q) {
            sql += ' AND (name LIKE ? OR empl LIKE ? OR email LIKE ?)';
            const search = `%${q}%`;
            params.push(search, search, search);
        }

        // Sort (whitelist only safe columns)
        const allowedSortColumns = ['name', 'hireDate', 'salary', 'department'];
        const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// ========== GET single employee ==========
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// ========== CREATE employee ==========
router.post('/', async (req, res) => {
    try {
        const { empl, name, email, department, position, hireDate, salary, active } = req.body;

        // Check for duplicate empl or email
        const [existing] = await pool.query(
            'SELECT * FROM employees WHERE empl = ? OR email = ?',
            [empl, email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Employee ID or email already exists' });
        }

        const [result] = await pool.query(
            `INSERT INTO employees (empl, name, email, department, position, hireDate, salary, active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [empl, name, email, department, position, hireDate, salary, active !== undefined ? active : 1]
        );

        const [newEmployee] = await pool.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
        res.status(201).json(newEmployee[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// ========== UPDATE employee ==========
router.put('/:id', async (req, res) => {
    try {
        const { empl, name, email, department, position, hireDate, salary, active } = req.body;

        // Check for duplicate empl or email (excluding current)
        const [existing] = await pool.query(
            'SELECT * FROM employees WHERE (empl = ? OR email = ?) AND id != ?',
            [empl, email, req.params.id]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Employee ID or email already exists' });
        }

        await pool.query(
            `UPDATE employees 
             SET empl = ?, name = ?, email = ?, department = ?, position = ?, 
                 hireDate = ?, salary = ?, active = ?
             WHERE id = ?`,
            [empl, name, email, department, position, hireDate, salary, active, req.params.id]
        );

        const [updated] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// ========== DELETE employee ==========
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

module.exports = router;