// ========================================
// ResearchHub - Academic Reference Manager
// Complete Vanilla JavaScript Application
// ========================================

(function() {
    'use strict';

    // ========================================
    // Storage Keys
    // ========================================
    const STORAGE_KEYS = {
        REFERENCES: 'researchhub_references',
        PROJECTS: 'researchhub_projects',
        THEME: 'researchhub_theme',
        SETTINGS: 'researchhub_settings'
    };

    // ========================================
    // State Management
    // ========================================
    let state = {
        references: [],
        projects: [],
        currentPage: 'dashboard',
        filters: {
            project: '',
            status: '',
            priority: '',
            type: '',
            year: '',
            search: ''
        },
        deleteCallback: null,
        editReferenceId: null,
        editProjectId: null
    };

    // ========================================
    // Demo Data
    // ========================================
    const DEMO_PROJECTS = [
        { id: 'proj_1', name: "Master's Thesis", description: "Investigating the impact of AI on educational outcomes in higher education institutions", deadline: '2026-12-15', createdAt: Date.now() },
        { id: 'proj_2', name: 'Literature Review', description: 'Comprehensive review of NLP techniques in academic research', deadline: '2026-09-30', createdAt: Date.now() - 86400000 },
        { id: 'proj_3', name: 'Educational Technology', description: 'Exploring emerging technologies in modern classroom settings', deadline: '2026-11-20', createdAt: Date.now() - 172800000 },
        { id: 'proj_4', name: 'NLP Research', description: 'Deep learning approaches for natural language understanding', deadline: '2027-03-15', createdAt: Date.now() - 259200000 }
    ];

    const DEMO_REFERENCES = [
        { id: 'ref_1', title: 'Attention Is All You Need', author: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I.', year: 2017, type: 'Journal Article', status: 'Completed', priority: 'High', projectId: 'proj_4', tags: ['AI', 'NLP', 'Deep Learning', 'Transformer'], url: 'https://arxiv.org/abs/1706.03762', notes: 'Foundational paper on transformer architecture. Key for understanding modern NLP models.', totalPages: 15, pagesRead: 15, createdAt: Date.now() - 10000000 },
        { id: 'ref_2', title: 'Deep Learning for Educational Technology', author: 'Chen, L., Chen, P., & Lin, Z.', year: 2020, type: 'Book', status: 'Reading', priority: 'High', projectId: 'proj_3', tags: ['Education', 'Deep Learning', 'Technology'], url: '', notes: 'Comprehensive overview of deep learning applications in education. Chapter 3 is particularly relevant.', totalPages: 320, pagesRead: 145, createdAt: Date.now() - 20000000 },
        { id: 'ref_3', title: 'BERT: Pre-training of Deep Bidirectional Transformers', author: 'Devlin, J., Chang, M. W., Lee, K., & Toutanova, K.', year: 2019, type: 'Conference Paper', status: 'Completed', priority: 'High', projectId: 'proj_4', tags: ['NLP', 'Machine Learning', 'BERT'], url: 'https://arxiv.org/abs/1810.04805', notes: 'Revolutionary approach to language representation. Must cite in thesis.', totalPages: 16, pagesRead: 16, createdAt: Date.now() - 30000000 },
        { id: 'ref_4', title: 'The Impact of Artificial Intelligence on Higher Education', author: 'Holmes, W., Bialik, M., & Fadel, C.', year: 2019, type: 'Report', status: 'Reading', priority: 'Medium', projectId: 'proj_1', tags: ['AI', 'Education', 'Higher Ed'], url: '', notes: 'Important for thesis chapter on AI in education. Good statistics on adoption rates.', totalPages: 85, pagesRead: 42, createdAt: Date.now() - 40000000 },
        { id: 'ref_5', title: 'Natural Language Processing with Python', author: 'Bird, S., Klein, E., & Loper, E.', year: 2009, type: 'Book', status: 'Completed', priority: 'Medium', projectId: 'proj_2', tags: ['NLP', 'Python', 'Programming'], url: 'https://www.nltk.org/book/', notes: 'Classic NLTK book. Great for foundational NLP concepts and practical implementations.', totalPages: 504, pagesRead: 504, createdAt: Date.now() - 50000000 },
        { id: 'ref_6', title: 'Learning Transferable Visual Models From Natural Language Supervision', author: 'Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., Sastry, G., Askell, A., Mishkin, P., Clark, J., Krueger, G., & Sutskever, I.', year: 2021, type: 'Conference Paper', status: 'To Read', priority: 'High', projectId: 'proj_4', tags: ['AI', 'Computer Vision', 'NLP', 'CLIP'], url: 'https://arxiv.org/abs/2103.00020', notes: 'CLIP model paper. Multimodal learning approach combining vision and language.', totalPages: 30, pagesRead: 0, createdAt: Date.now() - 60000000 },
        { id: 'ref_7', title: 'Pedagogy and Technology in Higher Education', author: 'Garrison, D. R., & Vaughan, N. D.', year: 2008, type: 'Book', status: 'On Hold', priority: 'Low', projectId: 'proj_3', tags: ['Education', 'Pedagogy', 'Technology'], url: '', notes: 'Blended learning framework. Relevant for educational technology project.', totalPages: 256, pagesRead: 80, createdAt: Date.now() - 70000000 },
        { id: 'ref_8', title: 'A Survey on Large Language Models', author: 'Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., Min, Y., Zhang, B., Zhang, J., Dong, Z., Du, Y., Yang, C., Chen, Y., Chen, Z., Jiang, J., Ren, R., Li, Y., Tang, X., Li, Z., Liu, J., Nie, J., & Wen, J. R.', year: 2023, type: 'Journal Article', status: 'Reading', priority: 'High', projectId: 'proj_2', tags: ['LLM', 'Survey', 'AI', 'NLP'], url: 'https://arxiv.org/abs/2303.18223', notes: 'Comprehensive survey of LLMs. Essential for literature review chapter.', totalPages: 42, pagesRead: 28, createdAt: Date.now() - 80000000 },
        { id: 'ref_9', title: 'Machine Learning: A Probabilistic Perspective', author: 'Murphy, K. P.', year: 2012, type: 'Book', status: 'To Read', priority: 'Medium', projectId: 'proj_4', tags: ['Machine Learning', 'Statistics', 'Probability'], url: '', notes: 'Comprehensive ML textbook. Good reference for theoretical foundations.', totalPages: 1100, pagesRead: 0, createdAt: Date.now() - 90000000 },
        { id: 'ref_10', title: 'The Effectiveness of Online Learning in Higher Education', author: 'Means, B., Toyama, Y., Murphy, R., & Baki, M.', year: 2013, type: 'Journal Article', status: 'Completed', priority: 'Medium', projectId: 'proj_1', tags: ['Online Learning', 'Education', 'Research'], url: '', notes: 'Meta-analysis of online learning effectiveness. Key statistics for thesis.', totalPages: 22, pagesRead: 22, createdAt: Date.now() - 100000000 },
        { id: 'ref_11', title: 'Generative Adversarial Networks', author: 'Goodfellow, I., Pouget-Abadie, J., Mirza, M., Xu, B., Warde-Farley, D., Ozair, S., Courville, A., & Bengio, Y.', year: 2014, type: 'Conference Paper', status: 'To Read', priority: 'Low', projectId: 'proj_4', tags: ['GAN', 'Deep Learning', 'Generative Models'], url: 'https://arxiv.org/abs/1406.2661', notes: 'Foundational GAN paper. Background reading for generative models section.', totalPages: 9, pagesRead: 0, createdAt: Date.now() - 110000000 },
        { id: 'ref_12', title: 'Digital Education: A Critical Introduction', author: 'Selwyn, N.', year: 2016, type: 'Book Chapter', status: 'Reading', priority: 'Medium', projectId: 'proj_3', tags: ['Digital Education', 'Critical Theory', 'Technology'], url: '', notes: 'Critical perspective on digital education. Chapter 5 discusses equity issues.', totalPages: 35, pagesRead: 18, createdAt: Date.now() - 120000000 }
    ];

    // ========================================
    // Utility Functions
    // ========================================
    function generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function formatDate(dateString) {
        if (!dateString) return 'No deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function timeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return count + ' ' + interval.label + (count > 1 ? 's' : '') + ' ago';
            }
        }
        return 'Just now';
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function calculateProgress(pagesRead, totalPages) {
        if (!totalPages || totalPages <= 0) return 0;
        const progress = Math.min(100, Math.max(0, (pagesRead / totalPages) * 100));
        return Math.round(progress);
    }

    function getProjectName(projectId) {
        if (!projectId) return 'No Project';
        const project = state.projects.find(p => p.id === projectId);
        return project ? project.name : 'Unknown Project';
    }

    function getTypeIcon(type) {
        const icons = {
            'Journal Article': 'fa-file-lines',
            'Book': 'fa-book',
            'Book Chapter': 'fa-book-open',
            'Conference Paper': 'fa-users',
            'Thesis': 'fa-graduation-cap',
            'Report': 'fa-file-chart-column',
            'Website': 'fa-globe',
            'Other': 'fa-file'
        };
        return icons[type] || 'fa-file';
    }

    function getTypeClass(type) {
        const classes = {
            'Journal Article': 'type-journal',
            'Book': 'type-book',
            'Book Chapter': 'type-chapter',
            'Conference Paper': 'type-conference',
            'Thesis': 'type-thesis',
            'Report': 'type-report',
            'Website': 'type-website',
            'Other': 'type-other'
        };
        return classes[type] || 'type-other';
    }

    // ========================================
    // LocalStorage Functions
    // ========================================
    function loadData() {
        try {
            const refs = localStorage.getItem(STORAGE_KEYS.REFERENCES);
            const projs = localStorage.getItem(STORAGE_KEYS.PROJECTS);
            if (refs) state.references = JSON.parse(refs);
            if (projs) state.projects = JSON.parse(projs);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(state.references));
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(state.projects));
        } catch (e) {
            console.error('Error saving data:', e);
            showToast('Error saving data. Storage may be full.', 'error');
        }
    }

    function loadTheme() {
        const theme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon(true);
        } else {
            document.documentElement.removeAttribute('data-theme');
            updateThemeIcon(false);
        }
    }

    function saveTheme(isDark) {
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    }

    function updateThemeIcon(isDark) {
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }
    }

    // ========================================
    // Toast Notifications
    // ========================================
    function showToast(message, type = 'success', title = '') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            info: 'fa-circle-info',
            warning: 'fa-triangle-exclamation'
        };

        const titles = {
            success: 'Success',
            error: 'Error',
            info: 'Info',
            warning: 'Warning'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${icons[type]}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title || titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
        `;

        container.appendChild(toast);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            removeToast(toast);
        });

        setTimeout(() => {
            removeToast(toast);
        }, 4000);
    }

    function removeToast(toast) {
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }

    // ========================================
    // Modal Functions
    // ========================================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function setupModalClose(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modalId);
        });
    }

    // ========================================
    // Navigation
    // ========================================
    function navigateTo(page) {
        state.currentPage = page;

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        document.querySelectorAll('.page').forEach(p => {
            p.classList.toggle('active', p.id === 'page-' + page);
        });

        if (page === 'dashboard') renderDashboard();
        if (page === 'references') renderReferences();
        if (page === 'projects') renderProjects();
        if (page === 'citations') renderCitations();
        if (page === 'export') renderExport();

        document.getElementById('sidebar').classList.remove('open');
        window.scrollTo(0, 0);
    }

    // ========================================
    // Dashboard Rendering
    // ========================================
    function renderDashboard() {
        const totalRefs = state.references.length;
        const reading = state.references.filter(r => r.status === 'Reading').length;
        const completed = state.references.filter(r => r.status === 'Completed').length;
        const important = state.references.filter(r => r.priority === 'High').length;

        let totalPages = 0, pagesRead = 0, totalProgress = 0, progressCount = 0;
        state.references.forEach(r => {
            if (r.totalPages > 0) {
                totalPages += parseInt(r.totalPages) || 0;
                pagesRead += parseInt(r.pagesRead) || 0;
                totalProgress += calculateProgress(r.pagesRead, r.totalPages);
                progressCount++;
            }
        });
        const avgProgress = progressCount > 0 ? Math.round(totalProgress / progressCount) : 0;

        document.getElementById('statTotalRefs').textContent = totalRefs;
        document.getElementById('statReading').textContent = reading;
        document.getElementById('statCompleted').textContent = completed;
        document.getElementById('statImportant').textContent = important;
        document.getElementById('statProgress').textContent = avgProgress + '%';
        document.getElementById('statProgressBar').style.width = avgProgress + '%';

        document.getElementById('totalPages').textContent = totalPages.toLocaleString();
        document.getElementById('pagesRead').textContent = pagesRead.toLocaleString();
        document.getElementById('avgProgress').textContent = avgProgress + '%';

        renderRecentActivity();
        renderDashboardProjects();
    }

    function renderRecentActivity() {
        const container = document.getElementById('recentActivityList');
        const recent = [...state.references].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = '<div class="empty-state small"><i class="fa-solid fa-inbox"></i><p>No recent activity</p></div>';
            return;
        }

        const icons = {
            'Journal Article': 'fa-file-lines',
            'Book': 'fa-book',
            'Book Chapter': 'fa-book-open',
            'Conference Paper': 'fa-users',
            'Thesis': 'fa-graduation-cap',
            'Report': 'fa-file-chart-column',
            'Website': 'fa-globe',
            'Other': 'fa-file'
        };

        const bgColors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger'];

        container.innerHTML = recent.map((ref, i) => `
            <div class="activity-item">
                <div class="activity-icon ${bgColors[i % bgColors.length]}">
                    <i class="fa-solid ${icons[ref.type] || 'fa-file'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${escapeHtml(ref.title)}</div>
                    <div class="activity-meta">${escapeHtml(ref.author)} &middot; ${timeAgo(ref.createdAt)}</div>
                </div>
            </div>
        `).join('');
    }

    function renderDashboardProjects() {
        const container = document.getElementById('dashboardProjects');

        if (state.projects.length === 0) {
            container.innerHTML = '<div class="empty-state small"><i class="fa-solid fa-folder-open"></i><p>No projects yet</p></div>';
            return;
        }

        container.innerHTML = state.projects.map(proj => {
            const projRefs = state.references.filter(r => r.projectId === proj.id);
            const total = projRefs.length;
            const completed = projRefs.filter(r => r.status === 'Completed').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return `
                <div class="project-item" data-project-id="${proj.id}">
                    <div class="project-icon"><i class="fa-solid fa-folder"></i></div>
                    <div class="project-info">
                        <div class="project-name">${escapeHtml(proj.name)}</div>
                        <div class="project-meta">${total} references &middot; ${completed} completed</div>
                    </div>
                    <div class="project-progress">
                        <div class="project-progress-value">${progress}%</div>
                        <div class="project-progress-bar"><div class="project-progress-fill" style="width:${progress}%"></div></div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', () => {
                const pid = item.dataset.projectId;
                document.getElementById('filterProject').value = pid;
                state.filters.project = pid;
                navigateTo('references');
            });
        });
    }


    // ========================================
    // References Rendering
    // ========================================
    function renderReferences() {
        const grid = document.getElementById('referencesGrid');
        const empty = document.getElementById('referencesEmpty');

        let filtered = [...state.references];

        if (state.filters.search) {
            const s = state.filters.search.toLowerCase();
            filtered = filtered.filter(r =>
                (r.title && r.title.toLowerCase().includes(s)) ||
                (r.author && r.author.toLowerCase().includes(s)) ||
                (r.tags && r.tags.toLowerCase().includes(s)) ||
                (r.notes && r.notes.toLowerCase().includes(s))
            );
        }
        if (state.filters.project) {
            filtered = filtered.filter(r => r.projectId === state.filters.project);
        }
        if (state.filters.status) {
            filtered = filtered.filter(r => r.status === state.filters.status);
        }
        if (state.filters.priority) {
            filtered = filtered.filter(r => r.priority === state.filters.priority);
        }
        if (state.filters.type) {
            filtered = filtered.filter(r => r.type === state.filters.type);
        }
        if (state.filters.year) {
            filtered = filtered.filter(r => r.year.toString() === state.filters.year);
        }

        if (filtered.length === 0) {
            grid.innerHTML = '';
            grid.appendChild(empty);
            empty.style.display = 'flex';
            return;
        }

        empty.style.display = 'none';

        grid.innerHTML = filtered.map(ref => {
            const progress = calculateProgress(ref.pagesRead, ref.totalPages);
            const priorityClass = 'priority-' + (ref.priority ? ref.priority.toLowerCase() : 'low');
            const typeClass = getTypeClass(ref.type);
            const typeIcon = getTypeIcon(ref.type);
            const statusClass = 'status-' + (ref.status ? ref.status.toLowerCase().replace(' ', '') : 'toread');
            const projectName = getProjectName(ref.projectId);
            const tags = ref.tags ? ref.tags.split(',').map(t => t.trim()).filter(t => t) : [];

            return `
                <div class="reference-card ${priorityClass}" data-ref-id="${ref.id}">
                    <div class="reference-header">
                        <span class="reference-type ${typeClass}"><i class="fa-solid ${typeIcon}"></i> ${ref.type}</span>
                        <div class="reference-actions">
                            <button class="reference-action-btn" data-action="view" title="View Details"><i class="fa-solid fa-eye"></i></button>
                            <button class="reference-action-btn" data-action="edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button class="reference-action-btn delete" data-action="delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="reference-title">${escapeHtml(ref.title)}</div>
                    <div class="reference-author">${escapeHtml(ref.author)}</div>
                    <div class="reference-meta">
                        <span class="reference-meta-item"><i class="fa-regular fa-calendar"></i> ${ref.year}</span>
                        <span class="reference-meta-item"><i class="fa-solid fa-folder"></i> ${escapeHtml(projectName)}</span>
                        <span class="status-badge ${statusClass}"><i class="fa-solid fa-circle" style="font-size:6px"></i> ${ref.status}</span>
                        <span class="priority-badge ${priorityClass}"><i class="fa-solid fa-flag" style="font-size:8px"></i> ${ref.priority}</span>
                    </div>
                    <div class="reference-tags">
                        ${tags.map(tag => `<span class="reference-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                    <div class="reference-progress">
                        <div class="reference-progress-header">
                            <span class="reference-progress-label">Reading Progress</span>
                            <span class="reference-progress-value">${progress}%</span>
                        </div>
                        <div class="reference-progress-bar">
                            <div class="reference-progress-fill" style="width:${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.reference-card').forEach(card => {
            const refId = card.dataset.refId;
            const ref = state.references.find(r => r.id === refId);

            card.querySelector('.reference-title').addEventListener('click', () => {
                showReferenceDetail(ref);
            });

            card.querySelectorAll('.reference-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    if (action === 'view') showReferenceDetail(ref);
                    if (action === 'edit') openEditReference(ref);
                    if (action === 'delete') confirmDeleteReference(ref);
                });
            });
        });
    }

    function showReferenceDetail(ref) {
        const body = document.getElementById('detailModalBody');
        const projectName = getProjectName(ref.projectId);
        const progress = calculateProgress(ref.pagesRead, ref.totalPages);
        const tags = ref.tags ? ref.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        const statusClass = 'status-' + (ref.status ? ref.status.toLowerCase().replace(' ', '') : 'toread');
        const priorityClass = 'priority-' + (ref.priority ? ref.priority.toLowerCase() : 'low');

        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-item-label">Title</div>
                    <div class="detail-item-value">${escapeHtml(ref.title)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Author(s)</div>
                    <div class="detail-item-value">${escapeHtml(ref.author)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Year</div>
                    <div class="detail-item-value">${ref.year}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Type</div>
                    <div class="detail-item-value">${ref.type}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Status</div>
                    <div class="detail-item-value"><span class="status-badge ${statusClass}">${ref.status}</span></div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Priority</div>
                    <div class="detail-item-value"><span class="priority-badge ${priorityClass}">${ref.priority}</span></div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Project</div>
                    <div class="detail-item-value">${escapeHtml(projectName)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">Progress</div>
                    <div class="detail-item-value">${progress}% (${ref.pagesRead || 0} / ${ref.totalPages || 0} pages)</div>
                </div>
            </div>
            ${tags.length > 0 ? `
            <div class="detail-section" style="margin-top:20px;">
                <div class="detail-section-title">Tags</div>
                <div class="detail-tags">
                    ${tags.map(tag => `<span class="reference-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>` : ''}
            ${ref.url ? `
            <div class="detail-section" style="margin-top:20px;">
                <div class="detail-section-title">URL / DOI</div>
                <div class="detail-section-content"><a href="${escapeHtml(ref.url)}" target="_blank" style="color:var(--primary);">${escapeHtml(ref.url)}</a></div>
            </div>` : ''}
            ${ref.notes ? `
            <div class="detail-section" style="margin-top:20px;">
                <div class="detail-section-title">Notes</div>
                <div class="detail-section-content">${escapeHtml(ref.notes).replace(/\n/g, '<br>')}</div>
            </div>` : ''}
        `;

        document.getElementById('detailModalEdit').onclick = () => {
            closeModal('detailModal');
            openEditReference(ref);
        };

        openModal('detailModal');
    }

    // ========================================
    // Reference CRUD
    // ========================================
    function openAddReference() {
        state.editReferenceId = null;
        document.getElementById('refModalTitle').textContent = 'Add Reference';
        document.getElementById('refForm').reset();
        document.getElementById('refId').value = '';
        populateProjectSelect();
        openModal('refModal');
    }

    function openEditReference(ref) {
        state.editReferenceId = ref.id;
        document.getElementById('refModalTitle').textContent = 'Edit Reference';
        document.getElementById('refId').value = ref.id;
        document.getElementById('refTitle').value = ref.title || '';
        document.getElementById('refAuthor').value = ref.author || '';
        document.getElementById('refYear').value = ref.year || '';
        document.getElementById('refType').value = ref.type || '';
        document.getElementById('refStatus').value = ref.status || 'To Read';
        document.getElementById('refPriority').value = ref.priority || 'Low';
        document.getElementById('refTags').value = ref.tags || '';
        document.getElementById('refURL').value = ref.url || '';
        document.getElementById('refNotes').value = ref.notes || '';
        document.getElementById('refTotalPages').value = ref.totalPages || '';
        document.getElementById('refPagesRead').value = ref.pagesRead || '';
        populateProjectSelect(ref.projectId);
        openModal('refModal');
    }

    function saveReference() {
        const title = document.getElementById('refTitle').value.trim();
        const author = document.getElementById('refAuthor').value.trim();
        const year = document.getElementById('refYear').value;
        const type = document.getElementById('refType').value;

        if (!title || !author || !year || !type) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        const refData = {
            id: state.editReferenceId || generateId(),
            title: title,
            author: author,
            year: parseInt(year),
            type: type,
            status: document.getElementById('refStatus').value,
            priority: document.getElementById('refPriority').value,
            projectId: document.getElementById('refProject').value || '',
            tags: document.getElementById('refTags').value.trim(),
            url: document.getElementById('refURL').value.trim(),
            notes: document.getElementById('refNotes').value.trim(),
            totalPages: parseInt(document.getElementById('refTotalPages').value) || 0,
            pagesRead: parseInt(document.getElementById('refPagesRead').value) || 0,
            createdAt: state.editReferenceId ? (state.references.find(r => r.id === state.editReferenceId)?.createdAt || Date.now()) : Date.now()
        };

        if (state.editReferenceId) {
            const idx = state.references.findIndex(r => r.id === state.editReferenceId);
            if (idx !== -1) state.references[idx] = refData;
            showToast('Reference updated successfully!', 'success');
        } else {
            state.references.push(refData);
            showToast('Reference added successfully!', 'success');
        }

        saveData();
        closeModal('refModal');
        renderAll();
    }

    function confirmDeleteReference(ref) {
        state.deleteCallback = () => {
            state.references = state.references.filter(r => r.id !== ref.id);
            saveData();
            renderAll();
            showToast('Reference deleted successfully!', 'success');
        };
        document.getElementById('deleteModalMessage').textContent = 'Are you sure you want to delete "' + ref.title + '"? This action cannot be undone.';
        openModal('deleteModal');
    }

    // ========================================
    // Projects Rendering
    // ========================================
    function renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const empty = document.getElementById('projectsEmpty');

        if (state.projects.length === 0) {
            grid.innerHTML = '';
            grid.appendChild(empty);
            empty.style.display = 'flex';
            return;
        }

        empty.style.display = 'none';

        grid.innerHTML = state.projects.map(proj => {
            const projRefs = state.references.filter(r => r.projectId === proj.id);
            const total = projRefs.length;
            const completed = projRefs.filter(r => r.status === 'Completed').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            const daysLeft = proj.deadline ? Math.ceil((new Date(proj.deadline) - Date.now()) / (1000 * 60 * 60 * 24)) : null;

            return `
                <div class="project-card" data-project-id="${proj.id}">
                    <div class="project-card-header">
                        <div class="project-card-icon"><i class="fa-solid fa-folder"></i></div>
                        <div class="project-card-actions">
                            <button class="reference-action-btn" data-action="edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button class="reference-action-btn delete" data-action="delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="project-card-title">${escapeHtml(proj.name)}</div>
                    <div class="project-card-desc">${escapeHtml(proj.description || 'No description')}</div>
                    <div class="project-card-meta">
                        <span class="project-card-meta-item"><i class="fa-solid fa-book"></i> ${total} refs</span>
                        <span class="project-card-meta-item"><i class="fa-solid fa-circle-check"></i> ${completed} done</span>
                        ${daysLeft !== null ? `<span class="project-card-meta-item"><i class="fa-solid fa-calendar-days"></i> ${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}</span>` : ''}
                    </div>
                    <div class="project-card-progress">
                        <div class="project-card-progress-header">
                            <span class="project-card-progress-label">Progress</span>
                            <span class="project-card-progress-value">${progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.project-card').forEach(card => {
            const projId = card.dataset.projectId;
            const proj = state.projects.find(p => p.id === projId);

            card.querySelectorAll('.reference-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    if (action === 'edit') openEditProject(proj);
                    if (action === 'delete') confirmDeleteProject(proj);
                });
            });
        });
    }

    // ========================================
    // Project CRUD
    // ========================================
    function openAddProject() {
        state.editProjectId = null;
        document.getElementById('projectModalTitle').textContent = 'New Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        openModal('projectModal');
    }

    function openEditProject(proj) {
        state.editProjectId = proj.id;
        document.getElementById('projectModalTitle').textContent = 'Edit Project';
        document.getElementById('projectId').value = proj.id;
        document.getElementById('projectName').value = proj.name || '';
        document.getElementById('projectDescription').value = proj.description || '';
        document.getElementById('projectDeadline').value = proj.deadline || '';
        openModal('projectModal');
    }

    function saveProject() {
        const name = document.getElementById('projectName').value.trim();
        if (!name) {
            showToast('Please enter a project name.', 'error');
            return;
        }

        const projData = {
            id: state.editProjectId || generateId(),
            name: name,
            description: document.getElementById('projectDescription').value.trim(),
            deadline: document.getElementById('projectDeadline').value,
            createdAt: state.editProjectId ? (state.projects.find(p => p.id === state.editProjectId)?.createdAt || Date.now()) : Date.now()
        };

        if (state.editProjectId) {
            const idx = state.projects.findIndex(p => p.id === state.editProjectId);
            if (idx !== -1) state.projects[idx] = projData;
            showToast('Project updated successfully!', 'success');
        } else {
            state.projects.push(projData);
            showToast('Project created successfully!', 'success');
        }

        saveData();
        closeModal('projectModal');
        renderAll();
    }

    function confirmDeleteProject(proj) {
        state.deleteCallback = () => {
            state.projects = state.projects.filter(p => p.id !== proj.id);
            state.references.forEach(r => {
                if (r.projectId === proj.id) r.projectId = '';
            });
            saveData();
            renderAll();
            showToast('Project deleted successfully!', 'success');
        };
        document.getElementById('deleteModalMessage').textContent = 'Are you sure you want to delete "' + proj.name + '"? All associated references will be unassigned. This action cannot be undone.';
        openModal('deleteModal');
    }

    // ========================================
    // Filter Functions
    // ========================================
    function populateFilterOptions() {
        const yearSelect = document.getElementById('filterYear');
        const years = [...new Set(state.references.map(r => r.year))].sort((a, b) => b - a);
        yearSelect.innerHTML = '<option value="">All Years</option>' + years.map(y => `<option value="${y}">${y}</option>`).join('');

        populateProjectSelect();
    }

    function populateProjectSelect(selectedId) {
        const selects = [document.getElementById('filterProject'), document.getElementById('refProject')];
        selects.forEach(select => {
            if (!select) return;
            const currentVal = select.value;
            select.innerHTML = '<option value="">' + (select.id === 'filterProject' ? 'All Projects' : 'No Project') + '</option>' +
                state.projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
            if (selectedId) select.value = selectedId;
            else if (currentVal) select.value = currentVal;
        });
    }

    function clearFilters() {
        state.filters = { project: '', status: '', priority: '', type: '', year: '', search: '' };
        document.getElementById('filterProject').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterPriority').value = '';
        document.getElementById('filterType').value = '';
        document.getElementById('filterYear').value = '';
        document.getElementById('globalSearchInput').value = '';
        renderReferences();
    }

    // ========================================
    // Citations
    // ========================================
    function renderCitations() {
        const select = document.getElementById('citationReferenceSelect');
        select.innerHTML = '<option value="">Choose a reference...</option>' +
            state.references.map(r => `<option value="${r.id}">${escapeHtml(r.title)} (${r.year})</option>`).join('');
    }

    function generateCitations() {
        const refId = document.getElementById('citationReferenceSelect').value;
        if (!refId) {
            document.getElementById('citationResults').style.display = 'none';
            return;
        }

        const ref = state.references.find(r => r.id === refId);
        if (!ref) return;

        const apa = generateAPA(ref);
        const mla = generateMLA(ref);

        document.getElementById('apaCitation').textContent = apa;
        document.getElementById('mlaCitation').textContent = mla;
        document.getElementById('citationResults').style.display = 'block';
    }

    function generateAPA(ref) {
        const author = ref.author;
        const year = ref.year;
        const title = ref.title;
        const type = ref.type;

        let citation = '';

        if (type === 'Journal Article') {
            citation = author + ' (' + year + '). ' + title + '. ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        } else if (type === 'Book') {
            citation = author + ' (' + year + '). ' + title + '. ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        } else if (type === 'Book Chapter') {
            citation = author + ' (' + year + '). ' + title + '. In [Book Title] (pp. [pages]). ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        } else if (type === 'Conference Paper') {
            citation = author + ' (' + year + '). ' + title + '. In [Conference Name] (pp. [pages]). ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        } else if (type === 'Thesis') {
            citation = author + ' (' + year + '). ' + title + ' [Unpublished doctoral dissertation/Master\'s thesis]. ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        } else if (type === 'Website') {
            citation = author + ' (' + year + '). ' + title + '. ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        } else {
            citation = author + ' (' + year + '). ' + title + '. ';
            if (ref.url) citation += 'Retrieved from ' + ref.url;
        }

        return citation;
    }

    function generateMLA(ref) {
        const author = ref.author;
        const year = ref.year;
        const title = ref.title;
        const type = ref.type;

        let citation = '';

        if (type === 'Journal Article') {
            citation = author + '. "' + title + '." ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        } else if (type === 'Book') {
            citation = author + '. ' + title + '. ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        } else if (type === 'Book Chapter') {
            citation = author + '. "' + title + '." ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        } else if (type === 'Conference Paper') {
            citation = author + '. "' + title + '." ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        } else if (type === 'Thesis') {
            citation = author + '. ' + title + '. ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        } else if (type === 'Website') {
            citation = author + '. "' + title + '." ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        } else {
            citation = author + '. ' + title + '. ' + year + '. ';
            if (ref.url) citation += ref.url + '. ';
        }

        return citation;
    }

    function copyCitation(format) {
        const text = format === 'apa' ? document.getElementById('apaCitation').textContent : document.getElementById('mlaCitation').textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast(format.toUpperCase() + ' citation copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy citation.', 'error');
        });
    }


    // ========================================
    // Export Functions
    // ========================================
    function renderExport() {
        document.getElementById('exportRefCount').textContent = state.references.length;
        document.getElementById('exportProjCount').textContent = state.projects.length;
    }

    function exportToCSV() {
        if (state.references.length === 0) {
            showToast('No references to export.', 'warning');
            return;
        }

        const headers = ['Title', 'Author', 'Year', 'Type', 'Status', 'Priority', 'Project', 'Tags', 'URL', 'Notes', 'Total Pages', 'Pages Read', 'Progress %'];
        const rows = state.references.map(ref => [
            ref.title,
            ref.author,
            ref.year,
            ref.type,
            ref.status,
            ref.priority,
            getProjectName(ref.projectId),
            ref.tags,
            ref.url,
            ref.notes,
            ref.totalPages,
            ref.pagesRead,
            calculateProgress(ref.pagesRead, ref.totalPages)
        ]);

        let csv = '\uFEFF' + headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => {
                const val = String(cell || '').replace(/"/g, '""');
                return '"' + val + '"';
            }).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'researchhub_references_' + new Date().toISOString().split('T')[0] + '.csv';
        link.click();
        URL.revokeObjectURL(link.href);

        showToast('References exported to CSV successfully!', 'success');
    }

    function exportToJSON() {
        const data = {
            references: state.references,
            projects: state.projects,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'researchhub_backup_' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
        URL.revokeObjectURL(link.href);

        showToast('Data backup created successfully!', 'success');
    }

    function importFromJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.references && Array.isArray(data.references)) {
                    state.references = data.references;
                }
                if (data.projects && Array.isArray(data.projects)) {
                    state.projects = data.projects;
                }
                saveData();
                renderAll();
                showToast('Data imported successfully!', 'success');
            } catch (err) {
                showToast('Invalid JSON file. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // ========================================
    // Demo Data
    // ========================================
    function loadDemoData() {
        if (state.references.length > 0 || state.projects.length > 0) {
            if (!confirm('This will replace your existing data with demo data. Are you sure?')) {
                return;
            }
        }

        state.projects = JSON.parse(JSON.stringify(DEMO_PROJECTS));
        state.references = JSON.parse(JSON.stringify(DEMO_REFERENCES));
        saveData();
        renderAll();
        showToast('Demo data loaded successfully!', 'success');
    }

    // ========================================
    // Render All
    // ========================================
    function renderAll() {
        updateNavBadges();
        populateFilterOptions();

        if (state.currentPage === 'dashboard') renderDashboard();
        if (state.currentPage === 'references') renderReferences();
        if (state.currentPage === 'projects') renderProjects();
        if (state.currentPage === 'citations') renderCitations();
        if (state.currentPage === 'export') renderExport();
    }

    function updateNavBadges() {
        document.getElementById('navRefCount').textContent = state.references.length;
        document.getElementById('navProjCount').textContent = state.projects.length;
    }

    // ========================================
    // Event Listeners
    // ========================================
    function initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(item.dataset.page);
            });
        });

        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        document.getElementById('sidebarClose').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            const isDark = !document.documentElement.hasAttribute('data-theme');
            if (isDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            updateThemeIcon(isDark);
            saveTheme(isDark);
        });

        // Quick add
        document.getElementById('quickAddBtn').addEventListener('click', openAddReference);
        document.getElementById('addReferenceBtn').addEventListener('click', openAddReference);
        document.getElementById('emptyAddRef').addEventListener('click', openAddReference);

        // Add project
        document.getElementById('addProjectBtn').addEventListener('click', openAddProject);
        document.getElementById('emptyAddProject').addEventListener('click', openAddProject);

        // Reference modal
        document.getElementById('refModalClose').addEventListener('click', () => closeModal('refModal'));
        document.getElementById('refModalCancel').addEventListener('click', () => closeModal('refModal'));
        document.getElementById('refModalSave').addEventListener('click', saveReference);
        setupModalClose('refModal');

        // Project modal
        document.getElementById('projectModalClose').addEventListener('click', () => closeModal('projectModal'));
        document.getElementById('projectModalCancel').addEventListener('click', () => closeModal('projectModal'));
        document.getElementById('projectModalSave').addEventListener('click', saveProject);
        setupModalClose('projectModal');

        // Delete modal
        document.getElementById('deleteModalClose').addEventListener('click', () => closeModal('deleteModal'));
        document.getElementById('deleteModalCancel').addEventListener('click', () => closeModal('deleteModal'));
        document.getElementById('deleteModalConfirm').addEventListener('click', () => {
            if (state.deleteCallback) {
                state.deleteCallback();
                state.deleteCallback = null;
            }
            closeModal('deleteModal');
        });
        setupModalClose('deleteModal');

        // Detail modal
        document.getElementById('detailModalClose').addEventListener('click', () => closeModal('detailModal'));
        document.getElementById('detailModalCloseBtn').addEventListener('click', () => closeModal('detailModal'));
        setupModalClose('detailModal');

        // Filters
        document.getElementById('filterProject').addEventListener('change', (e) => {
            state.filters.project = e.target.value;
            renderReferences();
        });
        document.getElementById('filterStatus').addEventListener('change', (e) => {
            state.filters.status = e.target.value;
            renderReferences();
        });
        document.getElementById('filterPriority').addEventListener('change', (e) => {
            state.filters.priority = e.target.value;
            renderReferences();
        });
        document.getElementById('filterType').addEventListener('change', (e) => {
            state.filters.type = e.target.value;
            renderReferences();
        });
        document.getElementById('filterYear').addEventListener('change', (e) => {
            state.filters.year = e.target.value;
            renderReferences();
        });
        document.getElementById('clearFilters').addEventListener('click', clearFilters);

        // Global search
        document.getElementById('globalSearchInput').addEventListener('input', (e) => {
            state.filters.search = e.target.value;
            if (state.currentPage !== 'references') {
                navigateTo('references');
            }
            renderReferences();
        });

        // Citations
        document.getElementById('citationReferenceSelect').addEventListener('change', generateCitations);
        document.querySelectorAll('.copy-citation').forEach(btn => {
            btn.addEventListener('click', () => copyCitation(btn.dataset.format));
        });

        // Export
        document.getElementById('exportCSV').addEventListener('click', exportToCSV);
        document.getElementById('exportJSON').addEventListener('click', exportToJSON);
        document.getElementById('importJSON').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importFromJSON(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Demo data
        document.getElementById('loadDemoData').addEventListener('click', loadDemoData);

        // View all buttons
        document.getElementById('viewAllActivity').addEventListener('click', () => navigateTo('references'));
        document.getElementById('viewAllProjects').addEventListener('click', () => navigateTo('projects'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        });

        // Close sidebar on outside click (mobile)
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ========================================
    // Initialize
    // ========================================
    function init() {
        loadData();
        loadTheme();
        initEventListeners();
        renderAll();

        // Check if first visit
        if (state.references.length === 0 && state.projects.length === 0) {
            showToast('Welcome to ResearchHub! Load demo data to get started.', 'info');
        }
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();