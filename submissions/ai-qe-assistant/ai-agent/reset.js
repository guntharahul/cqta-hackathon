const fs = require('fs');
const path = require('path');

console.log("🔄 Resetting demo environment...");

// 1. Reset server.js
const serverFilePath = path.join(__dirname, '../src/server.js');
if (fs.existsSync(serverFilePath)) {
    let serverContent = fs.readFileSync(serverFilePath, 'utf8');
    serverContent = serverContent.replace(
        /const userConfig = \{\}; \/\/ AI Auto-Healed: Default fallback initialized/g,
        "const userConfig = null;"
    );
    fs.writeFileSync(serverFilePath, serverContent);
    console.log("✅ Reverted App Bug in src/server.js");
}

// 2. Reset qa.test.js
const testFilePath = path.join(__dirname, '../tests/qa.test.js');
if (fs.existsSync(testFilePath)) {
    let testContent = fs.readFileSync(testFilePath, 'utf8');
    const healedCode = `
            username: 'qa-tester',
            email: 'qa@example.com',
            age: 25 // Auto-healed: added missing required 'age' field
`;
    const brokenCode = `
            username: 'qa-tester',
            email: 'qa@example.com'
`;
    testContent = testContent.replace(healedCode.trim(), brokenCode.trim());
    fs.writeFileSync(testFilePath, testContent);
    console.log("✅ Reverted Schema Bug in tests/qa.test.js");
}

// 3. Clear Dashboard Logs
const logsPath = path.join(__dirname, 'dashboard-data.json');
fs.writeFileSync(logsPath, '[]');
console.log("✅ Cleared AI Interventions Log");

console.log("✨ Environment is fully reset and ready for the next demo!");
