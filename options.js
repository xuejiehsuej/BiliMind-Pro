/**
 * 渲染主逻辑
 */
function render() {
    // 安全检查：防止上下文失效报错
    if (!chrome.runtime?.id) {
        console.warn("插件上下文已失效，请刷新页面。");
        return;
    }

    const hideFragments = document.getElementById('hideFragments').checked;
    
    chrome.storage.local.get({logs: []}, (res) => {
        const logs = res.logs;

        // 1. 渲染统计概览 (新增圆环逻辑)
        renderStatsOverview(logs);

        // 2. 渲染热力图
        renderHeatmap(logs);

        // 3. 渲染日志列表
        const filteredLogs = hideFragments 
            ? logs.filter(log => log.isManual !== false) 
            : logs;

        const list = document.getElementById('logList');
        if (filteredLogs.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:50px; color:#999;">
                <p>🍃 暂无记录，去记录第一条思绪吧</p>
            </div>`;
            return;
        }

        list.innerHTML = filteredLogs.map(log => `
            <div class="log-item">
                <div style="font-weight:700; font-size:18px; color:#1d1d1f; margin-bottom:12px;">${log.title}</div>
                <div style="margin-bottom:15px;">
                    <span class="tag tag-gray">${log.type}</span>
                    <span class="tag tag-blue">${log.feel}</span>
                </div>
                <div style="color:#444; line-height:1.6; font-size:15px;">${log.note || '未记下详细感悟'}</div>
                <div style="font-size:11px; color:#999; margin-top:15px; border-top:1px solid #f0f0f2; padding-top:10px;">
                    存档于：${log.date}
                </div>
            </div>
        `).reverse().join('');
    });
}

/**
 * 统计概览：今日正念圆环
 */
function renderStatsOverview(logs) {
    const todayStr = new Date().toLocaleDateString();
    const todayLogs = logs.filter(l => l.date.includes(todayStr));
    
    const manualCount = todayLogs.filter(l => l.isManual).length;
    const totalCount = todayLogs.length;
    const ratio = totalCount === 0 ? 0 : Math.round((manualCount / totalCount) * 100);

    // 更新圆环进度 (--p 是我们之前在 CSS 中定义的变量)
    const ring = document.getElementById('thinkingRing');
    const ringText = document.getElementById('ringText');
    if (ring && ringText) {
        ring.style.setProperty('--p', `${ratio}%`);
        ringText.innerText = `${ratio}% 深度思考率 (${manualCount}/${totalCount})`;
    }
}

/**
 * 热力图：30日趋势 (修复日期匹配 Bug)
 */
function renderHeatmap(logs) {
    const heatmap = document.getElementById('activityHeatmap');
    if (!heatmap) return;
    heatmap.innerHTML = '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 对齐到今天凌晨

    // 生成近 30 天的网格
    for (let i = 29; i >= 0; i--) {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() - i);
        targetDate.setHours(0, 0, 0, 0); // 对齐到目标日期的凌晨
        
        // 核心修复：将存储的日期字符串转回 Date 对象进行零点对齐比较
        const count = logs.filter(l => {
            const logDate = new Date(l.date);
            logDate.setHours(0, 0, 0, 0); // 日志时间对齐到凌晨
            return logDate.getTime() === targetDate.getTime() && l.isManual;
        }).length;
        
        const cell = document.createElement('div');
        cell.className = 'h-cell';
        
        if (count > 0) {
            const level = Math.min(count, 4); 
            cell.setAttribute('data-level', level);
            // 颜色渲染逻辑保持不变
            cell.style.background = `rgba(0, 122, 255, ${0.2 + (level * 0.2)})`;
            cell.style.boxShadow = `0 0 8px rgba(0, 122, 255, ${level * 0.1})`;
        } else {
            cell.style.background = '#ebedf0';
        }
        
        cell.title = `${targetDate.toLocaleDateString()}: ${count} 条深度记录`;
        heatmap.appendChild(cell);
    }
}

/**
 * 导出 CSV
 */
document.getElementById('exportBtn').onclick = () => {
    if (!chrome.runtime?.id) return alert("插件已更新，请刷新页面后再试。");
    
    chrome.storage.local.get({logs: []}, (res) => {
        if (res.logs.length === 0) return alert("无可导出数据");
        
        let csvContent = "\uFEFF日期,标题,分类,感悟,笔记,URL\n";
        res.logs.forEach(log => {
            const cleanNote = (log.note || "").replace(/"/g, '""').replace(/\n/g, " ");
            const cleanTitle = (log.title || "").replace(/"/g, '""');
            csvContent += `"${log.date}","${cleanTitle}","${log.type}","${log.feel}","${cleanNote}","${log.url}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `BiliMind_Log_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    });
};

// 初始化
document.getElementById('hideFragments').onchange = render;
render();