const tagMatrix = {
    "知识学习": ["技能点+1", "认知刷新", "雅思提升", "硬核干货", "逻辑缜密", "开阔视野"],
    "职场提升": ["学到沟通技巧", "简历干货", "摸鱼好物", "焦虑缓解", "职场避坑"],
    "技术数码": ["被种草了", "参数党狂喜", "生产力工具", "极客审美", "解构底层"],
    "游戏娱乐": ["下饭神剧", "操作丝滑", "想入坑了", "纯粹放松", "解压神器"],
    "纪录片": ["人文关怀", "震撼心灵", "历史厚重", "生活哲学", "引人深思"],
    "艺术/审美": ["视觉盛宴", "构图高级", "色彩美学", "灵感迸发", "优雅永恒"]
};

let lastBoundVideo = null;

function mainLoop() {
    const video = document.querySelector('video');
    if (video && video !== lastBoundVideo) {
        video.addEventListener('ended', handleVideoEnd);
        lastBoundVideo = video;
    }
    injectFloatingButton();
}

function handleVideoEnd() {
    const video = document.querySelector('video');
    if (video && video.duration > 60) {
        setTimeout(showReflectionModal, 100);
    } else {
        saveData("碎片放松", "多巴胺奖励", "系统记录碎片时间", false);
    }
}

function showReflectionModal() {
    if (document.getElementById('bm-modal')) return;

    const video = document.querySelector('video');
    if (video) {
        video.pause();
        const preventPlay = () => { if (document.getElementById('bm-modal')) video.pause(); };
        video.addEventListener('play', preventPlay);
    }

    chrome.storage.local.get({theme: 'theme-liquid'}, (res) => {
        const modal = document.createElement('div');
        modal.id = 'bm-modal';
        modal.className = res.theme;
        modal.innerHTML = `
            <div class="bm-card">
                <div class="bm-header"><h2>思绪记录</h2><div class="bm-title-container"><p id="bm-v-title">${document.title}</p></div></div>
                <div class="bm-section"><label>内容维度</label><div class="bm-tags" id="bm-type-tags">
                    ${Object.keys(tagMatrix).map((t,i)=>`<span class="bm-tag ${i===0?'active':''}">${t}</span>`).join('')}
                </div></div>
                <div class="bm-section"><label>具体感悟</label><div class="bm-tags" id="bm-feel-tags"></div></div>
                <textarea id="bm-note" placeholder="此刻在想什么？"></textarea>
                <div class="bm-footer"><button id="bm-close">忽略</button><button id="bm-save">封装这份思考</button></div>
            </div>`;
        
        const mount = document.fullscreenElement || document.body;
        mount.appendChild(modal);
        setupModalLogic();
    });
}

function setupModalLogic() {
    const updateFeels = (type) => {
        const container = document.getElementById('bm-feel-tags');
        container.innerHTML = tagMatrix[type].map((f,i)=>`<span class="bm-tag ${i===0?'active':''}">${f}</span>`).join('');
        container.querySelectorAll('.bm-tag').forEach(tag => {
            tag.onclick = () => {
                container.querySelectorAll('.bm-tag').forEach(t=>t.classList.remove('active'));
                tag.classList.add('active');
            };
        });
        const noteArea = document.getElementById('bm-note');
        noteArea.placeholder = (type === "知识学习") ? "记个单词或心得？" : "此刻在想什么？";
    };

    updateFeels(Object.keys(tagMatrix)[0]);
    document.querySelectorAll('#bm-type-tags .bm-tag').forEach(tag => {
        tag.onclick = () => {
            document.querySelectorAll('#bm-type-tags .bm-tag').forEach(t=>t.classList.remove('active'));
            tag.classList.add('active');
            updateFeels(tag.innerText);
        };
    });

    document.getElementById('bm-save').onclick = () => {
        const type = document.querySelector('#bm-type-tags .active').innerText;
        const feel = document.querySelector('#bm-feel-tags .active').innerText;
        const note = document.getElementById('bm-note').value;
        saveData(type, feel, note, true);
        document.getElementById('bm-modal').remove();
        showToast("思考已存档！");
    };
    document.getElementById('bm-close').onclick = () => document.getElementById('bm-modal').remove();
}

function saveData(type, feel, note, isManual) {
    const entry = { title: document.title, type, feel, note, isManual, date: new Date().toLocaleString(), url: location.href };
    chrome.storage.local.get({logs: []}, (res) => {
        const logs = res.logs;
        logs.push(entry);
        chrome.storage.local.set({logs});
    });
}

function showToast(msg) {
    const mount = document.fullscreenElement || document.body;
    const old = document.getElementById('bm-toast'); if (old) old.remove();
    const t = document.createElement('div'); t.id = 'bm-toast'; t.innerText = msg;
    mount.appendChild(t);
    setTimeout(() => { t.classList.add('show'); setTimeout(() => { t.classList.remove('show'); setTimeout(()=>t.remove(), 500); }, 2000); }, 50);
}

function injectFloatingButton() {
    if (document.getElementById('bm-float-wrapper')) return;
    
    // 创建一个不动的透明容器作为热区
    const wrapper = document.createElement('div');
    wrapper.id = 'bm-float-wrapper';
    
    const btn = document.createElement('div');
    btn.id = 'bm-float-btn';
    btn.innerHTML = `<span>📝</span>`;
    
    wrapper.appendChild(btn); // 将按钮放入容器
    btn.onclick = (e) => { e.stopPropagation(); showReflectionModal(); };
    
    document.body.appendChild(wrapper);
}

setInterval(mainLoop, 1500);
