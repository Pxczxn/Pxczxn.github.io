document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单按钮点击事件
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // 下拉菜单处理
    const dropdowns = document.querySelectorAll('.has-dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) { // 移动端才阻止默认行为
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
}); 