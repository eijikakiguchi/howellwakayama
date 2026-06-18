/**
 * HOWELL Portfolio LP - Script
 * Minimal and lightweight Vanilla JS interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Header Navigation Sticky/Scroll State
  // ==========================================================================
  const header = document.querySelector('.site-header');
  
  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and add event listener
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });


  // ==========================================================================
  // 2. Mobile Hamburger Menu Toggle
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      siteNav.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        siteNav.classList.remove('active');
      });
    });
  }


  // ==========================================================================
  // 3. Scroll Fade-in Animation (IntersectionObserver)
  // ==========================================================================
  const fadeElements = document.querySelectorAll('.fade-in-trigger');
  
  if ('IntersectionObserver' in window) {
    const fadeObserverOptions = {
      root: null, // default is viewport
      rootMargin: '0px 0px -8% 0px', // trigger slightly before entering viewport center
      threshold: 0.1 // triggers when 10% of element is visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
      fadeObserver.observe(element);
    });
  } else {
    // Fallback for older browsers: show all elements instantly
    fadeElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }

  // ==========================================================================
  // 4. FAQ Accordion
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      item.classList.toggle('active');
    });
  });

  // ==========================================================================
  // 5. YouTube Modal
  // ==========================================================================
  const modal = document.getElementById('youtube-modal');
  if (modal) {
    const overlay = modal.querySelector('.youtube-modal-overlay');
    const closeBtn = modal.querySelector('.youtube-modal-close');
    const videoContainer = modal.querySelector('.youtube-video-container');
    const cards = document.querySelectorAll('.work-card-reels[data-youtube-id]');

    const openModal = (youtubeId) => {
      // iframe生成 (autoplay=1)
      const iframe = document.createElement('iframe');
      
      // エラー153対策: originとwidget_referrerを正規ドメインに偽装してリクエスト
      const originDomain = 'https://howell-wakayama.github.io';
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1&origin=${originDomain}&widget_referrer=${originDomain}`;
      iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      
      videoContainer.innerHTML = '';
      videoContainer.appendChild(iframe);
      
      // スクロール位置を固定
      document.body.style.overflow = 'hidden';
      modal.classList.add('is-active');
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      videoContainer.innerHTML = ''; // 動画停止
      document.body.style.overflow = ''; // スクロール復元
    };

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const youtubeId = card.getAttribute('data-youtube-id');
        if (youtubeId) openModal(youtubeId);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
  }

  // ==========================================================================
  // 6. Contact Form Submission
  // ==========================================================================
  const contactForm = document.getElementById('consultation-form');
  const successMessage = document.getElementById('form-success-message');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = '送信中...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // 成功時
          contactForm.style.display = 'none';
          successMessage.style.display = 'block';
          // 該当セクションまでスクロール
          const contactSection = document.getElementById('contact');
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // エラー時
          alert('送信に失敗しました。時間をおいて再度お試しください。');
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        alert('通信エラーが発生しました。ネットワーク環境をご確認ください。');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
