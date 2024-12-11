// 工具搜索和筛选功能
const toolSearch = document.getElementById('toolSearch');
const categorySelect = document.getElementById('categorySelect');
const toolItems = document.querySelectorAll('.resource-item[data-category]');

function filterTools() {
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

toolSearch.addEventListener('input', filterTools);
categorySelect.addEventListener('change', filterTools);

// 收藏功能
const favoriteBtns = document.querySelectorAll('.favorite-btn');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

favoriteBtns.forEach(btn => {
    const item = btn.closest('.resource-item');
    const title = item.querySelector('h3').textContent;
    
    if (favorites.includes(title)) {
        btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        if (btn.classList.contains('active')) {
            favorites.push(title);
        } else {
            favorites = favorites.filter(f => f !== title);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteCount();
    });
}); 