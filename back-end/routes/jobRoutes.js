const express = require('express');
const Job = require('../models/Job');
const authenticateToken = require('../middleware/auth'); 
const upload = require('../middleware/upload');
const path = require('path');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        
        const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching jobs', error: error.message });
    }
});

router.post('/', authenticateToken, upload.single('resume'), async (req, res) => {
    try {
        const { company, role, status, statusHistory } = req.body;
        const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newJob = new Job({
            company,
            role,
            status,
            resumeUrl,
            userId: req.user.id, 
            statusHistory: JSON.parse(statusHistory) 
        });
        await newJob.save();

        res.status(201).json({ message: 'Job added successfully', job: newJob });
    } catch (error) {
        
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
        res.status(400).json({ message: 'Error adding job', error: error.message });
    }
});

router.put('/:id', authenticateToken, upload.single('resume'), async (req, res) => {
    try {
        const { id } = req.params;
        const { company, role, status, statusHistory } = req.body;

        const job = await Job.findOne({ _id: id, userId: req.user.id });
        if (!job) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting newly uploaded file:', err);
                });
            }
            return res.status(404).json({ message: 'Job not found or not authorized' });
        }

        if (req.file && job.resumeUrl) {
            const oldResumePath = path.join(__dirname, '..', job.resumeUrl);
            if (fs.existsSync(oldResumePath)) {
                fs.unlink(oldResumePath, (err) => {
                    if (err) console.error('Error deleting old resume file:', err);
                });
            }
        }

        job.company = company;
        job.role = role;
        job.status = status;
        job.statusHistory = JSON.parse(statusHistory); 
        if (req.file) {
            job.resumeUrl = `/uploads/${req.file.filename}`;
        }
        job.updatedAt = Date.now();

        await job.save();

        res.json({ message: 'Job updated successfully', job: job });
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting newly uploaded file:', err);
            });
        }
        res.status(400).json({ message: 'Error updating job', error: error.message });
    }
});

// Delete a job application
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or not authorized' });
        }

        if (job.resumeUrl) {
            const resumePath = path.join(__dirname, '..', job.resumeUrl);
            if (fs.existsSync(resumePath)) {
                fs.unlink(resumePath, (err) => {
                    if (err) console.error('Error deleting resume file:', err);
                });
            }
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting job', error: error.message });
    }
});

module.exports = router;
