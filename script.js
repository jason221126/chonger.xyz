// 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-darker/90', 'shadow-lg', 'py-2');
        navbar.classList.remove('py-4');
        
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
      } else {
        navbar.classList.remove('bg-darker/90', 'shadow-lg', 'py-2');
        navbar.classList.add('py-4');
        
        backToTop.classList.add('opacity-0', 'invisible');
        backToTop.classList.remove('opacity-100', 'visible');
      }
    });
    
    // 移动端菜单和下拉菜单
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });
    
    function closeMenu() {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = '';
    }
    
    menuClose.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    // 移动端下拉菜单切换
    mobileDropdowns.forEach(dropdown => {
      const dropdownToggle = dropdown.querySelector('a');
      const dropdownMenu = dropdown.querySelector('.mobile-dropdown-menu');
      
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('hidden');
        
        // 切换箭头方向
        const arrow = this.querySelector('i.fa-angle-down');
        if (dropdownMenu.classList.contains('hidden')) {
          arrow.style.transform = 'rotate(0deg)';
        } else {
          arrow.style.transform = 'rotate(180deg)';
        }
      });
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // 返回顶部
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // 滚动动画
    const animateOnScroll = function() {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('opacity-100', 'translate-y-0');
          element.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };
    
    // 初始化动画元素样式
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      element.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
    });
    
    // 初始检查和滚动监听
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // 数字计数器动画
    const counters = document.querySelectorAll('.counter');
    let counted = false;
    
    const startCounting = function() {
      if (counted) return;
      
      const countersSection = document.querySelector('.counter').closest('section');
      const sectionPosition = countersSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionPosition < windowHeight - 100) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // 动画持续时间（毫秒）
          const frameDuration = 1000 / 60; // 每帧持续时间
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;
          
          const startCount = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);
            
            counter.textContent = currentCount;
            
            if (frame === totalFrames) {
              clearInterval(startCount);
              counter.textContent = target;
            }
          }, frameDuration);
        });
        
        counted = true;
      }
    };
    
    window.addEventListener('scroll', startCounting);
    window.addEventListener('load', startCounting);
    
    // 产品标签切换
    const productTabs = document.querySelectorAll('.product-tab');
    
    productTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // 移除所有标签的active类
        productTabs.forEach(t => {
          t.classList.remove('active', 'bg-primary', 'text-white');
          t.classList.add('bg-light/5', 'text-light/70');
        });
        
        // 给当前点击的标签添加active类
        this.classList.add('active', 'bg-primary', 'text-white');
        this.classList.remove('bg-light/5', 'text-light/70');
        
        // 这里可以添加产品过滤逻辑
      });
    });
    
    // 评价轮播
const slider = document.querySelector('.testimonial-slider');

if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const originalSlides = Array.from(track.querySelectorAll('.testimonial-slide'));
    const prevButton = slider.querySelector('.testimonial-prev');
    const nextButton = slider.querySelector('.testimonial-next');
    const indicatorsContainer = slider.querySelector('.testimonial-indicators');

    let currentPage = 0;
    let pageCount = 0;
    let slidesPerView = 3;

    function debounce(func, wait = 250) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function setupCarousel() {
        slidesPerView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1280 ? 2 : 3);
        pageCount = Math.ceil(originalSlides.length / slidesPerView);
        
        // On resize, make sure currentPage is not out of bounds
        if (currentPage >= pageCount) {
            currentPage = pageCount - 1;
        }

        track.innerHTML = ''; // Clear the track to rebuild pages

        for (let i = 0; i < pageCount; i++) {
            const page = document.createElement('div');
            page.classList.add('testimonial-page', 'flex', 'min-w-full', 'flex-shrink-0');
            
            const pageSlides = originalSlides.slice(i * slidesPerView, (i + 1) * slidesPerView);
            
            pageSlides.forEach(slide => {
                slide.style.width = `${100 / slidesPerView}%`;
                page.appendChild(slide.cloneNode(true)); // Use cloneNode to avoid issues
            });
            track.appendChild(page);
        }

        // Create indicators
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < pageCount; i++) {
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Go to page ${i + 1}`);
                button.classList.add('w-2', 'h-2', 'rounded-full', 'transition-all', 'duration-300', 'bg-light/20');
                button.addEventListener('click', () => {
                    currentPage = i;
                    updateCarouselUI();
                });
                indicatorsContainer.appendChild(button);
            }
        }
        
        updateCarouselUI();
    }

    function updateCarouselUI() {
        if (currentPage < 0) currentPage = 0;
        if (currentPage >= pageCount) currentPage = pageCount - 1;

        track.style.transform = `translateX(-${currentPage * 100}%)`;

        if (indicatorsContainer) {
            Array.from(indicatorsContainer.children).forEach((indicator, index) => {
                indicator.classList.toggle('bg-primary', index === currentPage);
                indicator.classList.toggle('w-4', index === currentPage);
                indicator.classList.toggle('bg-light/20', index !== currentPage);
                indicator.classList.toggle('w-2', index !== currentPage);
            });
        }

        if (prevButton) {
            prevButton.disabled = currentPage === 0;
            prevButton.classList.toggle('opacity-50', currentPage === 0);
            prevButton.classList.toggle('cursor-not-allowed', currentPage === 0);
        }
        if (nextButton) {
            nextButton.disabled = currentPage >= pageCount - 1;
            nextButton.classList.toggle('opacity-50', currentPage >= pageCount - 1);
            nextButton.classList.toggle('cursor-not-allowed', currentPage >= pageCount - 1);
        }
    }

    function handleNext() {
        if (currentPage < pageCount - 1) {
            currentPage++;
            updateCarouselUI();
        }
    }

    function handlePrev() {
        if (currentPage > 0) {
            currentPage--;
            updateCarouselUI();
        }
    }

    if (track && originalSlides.length > 0) {
        // Initial setup
        setupCarousel();

        // Add event listeners
        if (nextButton) nextButton.addEventListener('click', handleNext);
        if (prevButton) prevButton.addEventListener('click', handlePrev);
        window.addEventListener('resize', debounce(setupCarousel));
    }
}

    // 图表
    document.addEventListener('DOMContentLoaded', function() {
      // 图表1: 产品使用增长趋势
      const growthChartCtx = document.getElementById('growthChart').getContext('2d');
      new Chart(growthChartCtx, {
        type: 'line',
        data: {
          labels: ['第一季度', '第二季度', '第三季度', '第四季度'],
          datasets: [{
            label: '用户增长',
            data: [1200, 1900, 3000, 5000],
            borderColor: '#165DFF',
            backgroundColor: 'rgba(22, 93, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // 图表2: 客户行业分布
      const industryChartCtx = document.getElementById('industryChart').getContext('2d');
      new Chart(industryChartCtx, {
        type: 'doughnut',
        data: {
          labels: ['金融科技', '医疗健康', '教育', '电商', '其他'],
          datasets: [{
            label: '客户分布',
            data: [30, 25, 15, 20, 10],
            backgroundColor: ['#165DFF', '#00CFFD', '#7C3AED', '#F97316', '#4B5563'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    });

    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#165DFF',
            secondary: '#00CFFD',
            dark: '#0F172A',
            darker: '#0A0F1C',
            light: '#F1F5F9',
            accent: '#7C3AED'
          },
          fontFamily: {
            inter: ['Inter', 'system-ui', 'sans-serif'],
          },
        },
        
      }
    }
    