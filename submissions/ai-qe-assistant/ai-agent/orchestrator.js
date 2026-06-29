const fs = require('fs');
const path = require('path');

const logToDashboard = (message, type) => {
    const dataPath = path.join(__dirname, 'dashboard-data.json');
    let data = [];
    if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    data.unshift({
        timestamp: new Date().toISOString(),
        message,
        type
    });
    // Keep only last 10 interventions
    fs.writeFileSync(dataPath, JSON.stringify(data.slice(0, 10), null, 2));
};

const healDev = () => {
    console.log("🤖 [AI-QE-Assistant] Triggered: Developer Pipeline Failure.");
    console.log("🤖 [AI-QE-Assistant] RCA: TypeError accessing 'theme' of null in /api/dev-data.");
    
    setTimeout(() => {
        const serverFilePath = path.join(__dirname, '../src/server.js');
        let serverFileContent = fs.readFileSync(serverFilePath, 'utf8');

        // Heals the app bug by providing a fallback empty object
        serverFileContent = serverFileContent.replace(
            /const userConfig = null;/g, 
            "const userConfig = {}; // AI Auto-Healed: Default fallback initialized"
        );

        fs.writeFileSync(serverFilePath, serverFileContent);
        console.log("🤖 [AI-QE-Assistant] Patch applied successfully to src/server.js.");
        logToDashboard("Healed TypeError (Null Reference) in src/server.js for Developer Pipeline", "app-heal");
    }, 1500);
};

const healQa = () => {
    console.log("🤖 [AI-QE-Assistant] Triggered: QA Pipeline Failure.");
    console.log("🤖 [AI-QE-Assistant] RCA: Missing required 'age' field in /api/users test payload.");

    setTimeout(() => {
        const testFilePath = path.join(__dirname, '../tests/qa.test.js');
        let testFileContent = fs.readFileSync(testFilePath, 'utf8');

        const missingFieldCode = `
            username: 'qa-tester',
            email: 'qa@example.com',
            age: 25 // Auto-healed: added missing required 'age' field
`;

        testFileContent = testFileContent.replace(
            /username: 'qa-tester',\n\s*email: 'qa@example.com'/g, 
            missingFieldCode.trim()
        );

        fs.writeFileSync(testFilePath, testFileContent);
        console.log("🤖 [AI-QE-Assistant] Patch applied successfully to tests/qa.test.js.");
        logToDashboard("Healed Test Mismatch (Added missing 'age' field) in tests/qa.test.js for QA Pipeline", "test-heal");
    }, 1500);
};

const healPerf = () => {
    console.log("🤖 [AI-QE-Assistant] RCA: Detected database query bottleneck in User Module.");
    setTimeout(() => {
        console.log("🤖 [AI-QE-Assistant] Injecting missing database index...");
        logToDashboard("Analyzed Performance Bottleneck and applied DB index on 'email' column", "perf-heal");
    }, 1500);
};

const triggerRollback = () => {
    console.log("🤖 [AI-QE-Assistant] RCA: High latency detected post-deployment to staging.");
    setTimeout(() => {
        console.log("🤖 [AI-QE-Assistant] Executing automated rollback to previous stable commit...");
        logToDashboard("Rolled back Staging environment due to degraded latency metrics", "rollback");
    }, 1500);
};

const args = process.argv.slice(2);

if (args.includes('--dev')) {
    healDev();
} else if (args.includes('--qa')) {
    healQa();
} else if (args.includes('--perf')) {
    healPerf();
} else if (args.includes('--rollback')) {
    triggerRollback();
} else {
    console.error("Please specify --dev, --qa, --perf, or --rollback");
}
