/**
 * Venkatesh A - 3D Interactive Portfolio Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. DYNAMIC TYPING EFFECT ---
  const typingTextElement = document.getElementById('dynamic-typing');
  if (typingTextElement) {
    const roles = [
      'Full-Stack Developer',
      'Java & Spring Boot Specialist',
      'MERN Stack Engineer',
      '550+ LeetCode Solved | Rating 1601',
      'NPTEL Java Silver Medalist',
      'CSBS Undergraduate @ KIT'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // --- 2. 3D CARD PERSPECTIVE TILT EFFECT ---
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', handleTiltMove);
    card.addEventListener('mouseleave', handleTiltReset);
    card.addEventListener('mouseenter', handleTiltEnter);
  });

  function handleTiltMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X within card
    const y = e.clientY - rect.top;  // Mouse Y within card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
    
    // Update dynamic reflection glare if present
    const glare = card.querySelector('.card-glare');
    if (glare) {
      const percentageX = (x / rect.width) * 100;
      const percentageY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
    }
  }

  function handleTiltEnter(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
  }

  function handleTiltReset(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.5s ease-in-out, box-shadow 0.3s ease';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    
    const glare = card.querySelector('.card-glare');
    if (glare) {
      glare.style.background = 'none';
    }
  }

  // --- 3. ANIMATED NUMBER STATS COUNTER ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  function runStatsCounter() {
    if (statsTriggered) return;

    const statsSection = document.getElementById('quick-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85) {
      statsTriggered = true;

      statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const suffix = stat.getAttribute('data-suffix') || '';
        const decimals = parseInt(stat.getAttribute('data-decimals')) || 0;
        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            stat.textContent = target.toFixed(decimals) + suffix;
            clearInterval(timer);
          } else {
            stat.textContent = start.toFixed(decimals) + suffix;
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', runStatsCounter);
  runStatsCounter(); // Check on initial page load

  // --- 4. PROJECT MODAL POPUP SYSTEM ---
  const projectData = {
    'ekart': {
      title: 'E-Kart | Full-Stack E-Commerce Platform',
      category: 'Spring Boot • Java • MySQL • React',
      image: './assets/jpeg/work3.jpg',
      overview: 'A robust production-ready full-stack e-commerce web platform engineered with Spring Boot backend REST APIs and a dynamic React frontend interface.',
      highlights: [
        'Built modular Spring Boot microservices handling multi-category inventory, user authentication, and shopping cart workflows.',
        'Implemented secure JWT-based authentication and real-time database transactions with MySQL.',
        'Designed high-performance responsive React components with optimized client-side state management.'
      ],
      tags: ['Spring Boot', 'Java', 'MySQL', 'React', 'REST APIs', 'Maven'],
      github: 'https://github.com/venkateshangamuthu/E-COMMERCE'
    },
    'careconnect': {
      title: 'CareConnect | Social Impact & AI Orphanage Support Platform',
      category: 'React • Node.js • MongoDB • AI Chatbot • Power BI',
      image: './assets/jpeg/work1.jpg',
      overview: 'An end-to-end full-stack donation and event scheduling platform connecting donors directly with verified orphanages to streamline resource distribution.',
      highlights: [
        'Architected donor management and appointment booking modules with transparent donation tracking.',
        'Integrated an intelligent AI Chatbot powered by NLP to automate 70%+ of routine user inquiries.',
        'Constructed custom Power BI financial transparency dashboards for live donor auditing.'
      ],
      tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'AI Chatbot', 'Power BI'],
      github: 'https://github.com/venkateshangamuthu/CareConnect'
    },
    'parentplus': {
      title: 'ParentPlus | Elderly Care & Hospital Assistance Platform',
      category: 'React • Node.js • MongoDB • Express.js',
      image: './assets/jpeg/work1.jpg',
      overview: 'A full-stack MERN healthtech web application specifically engineered with an accessibility-first UI for elderly users to easily book hospital appointments and order medicines online.',
      highlights: [
        'Designed simplified high-contrast UI components with larger tap targets and voice/screen-reader friendly navigation.',
        'Created automated scheduling workflows connecting patients with local health care providers.',
        'Integrated medicine order tracking and digital prescription management.'
      ],
      tags: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Accessibility', 'HealthTech'],
      github: 'https://github.com/venkateshangamuthu/Parentplus'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectData[projId];

      if (data && modal) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-overview').textContent = data.overview;
        document.getElementById('modal-image').src = data.image;

        const highlightsList = document.getElementById('modal-highlights');
        highlightsList.innerHTML = '';
        data.highlights.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          highlightsList.appendChild(li);
        });

        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'tech-pill';
          span.textContent = tag;
          tagsContainer.appendChild(span);
        });

        document.getElementById('modal-github-link').href = data.github;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // --- 5. MOBILE MENU DRAWER TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // --- 6. SMOOTH SCROLL NAVBAR HIGHLIGHT ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // --- 7. CONTACT FORM SUBMISSION & TOAST NOTIFICATION ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showToast('Message Sent Successfully!', 'Thank you Venkatesh will get back to you shortly.');
      }, 1200);
    });
  }

  function showToast(title, message) {
    if (!toast) return;
    toast.querySelector('.toast-title').textContent = title;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
