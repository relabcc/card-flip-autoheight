class CardFlipper {
    constructor(cardSelector, options = {}) {
        this.card = document.querySelector(cardSelector);
        this.options = {
            onFlip: () => {},
            autoHeight: false,
            ...options
        };

        this.init();
    }

    init() {
        if (this.options.autoHeight) {
            this.setupAutoHeight();
        }

        this.card.addEventListener('click', (e) => {
            // 如果點擊的是要忽略的元素，不觸發翻轉
            if (this.options.ignoreSelector && e.target.closest(this.options.ignoreSelector)) {
                return;
            }
            
            this.toggleFlip();
            this.options.onFlip(this.isFlipped());
        });
    }

    setupAutoHeight() {
        const cardBack = this.card.querySelector('.card-back');
        this.originalHeight = this.card.offsetHeight;

        this.card.addEventListener('click', () => {
            if (!this.isFlipped()) {
                const contentHeight = cardBack.scrollHeight;
                this.card.style.height = Math.max(this.originalHeight, contentHeight) + 'px';
            } else {
                this.card.style.height = this.originalHeight + 'px';
            }
        });
    }

    isFlipped() {
        return this.card.classList.contains('flipped');
    }

    toggleFlip() {
        this.card.classList.toggle('flipped');
    }
}

class TabManager {
    constructor(options) {
        this.options = {
            tabSelector: '',
            contentMap: {},
            activeClass: 'active',
            onTabChange: () => {},
            ...options
        };

        this.tabs = document.querySelectorAll(this.options.tabSelector);
        this.init();
    }

    init() {
        // 設置初始內容
        if (this.tabs.length > 0) {
            const firstTab = this.tabs[0];
            this.setContent(firstTab.dataset.tag);
        }

        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止事件冒泡
                
                // 更新標籤狀態
                this.tabs.forEach(t => t.classList.remove(this.options.activeClass));
                tab.classList.add(this.options.activeClass);
                
                // 更新內容
                const tag = tab.dataset.tag;
                this.setContent(tag);
                
                // 觸發回調
                this.options.onTabChange(tag);
            });
        });
    }

    setContent(tag) {
        const content = this.options.contentMap[tag];
        if (content && this.options.contentElement) {
            this.options.contentElement.innerHTML = content.replace(/\n/g, '<br>');
        }
    }
} 