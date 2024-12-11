// 导航菜单功能
document.addEventListener('DOMContentLoaded', () => {
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // 下拉菜单
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            dropdown.classList.toggle('active');
        });
    });
});

// 搜索功能
const searchInput = document.getElementById('searchInput');
const searchType = document.getElementById('searchType');
const searchBtn = document.querySelector('.search-btn');

// 搜索引擎URL配置
const searchEngines = {
    site: '/search?q=',  // 站内搜索路径
    baidu: 'https://www.baidu.com/s?wd=',
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    sougou: 'https://www.sogou.com/web?query=',
    so360: 'https://www.so.com/s?q=',
    zhihu: 'https://www.zhihu.com/search?q=',
    bilibili: 'https://search.bilibili.com/all?keyword=',
    github: 'https://github.com/search?q=',
    csdn: 'https://so.csdn.net/so/search?q=',
    juejin: 'https://juejin.cn/search?query='
};

// 执行搜索
function performSearch() {
    const searchTerm = searchInput.value.trim();
    const engineType = searchType.value;
    
    if (!searchTerm) {
        searchInput.focus();
        return;
    }
    
    // 如果是站内搜索
    if (engineType === 'site') {
        // 从所有资源卡片中搜索
        const cards = document.querySelectorAll('.resource-card');
        let hasResults = false;
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            const searchText = searchTerm.toLowerCase();
            
            if (title.includes(searchText) || desc.includes(searchText)) {
                card.style.display = '';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 显示搜索结果状态
        const sections = document.querySelectorAll('.resource-section');
        sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.resource-card[style=""]');
            if (visibleCards.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
        
        if (!hasResults) {
            // 可以添加一个"无搜索结果"的提示
            alert('未找到相关资源');
        }
    } else {
        // 使用外部搜索引擎
        const searchUrl = searchEngines[engineType] + encodeURIComponent(searchTerm);
        window.open(searchUrl, '_blank');
    }
}

// 绑定搜索事件
searchBtn.addEventListener('click', performSearch);

// 回车键触发搜索
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 搜索类型切换时清空输入框
searchType.addEventListener('change', () => {
    searchInput.value = '';
    searchInput.focus();
    
    // 如果之前执行过站内搜索，恢复所有卡片显示
    if (searchType.value !== 'site') {
        const cards = document.querySelectorAll('.resource-card');
        cards.forEach(card => card.style.display = '');
        
        const sections = document.querySelectorAll('.resource-section');
        sections.forEach(section => section.style.display = '');
    }
});

// 自动聚焦搜索框
window.addEventListener('load', () => {
    searchInput.focus();
});

// 工具搜索和筛选功能
const toolSearch = document.getElementById('toolSearch');
const categorySelect = document.getElementById('categorySelect');
const toolItems = document.querySelectorAll('.resource-item[data-category]');

function filterTools() {
    if (!toolSearch || !categorySelect) return;
    
    const searchTerm = toolSearch.value.toLowerCase();
    const category = categorySelect.value;
    
    toolItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const desc = item.querySelector('p').textContent.toLowerCase();
        const itemCategory = item.dataset.category;
        
        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
        const matchesCategory = category === 'all' || category === itemCategory;
        
        item.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

// 工具统计功能
function updateStats() {
    const stats = JSON.parse(localStorage.getItem('toolStats') || '{}');
    const viewCount = document.getElementById('viewCount');
    const favoriteCount = document.getElementById('favoriteCount');
    const shareCount = document.getElementById('shareCount');

    if (viewCount) viewCount.textContent = stats.views || 0;
    if (favoriteCount) favoriteCount.textContent = favorites?.length || 0;
    if (shareCount) shareCount.textContent = stats.shares || 0;
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 导航菜单
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
    
    // 下拉菜单
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            dropdown.classList.toggle('active');
        });
    });
    
    // 工具搜索
    toolSearch?.addEventListener('input', filterTools);
    categorySelect?.addEventListener('change', filterTools);
    
    // 工具卡片动画
    const items = document.querySelectorAll('.resource-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}); 