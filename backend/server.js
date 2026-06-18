const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===========================
//  DATABASE FILE PATHS
// ===========================
const DATA_DIR = path.join(__dirname, 'data');
const productsPath = path.join(__dirname, '../frontend/src/data/products.json');
const usersPath = path.join(DATA_DIR, 'users.json');
const logsPath = path.join(DATA_DIR, 'logs.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database files
if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify({}));
}
if (!fs.existsSync(logsPath)) {
    fs.writeFileSync(logsPath, JSON.stringify({}));
}

// ===========================
//  HELPER FUNCTIONS
// ===========================
const readJSON = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return filePath === usersPath ? {} : {};
    }
};

const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Get today's date string
const getToday = () => new Date().toISOString().split('T')[0];

// ===========================
//  AUTH ROUTES
// ===========================

// Signup
app.post('/api/auth/signup', (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: 'Password must be at least 4 characters' });
        }

        const users = readJSON(usersPath);

        if (users[email]) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        users[email] = {
            email,
            password,
            name,
            createdAt: new Date().toISOString(),
            settings: {
                dailyGoal: 0,
                quitDate: null,
                currency: 'INR'
            }
        };
        writeJSON(usersPath, users);

        // Initialize empty logs
        const logs = readJSON(logsPath);
        logs[email] = [];
        writeJSON(logsPath, logs);

        const { password: _, ...safeUser } = users[email];
        res.status(201).json(safeUser);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const users = readJSON(usersPath);
        const user = users[email];

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { password: _, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Update user settings
app.put('/api/auth/settings/:email', (req, res) => {
    try {
        const users = readJSON(usersPath);
        const user = users[req.params.email];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.settings = { ...user.settings, ...req.body };
        writeJSON(usersPath, users);

        const { password: _, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// ===========================
//  PRODUCT ROUTES
// ===========================

app.get('/api/products', (req, res) => {
    try {
        const data = fs.readFileSync(productsPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read products' });
    }
});

// ===========================
//  LOG ROUTES (User-scoped)
// ===========================

// Get all logs for a user
app.get('/api/logs/:email', (req, res) => {
    try {
        const logs = readJSON(logsPath);
        res.json(logs[req.params.email] || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read logs' });
    }
});

// Add a new log
app.post('/api/logs/:email', (req, res) => {
    try {
        const newLog = req.body;
        const logs = readJSON(logsPath);

        if (!logs[req.params.email]) {
            logs[req.params.email] = [];
        }

        logs[req.params.email].push(newLog);
        writeJSON(logsPath, logs);
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save log' });
    }
});

// Delete a single log by timestamp
app.delete('/api/logs/:email/:timestamp', (req, res) => {
    try {
        const logs = readJSON(logsPath);
        const userLogs = logs[req.params.email] || [];
        logs[req.params.email] = userLogs.filter(log => log.timestamp !== decodeURIComponent(req.params.timestamp));
        writeJSON(logsPath, logs);
        res.json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete log' });
    }
});

// Delete ALL logs for a user
app.delete('/api/logs/:email', (req, res) => {
    try {
        const logs = readJSON(logsPath);
        logs[req.params.email] = [];
        writeJSON(logsPath, logs);
        res.json({ message: 'All history cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

// ===========================
//  STATS & ANALYTICS ROUTES
// ===========================

// Get summary stats for a user
app.get('/api/stats/:email', (req, res) => {
    try {
        const logs = readJSON(logsPath);
        const userLogs = logs[req.params.email] || [];
        const today = getToday();

        // Group by date
        const daily = {};
        userLogs.forEach(log => {
            if (!log.timestamp) return;
            const date = log.timestamp.split('T')[0];
            if (!daily[date]) {
                daily[date] = { date, count: 0, spent: 0, nicotine: 0, tar: 0 };
            }
            daily[date].count += 1;
            daily[date].spent += (log.custom_price || (log.average_price_per_pack / log.units_per_pack));
            daily[date].nicotine += log.nicotine_mg_per_unit;
            daily[date].tar += log.tar_mg_per_unit;
        });

        // Today's stats
        const todayStats = daily[today] || { date: today, count: 0, spent: 0, nicotine: 0, tar: 0 };

        // This week's stats (last 7 days)
        const weekDates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            weekDates.push(d.toISOString().split('T')[0]);
        }

        const weeklyData = weekDates.map(date => daily[date] || { date, count: 0, spent: 0, nicotine: 0, tar: 0 });
        const weekTotal = weeklyData.reduce((acc, d) => ({
            count: acc.count + d.count,
            spent: acc.spent + d.spent,
            nicotine: acc.nicotine + d.nicotine,
            tar: acc.tar + d.tar
        }), { count: 0, spent: 0, nicotine: 0, tar: 0 });

        // All-time
        const allTime = userLogs.reduce((acc, log) => ({
            count: acc.count + 1,
            spent: acc.spent + (log.custom_price || (log.average_price_per_pack / log.units_per_pack)),
            nicotine: acc.nicotine + log.nicotine_mg_per_unit,
            tar: acc.tar + log.tar_mg_per_unit
        }), { count: 0, spent: 0, nicotine: 0, tar: 0 });

        // Streak: consecutive days with 0 logs (from today backwards)
        let smokeFreeStreak = 0;
        const checkDate = new Date();
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (daily[dateStr] && daily[dateStr].count > 0) break;
            smokeFreeStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
            if (smokeFreeStreak > 365) break;
        }

        res.json({
            today: todayStats,
            weeklyData,
            weekTotal,
            allTime,
            smokeFreeStreak,
            totalDaysTracked: Object.keys(daily).length,
            lastLog: userLogs.length > 0 ? userLogs[userLogs.length - 1] : null
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to compute stats' });
    }
});

// ===========================
//  HEALTH MILESTONES
// ===========================

app.get('/api/health/:email', (req, res) => {
    try {
        const logs = readJSON(logsPath);
        const userLogs = logs[req.params.email] || [];

        // Find the last log timestamp
        const lastLog = userLogs.length > 0 ? userLogs[userLogs.length - 1] : null;
        const lastLogTime = lastLog ? new Date(lastLog.timestamp).getTime() : null;
        const now = Date.now();
        const hoursSinceLastLog = lastLogTime ? (now - lastLogTime) / (1000 * 60 * 60) : null;

        const milestones = [
            { hours: 0.33, title: 'Heart Rate Normalizing', description: 'Your heart rate begins to drop back to normal levels.', icon: '❤️' },
            { hours: 8, title: 'Oxygen Levels Rising', description: 'Carbon monoxide levels in your blood drop by half. Oxygen levels return to normal.', icon: '🫁' },
            { hours: 24, title: 'Heart Attack Risk Drops', description: 'Your risk of heart attack starts to decrease.', icon: '💪' },
            { hours: 48, title: 'Taste & Smell Improve', description: 'Nerve endings start to regrow. Your sense of taste and smell begin to sharpen.', icon: '👃' },
            { hours: 72, title: 'Breathing Easier', description: 'Bronchial tubes relax. Breathing becomes easier and energy levels increase.', icon: '🌬️' },
            { hours: 336, title: '2 Weeks Smoke-Free', description: 'Circulation improves. Lung function increases up to 30%.', icon: '🏃' },
            { hours: 720, title: '1 Month Milestone', description: 'Cilia regrow in lungs, reducing infection risk. Shortness of breath decreases.', icon: '🎉' },
            { hours: 2160, title: '3 Months Strong', description: 'Circulation has significantly improved. Walking becomes easier.', icon: '⭐' },
            { hours: 4320, title: '6 Month Achievement', description: 'Coughing and shortness of breath dramatically decrease. Sinus congestion reduces.', icon: '🏆' },
            { hours: 8760, title: '1 Year — Risk Halved!', description: 'Your risk of coronary heart disease is now HALF that of a smoker.', icon: '👑' },
        ];

        const enrichedMilestones = milestones.map(m => ({
            ...m,
            achieved: hoursSinceLastLog !== null && hoursSinceLastLog >= m.hours,
            progress: hoursSinceLastLog !== null ? Math.min(100, (hoursSinceLastLog / m.hours) * 100) : 0
        }));

        res.json({
            lastLogTime: lastLog?.timestamp || null,
            hoursSinceLastLog: hoursSinceLastLog ? parseFloat(hoursSinceLastLog.toFixed(2)) : null,
            milestones: enrichedMilestones
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to compute health data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log('');
    console.log('  🧠 ClearMind Backend v2.0');
    console.log(`  ✅ Server running on http://localhost:${PORT}`);
    console.log(`  📁 Data stored in: ${DATA_DIR}`);
    console.log('');
});
