/**
 * 履带式巡检车 - 科技感交互脚本
 */

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initScrollReveal();
    initNavHighlight();
    initCounters();
    initProgressRing();
    initSmoothScroll();
});

/* ============ Canvas 科技网格背景 ============ */
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let w, h;
    let particles = [];
    const maxParticles = 80;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // 初始化粒子
    for (let i = 0; i < maxParticles; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
        });
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 0.5;
        const size = 50;

        for (let x = 0; x < w; x += size) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        for (let y = 0; y < h; y += size) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    function drawParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // 边界回弹
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
            ctx.fill();

            // 连线
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        drawGrid();
        drawParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ============ 滚动显示动画 ============ */
function initScrollReveal() {
    const sections = document.querySelectorAll('.tech-card, .team-card, .timeline-card, .stat-card, .progress-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
    });

    sections.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ============ 导航高亮 ============ */
function initNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [...navLinks].map(link => {
        const id = link.getAttribute('data-section');
        return document.getElementById(id);
    }).filter(Boolean);

    function updateActive() {
        const scrollY = window.scrollY + 120;

        let activeId = null;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                activeId = section.id;
            }
        });

        navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            if (sectionId === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

/* ============ 数字滚动动画 ============ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = 2000;
                const start = performance.now();

                function update(timestamp) {
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutCubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    el.textContent = current;
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ============ 进度环动画 ============ */
function initProgressRing() {
    const ring = document.querySelector('.ring-progress');
    if (!ring) return;

    const circumference = 2 * Math.PI * 85; // r=85
    const targetPercent = 65;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const offset = circumference - (targetPercent / 100) * circumference;
                ring.style.strokeDashoffset = offset;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(ring);
}

/* ============ 平滑滚动 ============ */
function initSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('data-section');
            if (!sectionId) return; // 非锚点链接(如 /weekly/)，正常跳转
            const section = document.getElementById(sectionId);
            if (section) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============ 鼠标视差效果（Hero 区域） ============ */
(function() {
    const hero = document.querySelector('.hero-visual');
    if (!hero) return;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        hero.style.transform = `translate(${x}px, ${y}px)`;
        hero.style.transition = 'transform 0.3s ease-out';
    });
})();

console.log('%c YSDLAB 履带式巡检车 %c 项目进度看板已就绪 ',
    'background:#00f0ff;color:#000;padding:4px 8px;font-weight:bold;',
    'color:#00f0ff;');
