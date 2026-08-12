document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const toggleAdvancedSearchBtn = document.getElementById('toggleAdvancedSearchBtn');
    const advancedSearchPanel = document.getElementById('advancedSearchPanel');
    const closeAdvancedPanelBtn = document.getElementById('closeAdvancedPanelBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const searchInput = document.getElementById('searchInput');

    const readerModal = document.getElementById('readerModal');
    const closeReaderModalBtn = document.getElementById('closeReaderModalBtn');
    const btnModeRead = document.getElementById('btnModeRead');
    const btnModeSlide = document.getElementById('btnModeSlide');
    const modalDocTitle = document.getElementById('modalDocTitle');
    const modalDocBadge = document.getElementById('modalDocBadge');
    const btnFontIncrease = document.getElementById('btnFontIncrease');
    const btnFontDecrease = document.getElementById('btnFontDecrease');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    const slideControls = document.getElementById('slideControls');
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const slideIndicator = document.getElementById('slideIndicator');

    let currentFontSize = 18;
    let currentSlide = 1;

    const documentsData = {
        1: {
            title: "Thiết Kế Kiến Trúc Microservices Chuẩn Doanh Nghiệp",
            format: "PDF",
            badgeClass: "format-pdf",
            sections: [
                { id: "sec1", title: "Chương 1: Giới Thiệu Tổng Quan Architecture", content: "Trong các hệ thống Enterprise Backend hiện đại, việc lưu trữ và đọc tài liệu văn bản đòi hỏi tốc độ phản hồi cực nhanh dưới 50ms. Nút thắt cổ chai nằm ở khâu Full-Text Search và cách phân trang.", code: "func ProcessDocumentWorker(docID string) {\n    // Background Processing Worker in Go\n}" },
                { id: "sec2", title: "Chương 2: Thiết Kế Database Schema PostgreSQL", content: "Phân chia dữ liệu Metadata nằm ở Database PostgreSQL và nội dung văn bản bóc tách nằm ở Search Engine Meilisearch.", code: "CREATE TABLE documents (\n    id UUID PRIMARY KEY,\n    title VARCHAR(255) NOT NULL\n);" },
                { id: "sec3", title: "Chương 3: Tối Ưu Search Engine Với Meilisearch", content: "Meilisearch hỗ trợ tiếng Việt không dấu, Typo tolerance, giúp tìm kiếm nội dung văn bản dưới 20ms.", code: "" }
            ]
        },
        2: {
            title: "Cẩm Nang Tối Ưu PostgreSQL Database & Indexing",
            format: "MARKDOWN",
            badgeClass: "format-md",
            sections: [
                { id: "sec1", title: "Chương 1: Đánh Chỉ Mục B-Tree & GIN Index", content: "Tìm hiểu cách sử dụng GIN Index cho cột tsvector hoặc tích hợp với Meilisearch để đạt hiệu năng tối ưu.", code: "CREATE INDEX idx_fts ON chapters USING gin(to_tsvector('vietnamese', content));" },
                { id: "sec2", title: "Chương 2: Lock Mechanisms & High Concurrency", content: "Xử lý đếm lượt xem (View Counter) thông qua Redis Atomic Increment `INCR` để tránh lock record trong DB.", code: "redisClient.incr(`doc:views:${docId}`)" }
            ]
        },
        3: {
            title: "Báo Cáo Chiến Lược Chuyển Đổi Số Doanh Nghiệp 2026",
            format: "WORD",
            badgeClass: "format-docx",
            sections: [
                { id: "sec1", title: "Phần 1: Tổng Quan Nhu Cầu Chuyển Đổi Số", content: "Báo cáo phân tích quy trình chuyển đổi số, áp dụng CI/CD Pipeline và Multi-stage Docker Containerization.", code: "" }
            ]
        },
        4: {
            title: "Tuyển Tập Tiểu Thuyết Khoa Học Viễn Tưởng: Khởi Nguyên AI",
            format: "TXT",
            badgeClass: "format-txt",
            sections: [
                { id: "sec1", title: "Chương 1: Dòng Code Đầu Tiên", content: "Trí tuệ nhân tạo được sinh ra từ một phòng thí nghiệm không gian âm thầm học hỏi toàn bộ tri thức loài người...", code: "" }
            ]
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const icon = themeToggleBtn.querySelector('i');
        if (body.classList.contains('light-theme')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });

    toggleAdvancedSearchBtn.addEventListener('click', () => {
        advancedSearchPanel.classList.toggle('hidden');
    });

    closeAdvancedPanelBtn.addEventListener('click', () => {
        advancedSearchPanel.classList.add('hidden');
    });

    resetFilterBtn.addEventListener('click', () => {
        document.getElementById('fullTextMatch').value = '';
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterFormat').value = '';
    });

    applyFilterBtn.addEventListener('click', () => {
        alert(`[Demo Engine] Đã áp dụng bộ lọc nâng cao!`);
        advancedSearchPanel.classList.add('hidden');
    });

    window.openReaderModal = function(docId, initialMode = 'read') {
        const doc = documentsData[docId] || documentsData[1];

        modalDocTitle.textContent = doc.title;
        modalDocBadge.textContent = doc.format;
        modalDocBadge.className = `reader-doc-type ${doc.badgeClass}`;

        renderReaderContent(doc);

        if (initialMode === 'slide') {
            enableSlideMode();
        } else {
            enableReadMode();
        }

        readerModal.classList.remove('hidden');
    };

    closeReaderModalBtn.addEventListener('click', () => {
        readerModal.classList.add('hidden');
    });

    btnModeRead.addEventListener('click', enableReadMode);
    btnModeSlide.addEventListener('click', enableSlideMode);

    function enableReadMode() {
        btnModeRead.classList.add('active');
        btnModeSlide.classList.remove('active');
        readerModal.classList.remove('slide-mode-active');
        slideControls.classList.add('hidden');

        const sections = document.querySelectorAll('.doc-section');
        sections.forEach(sec => sec.style.display = 'block');
    }

    function enableSlideMode() {
        btnModeSlide.classList.add('active');
        btnModeRead.classList.remove('active');
        readerModal.classList.add('slide-mode-active');
        slideControls.classList.remove('hidden');

        currentSlide = 1;
        updateSlideDisplay();
    }

    function updateSlideDisplay() {
        const sections = document.querySelectorAll('.doc-section');
        sections.forEach((sec, idx) => {
            if (idx === currentSlide - 1) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });
        slideIndicator.textContent = `Slide ${currentSlide} / ${sections.length}`;
    }

    prevSlideBtn.addEventListener('click', () => {
        const sections = document.querySelectorAll('.doc-section');
        if (currentSlide > 1) {
            currentSlide--;
            updateSlideDisplay();
        }
    });

    nextSlideBtn.addEventListener('click', () => {
        const sections = document.querySelectorAll('.doc-section');
        if (currentSlide < sections.length) {
            currentSlide++;
            updateSlideDisplay();
        }
    });

    btnFontIncrease.addEventListener('click', () => {
        if (currentFontSize < 28) {
            currentFontSize += 2;
            document.getElementById('docArticle').style.fontSize = `${currentFontSize}px`;
            fontSizeDisplay.textContent = `${currentFontSize}px`;
        }
    });

    btnFontDecrease.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            document.getElementById('docArticle').style.fontSize = `${currentFontSize}px`;
            fontSizeDisplay.textContent = `${currentFontSize}px`;
        }
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.dataset.readerTheme;
            const panel = document.getElementById('readerContentPanel');

            if (theme === 'sepia') {
                panel.style.background = '#f4ecd8';
                panel.style.color = '#5c4b37';
            } else if (theme === 'light') {
                panel.style.background = '#ffffff';
                panel.style.color = '#0f172a';
            } else {
                panel.style.background = 'var(--bg-primary)';
                panel.style.color = 'var(--text-primary)';
            }
        });
    });

    function renderReaderContent(doc) {
        const tocList = document.getElementById('tocList');
        const docArticle = document.getElementById('docArticle');

        tocList.innerHTML = '';
        docArticle.innerHTML = '';

        doc.sections.forEach((sec, index) => {
            const li = document.createElement('li');
            if (index === 0) li.classList.add('active');
            li.innerHTML = `<a href="#${sec.id}">${sec.title}</a>`;
            tocList.appendChild(li);

            const sectionEl = document.createElement('section');
            sectionEl.id = sec.id;
            sectionEl.className = 'doc-section';
            sectionEl.innerHTML = `
                <h2>${sec.title}</h2>
                <p>${sec.content}</p>
                ${sec.code ? `<div class="code-block">${sec.code}</div>` : ''}
            `;
            docArticle.appendChild(sectionEl);
        });
    }
});
