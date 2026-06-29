const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Mock database
const users = [];

// ==========================================
// DEVELOPER PERSONA: Application Bug
// ==========================================
app.get('/api/dev-data', (req, res) => {
    // BUG: Trying to access a property of a null object
    // AI will heal this by adding a null check or fixing the data source.
    const userConfig = {}; // AI Auto-Healed: Default fallback initialized
    
    try {
        const theme = userConfig.theme; // This throws a TypeError
        res.json({ theme });
    } catch (error) {
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// ==========================================
// QA PERSONA: Schema/Test Mismatch
// ==========================================
app.post('/api/users', (req, res) => {
    const { username, email, age } = req.body;

    // VALIDATION: This simulates a recent API change where 'age' became required.
    if (!username || !email || !age) {
        return res.status(400).json({ 
            error: "Missing required fields.",
            requiredFields: ["username", "email", "age"],
            providedFields: Object.keys(req.body)
        });
    }

    const newUser = { id: users.length + 1, username, email, age };
    users.push(newUser);
    res.status(201).json(newUser);
});

// ==========================================
// DASHBOARD: Platform Stats API
// ==========================================
app.get('/api/stats', (req, res) => {
    const os = require('os');
    
    // Get real network interfaces
    const nets = os.networkInterfaces();
    let localIp = '127.0.0.1';
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
            }
        }
    }

    // Real memory calculation
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

    // Real CPU load approximation (1 minute avg)
    const cpuLoad = Math.min(100, Math.round(os.loadavg()[0] * 10));

    const servers = [
        {
            id: 'local-node-master',
            type: 'Application (Real)',
            status: 'Healthy',
            cpu: cpuLoad,
            memory: usedMemPercent,
            bandwidth: `${Math.floor(Math.random() * 50) + 150} Mbps`, // Live simulated
            latency: `${Math.floor(Math.random() * 20) + 10} ms`,
            ports: `TCP: 3000, 80`,
            os: `${os.type()} ${os.release()}`,
            protocols: `IPv4: ${localIp}`
        },
        {
            id: 'eu-west-db-master',
            type: 'Database (Mock)',
            status: 'Warning',
            cpu: Math.floor(Math.random() * 40) + 50, 
            memory: Math.floor(Math.random() * 10) + 80, 
            bandwidth: `${Math.floor(Math.random() * 100) + 300} Mbps`,
            latency: `${Math.floor(Math.random() * 5) + 2} ms`,
            ports: 'TCP: 5432',
            os: 'Ubuntu 20.04 LTS',
            protocols: 'PostgreSQL Wire'
        },
        {
            id: 'ap-south-cache-01',
            type: 'Cache (Mock)',
            status: 'Healthy',
            cpu: Math.floor(Math.random() * 15) + 5,
            memory: Math.floor(Math.random() * 15) + 60,
            bandwidth: `${Math.floor(Math.random() * 200) + 500} Mbps`,
            latency: `${Math.floor(Math.random() * 2) + 1} ms`,
            ports: 'TCP: 6379',
            os: 'Alpine Linux v3.18',
            protocols: 'RESP (Redis)'
        },
        {
            id: 'us-east-worker-02',
            type: 'Queue Worker (Mock)',
            status: 'Healthy',
            cpu: Math.floor(Math.random() * 60) + 20,
            memory: Math.floor(Math.random() * 30) + 40,
            bandwidth: `${Math.floor(Math.random() * 80) + 50} Mbps`,
            latency: `${Math.floor(Math.random() * 15) + 5} ms`,
            ports: 'TCP: 5672',
            os: 'Debian 11',
            protocols: 'AMQP'
        }
    ];
    res.json(servers);
});

// ==========================================
// DASHBOARD: Comprehensive Testing Matrix API
// ==========================================
app.get('/api/pipelines', (req, res) => {
    // Read the dashboard-data.json to intelligently fake pipeline states
    const fs = require('fs');
    const dataPath = path.join(__dirname, '../ai-agent/dashboard-data.json');
    let logs = [];
    if (fs.existsSync(dataPath)) {
        logs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    const hasAppHeal = logs.some(l => l.type === 'app-heal');
    const hasTestHeal = logs.some(l => l.type === 'test-heal');
    const hasPerfHeal = logs.some(l => l.type === 'perf-heal');

    const history = [
        { 
            id: "DEV-8934", 
            date: "Backend Services", 
            targetServer: "local-node-master",
            env: "Staging Environment",
            nodes: [
                { category: "Code Quality", name: "Unit Testing", status: hasAppHeal ? "success" : "failed" },
                { category: "Code Quality", name: "Integration Testing", status: hasAppHeal ? "success" : "pending" },
                { category: "Performance", name: "Performance Testing", status: hasPerfHeal ? "success" : "failed" },
                { category: "Security", name: "Security Testing", status: "success" },
                { category: "Resilience", name: "Reliability Testing", status: "success" }
            ] 
        },
        { 
            id: "QA-8935", 
            date: "Frontend Portal", 
            targetServer: "eu-west-db-master",
            env: "QA Environment",
            nodes: [
                { category: "System", name: "Regression Testing", status: hasTestHeal ? "success" : "failed" },
                { category: "System", name: "Functional Testing", status: hasTestHeal ? "success" : "pending" },
                { category: "Performance", name: "Load Testing", status: "success" },
                { category: "Resilience", name: "Failover Testing", status: "success" },
                { category: "Security", name: "Penetration Testing", status: "success" }
            ] 
        }
    ];

    res.json(history);
});

app.get('/api/interventions', (req, res) => {
    const fs = require('fs');
    const dataPath = path.join(__dirname, '../ai-agent/dashboard-data.json');
    if (fs.existsSync(dataPath)) {
        res.json(JSON.parse(fs.readFileSync(dataPath, 'utf8')));
    } else {
        res.json([]);
    }
});

// ==========================================
// DASHBOARD: Interactive AI Chat API
// ==========================================
app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    const { execSync } = require('child_process');
    const path = require('path');

    let responseMessage = "I am monitoring the pipelines. Everything looks good!";

    const p = prompt.toLowerCase();
    
    // Artificial dramatic delay (3 seconds) to let the UI show the loading state
    await new Promise(r => setTimeout(r, 3000));
    
    try {
        if (p.includes('unit') || p.includes('app') || p.includes('server') || p.includes('crash')) {
            // Trigger Dev Heal
            console.log("Chat triggered DEV heal");
            execSync('node ' + path.join(__dirname, '../ai-agent/orchestrator.js') + ' --dev');
            responseMessage = "✅ <b>Success</b><br><br>The LLM analyzed the stack trace and identified a <code>TypeError</code> in <code>server.js</code>. I have automatically pushed a commit to fix the logic, opened <b>PR #1042</b>, and re-triggered the Backend pipeline. The Unit Tests stage is now passing.";
        } else if (p.includes('integration') || p.includes('schema') || p.includes('regression') || p.includes('test') || p.includes('fix')) {
            // Trigger QA Heal
            console.log("Chat triggered QA heal");
            execSync('node ' + path.join(__dirname, '../ai-agent/orchestrator.js') + ' --qa');
            responseMessage = "✅ <b>Success</b><br><br>Detected an outdated API payload causing a 400 Bad Request. The LLM generated an updated schema payload including the missing <code>age</code> field, committed the fix to <code>qa.test.js</code>, and re-ran the Frontend pipeline. Regression tests are passing.";
        } else if (p.includes('performance') || p.includes('slow') || p.includes('analyze')) {
            // Trigger Perf Heal
            console.log("Chat triggered PERF heal");
            execSync('node ' + path.join(__dirname, '../ai-agent/orchestrator.js') + ' --perf');
            responseMessage = "✅ <b>Success</b><br><br>I connected to the APM integration and analyzed the latency traces. The LLM recommended applying a B-Tree index on the <code>email</code> column. A migration script was generated and executed. Performance limits are back to normal.";
        } else if (p.includes('rollback') || p.includes('staging') || p.includes('latency')) {
            // Trigger Rollback
            console.log("Chat triggered ROLLBACK");
            execSync('node ' + path.join(__dirname, '../ai-agent/orchestrator.js') + ' --rollback');
            responseMessage = "⚠️ <b>Rollback Executed</b><br><br>The LLM detected a latency anomaly score of 98% post-deployment. I have automatically halted the pipeline, rolled back the staging environment to stable commit <code>a9f2b1c</code>, and sent a Slack alert to the on-call team.";
        }
    } catch (error) {
        responseMessage = "I attempted to apply a fix, but an error occurred during execution: " + error.message;
    }

    res.json({ reply: responseMessage });
});

// To allow starting the server for the dashboard
if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`🚀 TestOps Platform running at http://localhost:${PORT}`));
}

module.exports = app;
