function performSearch() {
    const searchEngine = document.getElementById('searchEngine').value;
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (!searchInput) {
        alert('请输入搜索内容');
        return;
    }

    const searchUrls = {
        site: `/search?q=${searchInput}`,  // 本站搜索路径
        baidu: `https://www.baidu.com/s?wd=${searchInput}`,
        google: `https://www.google.com/search?q=${searchInput}`,
        bing: `https://www.bing.com/search?q=${searchInput}`,
        sougou: `https://www.sogou.com/web?query=${searchInput}`,
        so360: `https://www.so.com/s?q=${searchInput}`,
        zhihu: `https://www.zhihu.com/search?q=${searchInput}`,
        bilibili: `https://search.bilibili.com/all?keyword=${searchInput}`,
        github: `https://github.com/search?q=${searchInput}`,
        csdn: `https://so.csdn.net/so/search?q=${searchInput}`,
        juejin: `https://juejin.cn/search?query=${searchInput}`
    };

    const searchUrl = searchUrls[searchEngine];
    
    if (searchEngine === 'site') {
        // 本站搜索逻辑
        window.location.href = searchUrl;
    } else {
        // 外部搜索引擎
        window.open(searchUrl, '_blank');
    }
}

// 监听回车键
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 搜索引擎切换时保存选择
document.getElementById('searchEngine').addEventListener('change', function() {
    localStorage.setItem('preferredSearchEngine', this.value);
});

// 页面加载时恢复上次选择的搜索引擎
document.addEventListener('DOMContentLoaded', function() {
    const savedEngine = localStorage.getItem('preferredSearchEngine');
    if (savedEngine) {
        document.getElementById('searchEngine').value = savedEngine;
    }
}); 