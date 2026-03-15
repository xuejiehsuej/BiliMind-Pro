document.getElementById('themeSelector').onchange = (e) => {
    const theme = e.target.value;
    chrome.storage.local.set({theme: theme}, () => {
       
    });
};

document.getElementById('goOptions').onclick = () => {
    chrome.runtime.openOptionsPage();
};

// 回显当前设置
chrome.storage.local.get('theme', (res) => {
    if (res.theme) document.getElementById('themeSelector').value = res.theme;
});