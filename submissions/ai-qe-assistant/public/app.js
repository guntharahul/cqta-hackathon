async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const servers = await response.json();
        
        const grid = document.getElementById('server-grid');
        grid.innerHTML = '';

        servers.forEach(server => {
            const el = document.createElement('div');
            el.className = 'server-card';
            el.innerHTML = `
                <div class="server-header">
                    <div class="server-id">${server.id}</div>
                    <div class="server-type">${server.type}</div>
                </div>
                <div style="margin-bottom: 1rem; font-size: 0.85rem; font-weight: 500;" class="status-${server.status}">
                    Status: ${server.status}
                </div>
                <div class="server-metrics">
                    <div class="metric-box">
                        <div class="metric-label">CPU Usage</div>
                        <div class="metric-value">${server.cpu}%</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Memory</div>
                        <div class="metric-value">${server.memory}%</div>
                    </div>
                </div>
                <div class="server-details">
                    <div><span>Bandwidth</span><span class="detail-val">${server.bandwidth}</span></div>
                    <div><span>Latency</span><span class="detail-val">${server.latency}</span></div>
                    <div><span>Ports</span><span class="detail-val">${server.ports}</span></div>
                    <div><span>Protocols</span><span class="detail-val">${server.protocols}</span></div>
                    <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255,255,255,0.1); flex-direction: column;">
                        <span style="margin-bottom: 0.25rem;">OS & Updates</span>
                        <span class="detail-val" style="font-size: 0.75rem; color: #94a3b8;">${server.os}</span>
                    </div>
                </div>
            `;
            grid.appendChild(el);
        });
    } catch (error) {
        console.error("Failed to fetch server stats:", error);
    }
}

async function fetchMatrix() {
    try {
        const response = await fetch('/api/pipelines');
        const history = await response.json();

        const container = document.getElementById('matrix-container');
        container.innerHTML = '';

        history.forEach(pipeline => {
            const row = document.createElement('div');
            row.className = 'pipeline-history-row';
            
            let nodesHtml = '';
            pipeline.nodes.forEach(test => {
                nodesHtml += `
                    <div class="pipeline-node">
                        <div class="node-circle ${test.status}">${test.status === 'success' ? '✓' : test.status === 'failed' ? '✗' : '⏱'}</div>
                        <div class="node-label">${test.name}</div>
                        <div class="node-category">${test.category}</div>
                    </div>
                `;
            });

            row.innerHTML = `
                <div class="pipeline-meta">
                    <div>
                        <span class="pipeline-id">Pipeline #${pipeline.id}</span>
                        <span style="margin-left: 1rem; font-size: 0.75rem; padding: 0.2rem 0.5rem; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); border-radius: 4px; color: #94a3b8;">
                            🎯 Target: ${pipeline.targetServer} (${pipeline.env})
                        </span>
                    </div>
                    <span class="pipeline-date">${pipeline.date}</span>
                </div>
                <div class="gitlab-pipeline">
                    ${nodesHtml}
                </div>
            `;
            container.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to fetch testing matrix:", error);
    }
}

// ==========================================
// AI CHAT LOGIC
// ==========================================
document.getElementById('minimize-btn').addEventListener('click', () => {
    document.querySelector('.chat-widget').classList.toggle('minimized');
});

document.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.getElementById('chat-input').value = pill.textContent;
        document.getElementById('chat-submit').click();
    });
});

let isFixing = false;

document.getElementById('chat-submit').addEventListener('click', async () => {
    const inputField = document.getElementById('chat-input');
    const prompt = inputField.value.trim();
    if (!prompt) return;

    const chatMessages = document.getElementById('chat-messages');

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-msg';
    userMsg.textContent = prompt;
    chatMessages.appendChild(userMsg);
    
    inputField.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add dynamic typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message ai-msg';
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const loadingStates = [
        "<em>Sending context to LLM...</em>",
        "<em>Generating code patch...</em>",
        "<em>Opening PR #1042...</em>",
        "<em>Triggering CI/CD re-run...</em>"
    ];
    let step = 0;
    typingMsg.innerHTML = loadingStates[0];
    const typingInterval = setInterval(() => {
        step++;
        if (step < loadingStates.length) {
            typingMsg.innerHTML = loadingStates[step];
        }
    }, 700);

    // Apply UI Loading State to Pipeline Nodes
    isFixing = true;
    const pLow = prompt.toLowerCase();
    const rows = document.querySelectorAll('.pipeline-history-row');
    rows.forEach(row => {
        const activeNodes = row.querySelectorAll('.pipeline-node');
        activeNodes.forEach(node => {
            const label = node.querySelector('.node-label');
            if (label) {
                const text = label.textContent;
                const circle = node.querySelector('.node-circle');
                if (
                    (pLow.includes('unit') && text === 'Unit Testing') ||
                    (pLow.includes('schema') && text === 'Regression Testing') ||
                    (pLow.includes('regression') && text === 'Regression Testing') ||
                    (pLow.includes('performance') && text === 'Performance Testing')
                ) {
                    circle.className = 'node-circle loading';
                    circle.textContent = '⏱';
                }
            }
        });
    });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();

        clearInterval(typingInterval);
        chatMessages.removeChild(typingMsg);

        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-msg';
        aiMsg.innerHTML = data.reply; // Using innerHTML because server response has HTML tags
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        isFixing = false;
        // Force a dashboard update so UI immediately reflects the fix
        updateDashboard();
    } catch (error) {
        clearInterval(typingInterval);
        isFixing = false;
        typingMsg.textContent = "Error communicating with AI engine.";
    }
});

async function fetchInterventions() {
    try {
        const response = await fetch('/api/interventions');
        const data = await response.json();
        
        const container = document.getElementById('logs-container');

        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state">No recent AI interventions... Waiting for pipeline failures.</div>`;
            return;
        }

        container.innerHTML = '';
        
        data.forEach(log => {
            const date = new Date(log.timestamp);
            const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            
            const el = document.createElement('div');
            el.className = 'log-item';
            el.innerHTML = `
                <div class="log-time">${timeString}</div>
                <div class="log-badge badge-${log.type}">${log.type.replace('-', ' ')}</div>
                <div class="log-message">${log.message}</div>
            `;
            container.appendChild(el);
        });

    } catch (error) {
        console.error("Failed to fetch interventions:", error);
    }
}

function updateDashboard() {
    if (isFixing) return; // Don't overwrite the dramatic loading state with polling data
    fetchStats();
    fetchMatrix();
    fetchInterventions();
}

// Initial fetch
updateDashboard();

// Poll for new interventions and stats every 2.5 seconds
setInterval(updateDashboard, 2500);
