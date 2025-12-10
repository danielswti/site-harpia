jQuery(function ($) {

	$(document).ready(function() {
		
		"use strict";
		
		PageLoad(); 
		ScrollEffects();
		Sliders();	 
		FirstLoad(); 
		PageLoadActions(); 
		FitThumbScreenGSAP();
		ShowcaseCarousel();
		ShowcaseSlider();
		ShowcasePortfolio();	
		ShowcaseLists();
		ShowcaseGallery();		
		FitThumbScreenWEBGL();
		Shortcodes();		
		Core();
		JustifiedGrid();
		Lightbox();
		ContactForm();	
		PlayVideo();
		ContactMap();
		CustomFunction();
		HeroResponsiveBackground();
	});
	
	
/*--------------------------------------------------
Function CustomFunction
---------------------------------------------------*/

function CustomFunction() {

    //Add here your custom js code

	// Sticky do título no portfólio da home
	if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
		gsap.registerPlugin(ScrollTrigger);

		const portfolioRow   = document.querySelector('.portfolio-row');
		const portfolioTitle = document.querySelector('#portfolio-title');

		if (portfolioRow && portfolioTitle) {

			const mm = gsap.matchMedia();
			
			// Full HD DESKTOP
			mm.add("(min-width: 1920px)", () => {
				ScrollTrigger.create({
					trigger: portfolioRow,
					start: "top 15%",
					end: "bottom bottom-=40%",
					pin: portfolioTitle,
					pinSpacing: false
					// markers: true
				});
			});

			// Notebook
			mm.add("(min-width: 1025px) and (max-width: 1919px)", () => {
				ScrollTrigger.create({
					trigger: portfolioRow,
					start: "top 20%",
					end: "bottom bottom-=42%",
					pin: portfolioTitle,
					pinSpacing: false
					// markers: true
				});
			});

			// MOBILE / TABLET
			mm.add("(max-width: 1024px)", () => {
				ScrollTrigger.create({
					trigger: portfolioRow,
					start: "top 26%",      // ajusta conforme o layout mobile
					end: "bottom bottom-=55%",     // aqui ele solta quando a seção termina
					pin: portfolioTitle,
					pinSpacing: false
					// markers: true
				});
			});
		}
	}


	// ============
    // LINKS DO PORTFÓLIO (SHOWCASE GALLERY)
    // ============
    const gallerySlides = document.querySelectorAll('.showcase-gallery .clapat-slide');

    gallerySlides.forEach(slide => {
        const link = slide.querySelector('a.slide-link');
        if (!link) return;

        // tudo isso deve abrir o projeto
        const clickTargets = slide.querySelectorAll(
            '.trigger-item, .trigger-item-link, .img-mask, .section-image'
        );

        clickTargets.forEach(target => {
            target.style.cursor = 'pointer';

            // evita múltiplos listeners se o Ajax recarregar
            target.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // impede o grid/preview do Clapat

                const href = link.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            }, { passive: false });
        });
    });
	
	// ============
    // Método 3600 de contadores animados
    // ============
	if (typeof window !== "undefined" && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    let device_width = window.innerWidth;

    // Estado inicial dos cards
    gsap.set(".counter_animation .counter__anim", { y: -100, opacity: 0 });

    // MOBILE – anima cada card individualmente quando entra na viewport
    if (device_width < 1023) {
        const counterArray = gsap.utils.toArray(".counter_animation .counter__anim");

        counterArray.forEach((item) => {
            let counterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%", // um pouco antes de entrar totalmente na tela
                    toggleActions: "play none none none"
                }
            });

            counterTl.to(item, {
                y: 0,
                opacity: 1,
                ease: "bounce.out",
                duration: 1.5
            });
        });

    // DESKTOP – todos entram juntos com stagger
    } else {
        gsap.to(".counter_animation .counter__anim", {
            scrollTrigger: {
                trigger: ".counter_animation",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            ease: "bounce.out",
            duration: 1.5,
            stagger: {
                each: 0.3
            }
        });
    }

    // CONTADOR NUMÉRICO (usando data-target e mantendo o "+", se existir)
    const numbers = gsap.utils.toArray(".counter__number");

    numbers.forEach((el) => {
        const targetAttr = el.getAttribute("data-target");
        const finalValue = targetAttr ? parseInt(targetAttr, 10) : parseInt(el.textContent, 10) || 0;
        const hasPlus = /\+/.test(el.textContent);

        const counterObj = { value: 0 };

        gsap.to(counterObj, {
            value: finalValue,
            duration: 1,
            delay: 0.3,
            ease: "power1.in",
            snap: { value: 1 },
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            onUpdate: () => {
                const current = Math.floor(counterObj.value);
                el.textContent = current + (hasPlus ? "+" : "");
            }
        });
    });

	document.querySelectorAll('.hb-method-column').forEach((col) => {
	const toggle = col.querySelector('.hb-method-toggle');
	const panel  = col.querySelector('.hb-method-panel');
	if (!toggle || !panel) return;

	// clique (funciona em desktop e mobile)
	toggle.addEventListener('click', (e) => {
		e.preventDefault();
		const isOpen = col.classList.toggle('is-open');
		toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	});

	// hover só para dispositivos com hover real (desktop)
	if (window.matchMedia('(hover: hover)').matches) {
		col.addEventListener('mouseenter', () => {
		col.classList.add('is-open');
		toggle.setAttribute('aria-expanded', 'true');
		});
		col.addEventListener('mouseleave', () => {
		col.classList.remove('is-open');
		toggle.setAttribute('aria-expanded', 'false');
		});
	}
	});
	
	// Navegação de projetos com GSAP (3 capas)
	if (typeof gsap !== "undefined") {
		const cards = gsap.utils.toArray('.hb-project-card');
		if (cards.length) {
			let activeIndex = cards.findIndex(card => card.classList.contains('is-active'));
			if (activeIndex === -1) activeIndex = 1;

			const isMobileDevice = () => {
				if (typeof window === 'undefined') return false;
				if (typeof window.isMobile === 'function') return window.isMobile();
				return window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(hover: none)').matches;
			};

			function applyLayout() {
				const isMobile = isMobileDevice();
				
				cards.forEach((card, i) => {
					const isActive = i === activeIndex;
					const bg = card.querySelector('.hb-project-bg');
					const info = card.querySelector('.hb-project-info-v2');

					// Mobile: ativo 80%, inativos 10% | Desktop: ativo 70%, inativos 15%
					const activeBasis = isMobile ? '80%' : '70%';
					const inactiveBasis = isMobile ? '10%' : '15%';

					gsap.to(card, {
						flexBasis: isActive ? activeBasis : inactiveBasis,
						duration: 0.6,
						ease: 'power3.inOut'
					});

					if (bg) {
						gsap.to(bg, {
							scale: isActive ? 1.02 : 1,
							filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
							duration: 0.6,
							ease: 'power3.inOut'
						});
					}

					// Anima info no mobile: fade da esquerda para direita
					if (info && isMobile) {
						gsap.to(info, {
							opacity: isActive ? 1 : 0,
							x: isActive ? 0 : -20,
							duration: 0.5,
							ease: 'power2.out'
						});
					}
				});
			}

			function setActive(index) {
				activeIndex = index;

				cards.forEach((card, i) => {
					card.classList.toggle('is-active', i === activeIndex);
					card.classList.toggle('is-left',   i <  activeIndex);
					card.classList.toggle('is-right',  i >  activeIndex);
				});

				applyLayout();
			}

			// Mobile: desabilita links originais e adiciona botão de navegação
			if (isMobileDevice()) {
				cards.forEach((card, index) => {
					const link = card.querySelector('.hb-project-link');
					if (!link) return;

					const href = link.getAttribute('href');
					if (!href) return;

					// Desabilita o link original no mobile
					link.style.pointerEvents = 'none';

					// Cria o botão de navegação
					const navBtn = document.createElement('a');
					navBtn.href = href;
					navBtn.className = 'hb-project-nav-btn';
					navBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';
					
					// Insere o botão dentro do card
					card.appendChild(navBtn);

					// Clique no botão navega com animação
					navBtn.addEventListener('click', (e) => {
						e.preventDefault();
						e.stopPropagation();

						const bg = card.querySelector('.hb-project-bg');

						const tl = gsap.timeline({
							onComplete() {
								window.location.href = href;
							}
						});

						if (bg) {
							tl.to(bg, {
								scale: 1.08,
								duration: 0.4,
								ease: 'power2.out'
							}).to(bg, {
								opacity: 0.0,
								duration: 0.3,
								ease: 'power2.in'
							}, '-=0.1');
						} else {
							tl.to(card, { duration: 0.2 });
						}
					});

					// Toque no card expande (apenas tap, não interfere com scroll)
					let touchStartY = 0;
					let touchStartX = 0;
					
					card.addEventListener('touchstart', (e) => {
						touchStartY = e.touches[0].clientY;
						touchStartX = e.touches[0].clientX;
					}, { passive: true });

					card.addEventListener('touchend', (e) => {
						// Ignora se clicou no botão
						if (e.target.closest('.hb-project-nav-btn')) return;
						
						const touchEndY = e.changedTouches[0].clientY;
						const touchEndX = e.changedTouches[0].clientX;
						const deltaY = Math.abs(touchEndY - touchStartY);
						const deltaX = Math.abs(touchEndX - touchStartX);
						
						// Se moveu mais de 10px, é scroll, não tap
						if (deltaY > 10 || deltaX > 10) return;
						
						if (index !== activeIndex) {
							setActive(index);
						}
					}, { passive: true });
				});
			}

			// layout inicial
			setActive(activeIndex);

			// recalcula ao redimensionar (desktop/mobile)
			window.addEventListener('resize', applyLayout);

			// Desktop: Hover e clique
			if (!isMobileDevice()) {
				// Hover em desktop
				if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
					cards.forEach((card, index) => {
						card.addEventListener('mouseenter', () => {
							if (index !== activeIndex) {
								setActive(index);
							}
						});
					});
				}

				// Clique navega
				cards.forEach((card, index) => {
					const link = card.querySelector('.hb-project-link');
					if (!link) return;

					link.addEventListener('click', (e) => {
						e.preventDefault();

						const href = link.getAttribute('href');
						if (!href) return;

						const bg = card.querySelector('.hb-project-bg');

						const tl = gsap.timeline({
							onComplete() {
								window.location.href = href;
							}
						});

						if (bg) {
							tl.to(bg, {
								scale: 1.08,
								duration: 0.4,
								ease: 'power2.out'
							}).to(bg, {
								opacity: 0.0,
								duration: 0.3,
								ease: 'power2.in'
							}, '-=0.1');
						} else {
							tl.to(card, { duration: 0.2 });
						}
					});
				});
			}
		}
	}
}

    // ==========================
    // HERO MINIMAL SLIDER
    // ==========================
    if (typeof gsap !== "undefined") {
        initHeroMinimalSlider();
    }

    function initHeroMinimalSlider() {
        const slider = document.querySelector('.hb-hero-slider');
        if (!slider) {
            console.log('[HeroSlider] .hb-hero-slider NÃO encontrado');
            return;
        }

        const slides = Array.from(slider.querySelectorAll('.hb-hero-slide'));
        const currentEl = slider.querySelector('.hb-hero-current');
        const totalEl   = slider.querySelector('.hb-hero-total');

        if (!slides.length) {
            console.log('[HeroSlider] Nenhum .hb-hero-slide encontrado');
            return;
        }

		console.log('[HeroSlider] Inicializando com', slides.length, 'slides');

		let currentIndex = slides.findIndex(s => s.classList.contains('is-active'));
		if (currentIndex === -1) currentIndex = 0;
		let isAnimating = false;
		const hasMultipleSlides = slides.length > 1;
		const AUTO_DELAY = 4000;
		let autoTimer = null;

		function pauseAutoAdvance() {
			if (!autoTimer) return;
			clearTimeout(autoTimer);
			autoTimer = null;
		}

		function scheduleAutoAdvance() {
			if (!hasMultipleSlides) return;
			pauseAutoAdvance();
			autoTimer = setTimeout(() => {
				goToSlide(currentIndex + 1, 1);
			}, AUTO_DELAY);
		}

        // Atualiza contador
        if (totalEl)   totalEl.textContent   = String(slides.length).padStart(2, '0');
        if (currentEl) currentEl.textContent = String(currentIndex + 1).padStart(2, '0');

        // Estado visual inicial
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                gsap.set(slide, { opacity: 1, xPercent: 0, scale: 1, zIndex: 2 });
                slide.classList.add('is-active');
            } else {
                gsap.set(slide, { opacity: 0, xPercent: 0, scale: 1, zIndex: 0 });
                slide.classList.remove('is-active');
            }
        });

		scheduleAutoAdvance();

        function goToSlide(newIndex, direction) {
            if (isAnimating || newIndex === currentIndex) return;

            // loop infinito
            if (newIndex < 0) newIndex = slides.length - 1;
            if (newIndex >= slides.length) newIndex = 0;

            const fromSlide = slides[currentIndex];
            const toSlide   = slides[newIndex];
            const dir       = direction || 1; // 1 = próximo, -1 = anterior

            isAnimating = true;
			pauseAutoAdvance();

            // posição inicial do destino
            gsap.set(toSlide, {
                xPercent: 10 * dir,
                opacity: 0,
                scale: 1.02,
                zIndex: 3
            });
            gsap.set(fromSlide, {
                xPercent: 0,
                opacity: 1,
                scale: 1,
                zIndex: 2
            });

            const tl = gsap.timeline({
                defaults: { duration: 0.7, ease: "power3.out" },
                onComplete: () => {
                    fromSlide.classList.remove('is-active');
                    toSlide.classList.add('is-active');

                    gsap.set(fromSlide, { opacity: 0, xPercent: 0, scale: 1, zIndex: 0 });
                    gsap.set(toSlide,   { opacity: 1, xPercent: 0, scale: 1, zIndex: 2 });

                    currentIndex = newIndex;
                    if (currentEl) {
                        currentEl.textContent = String(currentIndex + 1).padStart(2, '0');
                    }
                    isAnimating = false;
					scheduleAutoAdvance();
                }
            });

            tl.to(fromSlide, {
                xPercent: -10 * dir,
                opacity: 0,
                scale: 0.98
            }, 0).to(toSlide, {
                xPercent: 0,
                opacity: 1,
                scale: 1
            }, 0);
        }

        // --------------------------------
        // 2) SWIPE: mouse + touch
        // --------------------------------
		let isDown = false;
		let startX = 0;
		let startY = 0;
		let lastX  = 0;
		let lastY  = 0;
		let movedDuringDrag = false;
		let blockNextClick = false;
        const SWIPE_THRESHOLD = 40; // px
		const CLICK_DRAG_THRESHOLD = 6;

        function startDrag(x, y) {
            isDown = true;
            startX = x;
            startY = y;
            lastX  = x;
            lastY  = y;
			movedDuringDrag = false;
			blockNextClick = false;
			pauseAutoAdvance();
        }

        function moveDrag(x, y) {
            if (!isDown) return;
            lastX = x;
            lastY = y;

			if (!movedDuringDrag) {
				const delta = Math.max(Math.abs(lastX - startX), Math.abs(lastY - startY));
				if (delta > CLICK_DRAG_THRESHOLD) {
					movedDuringDrag = true;
					blockNextClick = true;
				}
			}
        }

        function endDrag() {
            if (!isDown) return;
            isDown = false;

            const dx = lastX - startX;
            const dy = lastY - startY;

            // Só considera swipe se horizontal for dominante
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
                if (dx < 0) {
                    // arrastou pra esquerda -> próximo
                    goToSlide(currentIndex + 1, 1);
                } else {
                    // arrastou pra direita -> anterior
                    goToSlide(currentIndex - 1, -1);
                }
			} else {
				scheduleAutoAdvance();
            }

			if (!movedDuringDrag) {
				blockNextClick = false;
			}
			movedDuringDrag = false;
        }

        // Touch
		slider.addEventListener('touchstart', (e) => {
			if (!e.touches || !e.touches.length) return;
			const t = e.touches[0];
			startDrag(t.clientX, t.clientY);
		}, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!e.touches || !e.touches.length) return;
            const t = e.touches[0];
            moveDrag(t.clientX, t.clientY);
        }, { passive: false });

        slider.addEventListener('touchend', endDrag);
        slider.addEventListener('touchcancel', endDrag);

        // Mouse
		slider.addEventListener('mousedown', (e) => {
			startDrag(e.clientX, e.clientY);
		});

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            moveDrag(e.clientX, e.clientY);
        });

        window.addEventListener('mouseup', endDrag);
        window.addEventListener('mouseleave', endDrag);

		slider.addEventListener('dragstart', (e) => {
			e.preventDefault();
		});

		slider.addEventListener('click', (e) => {
			if (!blockNextClick) return;
			e.preventDefault();
			e.stopPropagation();
			blockNextClick = false;
		}, true);
    }

}// End CustomFunction

/*--------------------------------------------------
Hero Responsive Background
---------------------------------------------------*/

function HeroResponsiveBackground() {
	if (typeof window === "undefined" || typeof document === "undefined") {
		return;
	}

	if (window.__heroBgMediaQuery && window.__heroBgMediaQuery.mq && window.__heroBgMediaQuery.listener) {
		const { mq, listener } = window.__heroBgMediaQuery;
		if (typeof mq.removeEventListener === 'function') {
			mq.removeEventListener('change', listener);
		} else if (typeof mq.removeListener === 'function') {
			mq.removeListener(listener);
		}
	}
	window.__heroBgMediaQuery = null;

	const heroBackgrounds = document.querySelectorAll('[data-mobile-bg]');
	if (!heroBackgrounds.length) {
		return;
	}

	heroBackgrounds.forEach((element) => {
		if (!element.dataset.desktopBgOriginal) {
			let desktopBg = element.style.backgroundImage && element.style.backgroundImage !== 'none'
				? element.style.backgroundImage
				: '';
			if (!desktopBg) {
				const computedBg = window.getComputedStyle(element).backgroundImage;
				if (computedBg && computedBg !== 'none') {
					desktopBg = computedBg;
				}
			}
			element.dataset.desktopBgOriginal = desktopBg || '';
		}
	});

	const mediaQuery = window.matchMedia('(max-width: 768px)');

	const applyBackgrounds = () => {
		const isMobile = mediaQuery.matches;
		heroBackgrounds.forEach((element) => {
			const mobileBg = element.getAttribute('data-mobile-bg');
			if (!mobileBg) {
				return;
			}

			if (isMobile) {
				element.style.backgroundImage = `url(${mobileBg})`;
			} else if (element.dataset.desktopBgOriginal) {
				element.style.backgroundImage = element.dataset.desktopBgOriginal;
			} else {
				element.style.removeProperty('background-image');
			}
		});
	};

	applyBackgrounds();

	const mqListener = () => applyBackgrounds();
	if (typeof mediaQuery.addEventListener === 'function') {
		mediaQuery.addEventListener('change', mqListener);
	} else if (typeof mediaQuery.addListener === 'function') {
		mediaQuery.addListener(mqListener);
	}
	window.__heroBgMediaQuery = { mq: mediaQuery, listener: mqListener };
}
	
/*--------------------------------------------------
	Function Cleanup Before Ajax
---------------------------------------------------*/	
	
	function CleanupBeforeAjax(){		
		// reset all scroll triggers
		let triggers = ScrollTrigger.getAll();
		triggers.forEach( trigger => {			
		  	trigger.kill();
		});
		
		ClapatSlider.instances.forEach(slider => slider.off());
		ClapatSlider.instances = [];
	}			

/*--------------------------------------------------
Function Page Load
---------------------------------------------------*/

	function PageLoad() {
		
		gsap.set($(".menu-timeline .before-span"), {y: 120, opacity:0});
		
		// Page Navigation Events
		$(".preloader-wrap").on('mouseenter', function() {	
			var $this = $(this);			
			gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
			gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
			$("#ball").addClass("with-blur");
			$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );				
		});
							
		$(".preloader-wrap").on('mouseleave', function() {					
			gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
			gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
			$("#ball").removeClass("with-blur");
			$('#ball p').remove();			
		});
		
		$('body').removeClass('hidden').removeClass('hidden-ball');
		
		gsap.to($("#header-container"), {duration: 0.5, opacity:1, delay:0.2, ease:Power2.easeOut}); 
		
		
		function initOnFirstLoad() {
		
			imagesLoaded('body', function() {
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$('#ball p').remove();
				gsap.to($(".percentage-wrapper"), {duration: 0.7, x:$(".trackbar").width()*0.5 - $(".percentage-wrapper").width() * 0.5, delay:0.3, ease:Power4.easeOut});
				gsap.to($(".percentage"), {duration: 0.7, opacity:0, y:-100, delay:1, ease:Power4.easeInOut});
				gsap.to($(".percentage-intro"), {duration: 0.5, opacity:0, delay:0.6, ease:Power4.easeInOut});
				gsap.to($(".preloader-intro span"), {duration: 0.7, opacity:0, xPercent: -101, delay:0.3, ease:Power4.easeOut});						
				gsap.to($(".preloader-wrap"), {duration: 0.7, opacity:0, delay:1.6, ease:Power2.easeOut});
				gsap.set($(".preloader-wrap"), {visibility:'hidden', delay:2, yPercent: -101});										
				
				setTimeout(function(){
					$("#ball").removeClass("with-blur");
					
					gsap.to($(".header-middle, #footer-container"), {duration: 1, opacity:1, delay:0, ease:Power2.easeOut});
					
					if( $('.hero-video-wrapper').length > 0 ){
						$('#hero-image-wrapper').find('video').each(function() {
							$(this).get(0).play();
						});
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0, ease:Power2.easeOut}); 
					}
					
					gsap.to($("#main"), {duration: 0, opacity:1, delay:0, ease:Power2.easeOut});
					
					if( $('#hero').hasClass("has-image")) {								
						gsap.set($("#hero-bg-image"), {scale:1.1 , opacity:0});
						gsap.set($("#hero-caption .hero-title span"), {y: 120, opacity:0});					
						gsap.set($("#hero-caption .hero-subtitle span"), {y: 30, opacity:0});
						
						gsap.to($("#hero-bg-image"), {duration: 1, scale:1 , opacity:1, delay:0.2, ease:Power2.easeOut});
						gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, y: 0, opacity:1, stagger:0.1, delay:0.7, ease:Power3.easeOut, onComplete: function() {
							gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 1, y:0, opacity:1, delay:0, ease:Power2.easeOut});																				
							gsap.to($("#main-page-content, #page-nav"), {duration: 0.4, opacity:1, delay:0, ease:Power2.easeOut});
						}});
						
					} else {													
						gsap.set($("#hero-caption .hero-title span"), {y: 120, opacity:0});					
						gsap.set($("#hero-caption .hero-subtitle span"), {y: 30, opacity:0});
						
						gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, y: 0, opacity:1, stagger:0.1, delay:0.8, ease:Power3.easeOut, onComplete: function() {							
							gsap.to($(".error-button"), {duration: 0.3, y: 0, opacity:1, rotation:0, delay:0, ease:Power2.easeOut});
						}});
						
						gsap.to($("#main-page-content, #page-nav"), {duration: 0.3, opacity:1, delay:1.4, ease:Power2.easeOut});
						
						gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, delay:1.3, ease:Power2.easeOut, onComplete: function() {
							$("#hero-footer.has-border").addClass("visible");																			
						}});
										
					}	
					
					
					// Fading In Showcase Carousel elements on Finised
					gsap.set($(".showcase-carousel .clapat-slider .slide-inner"), {opacity:0});
					gsap.to($(".showcase-carousel .clapat-slider .clapat-slide .slide-inner"), {duration: 2, opacity:1, delay:0.75, ease:Power4.easeOut});
					
					gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-prev-two .slide-inner"), {yPercent:260});
					gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-prev-two .slide-inner"), {duration: 1.8, yPercent:0, delay:0.6, ease:Power4.easeOut});
					
					gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-prev .slide-inner"), {yPercent:-210});
					gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-prev .slide-inner"), {duration: 1.8, yPercent:0, delay:0.65, ease:Power4.easeOut});
					
					gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-active .slide-inner"), {yPercent:160});
					gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-active .slide-inner"), {duration: 1.8, yPercent:0, delay:0.7,  ease:Power4.easeOut, onComplete: function() {
							$('body').removeClass(" disable-scroll");
						}
					});
					
					gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-next .slide-inner"), {yPercent:-210});
					gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-next .slide-inner"), {duration: 1.8, yPercent:0, delay:0.65, ease:Power4.easeOut});
					
					gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-next-two .slide-inner"), {yPercent:260});
					gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-next-two .slide-inner"), {duration: 1.8, yPercent:0, delay:0.6, ease:Power4.easeOut});
									
					// Fading In Showcase Slider elements on Finised
					gsap.set($(".showcase-slider .clapat-slider .slide-inner"), {opacity:0});
					gsap.to($(".showcase-slider .clapat-slider .clapat-slide .slide-inner"), {duration: 1.2, opacity:1, scale:1, delay:0.7, ease:Power4.easeOut});
					gsap.set($(".showcase-slider .slide-title span"), {y: 100, opacity:0});
					gsap.to($(".showcase-slider .slide-title span"), {duration: 0.7, y: 0, opacity:1, delay:0.7, ease:Power4.easeOut});
					
										
					// Fading In Showcase Portfolio elements on Finised
					gsap.set($(".showcase-portfolio .img-mask.animated"), {scaleY:1.1, y:100, opacity:0, filter: 'brightness(150%)'});						
					gsap.to($(".showcase-portfolio .img-mask.animated"), {duration: 0.7, scaleY:1, y:0, opacity:1, stagger:0.1, delay:1.4, filter: 'brightness(100%)', ease:Power2.easeOut});
					
										
					// Fading In Showcase Lists elements on Finised
					gsap.set($(".showcase-lists .slide-title span"), {y: 100, opacity:0});
					
					if (!isMobile()) {	
						gsap.to($(".showcase-lists .slide-title span"), {duration: 0.4, y: 0, opacity:1, stagger:0.05, delay:0.5, ease:Power3.easeOut});
					} else {
						gsap.to($(".showcase-lists .slide-title span"), {duration: 0.4, y: 0, opacity:1, stagger:0.01, delay:0.5, ease:Power3.easeOut});
					}
					
										
					// Fading In Showcase Gallery elements on Finised
					gsap.set($(".showcase-gallery .slide-hero-title span, .showcase-gallery .slide-hero-subtitle span"), { y: 120, opacity: 0 });
					gsap.to($(".showcase-gallery .slider-fixed-content .caption-timeline span"), { duration: 0.7, y: 0, opacity: 1, stagger: 0.1, delay: 0.9, ease: Power3.easeOut });
					
					gsap.set($(".showcase-gallery .clapat-slider .slide-inner"), { opacity: 0 });
					gsap.to($(".showcase-gallery .clapat-slider .clapat-slide .slide-inner"), { duration: 2, opacity: 1, delay: 0.2, ease: Power4.easeOut });
					
					var gallerySlideClasses = [".clapat-slide-prev-two", ".clapat-slide-prev", ".clapat-slide-active", ".clapat-slide-next", ".clapat-slide-next-two"];
					
					gallerySlideClasses.forEach(function(gallerySlideClass, index) {
						var gallerySlide = $(".showcase-gallery .clapat-slider " + gallerySlideClass + " .slide-inner");
						var delay = 0.4 + index * 0.1;						
						gsap.set(gallerySlide, { yPercent: 250 });
						gsap.to(gallerySlide, { duration: 1.5, yPercent: 0, delay: delay, ease: Power4.easeOut });
					});
					
					
					// Fading In Showcase Footer Elements
					gsap.set($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {opacity:0});
					gsap.to($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {duration: 0.4, opacity:1, delay:0.8, ease:Power3.easeOut});
					
					var bullets = document.querySelectorAll(".showcase-carousel .clapat-pagination-bullet");
					var initialHeights = Array.from(bullets).map(function(bullet) {
					  	return bullet.clientHeight + "px";
					});
					
					gsap.set(bullets, { height: 0 });
					gsap.to(bullets, {
					  	duration: 0.3,
						delay:1, 
					  	height: function(index, target) {
							return initialHeights[index];
					  	},
					  	ease:Power3.easeOut,
					  	stagger: 0.05,
						onComplete: function() {
							gsap.set(bullets, { height: "" });;
						  }
					});

					
					
					$('body').addClass("header-visible");
					
				} , 800 );
			});
				
		}
		
		
		if (!$('body').hasClass("disable-ajaxload")) {
			
			
			var width = 0,
				perfData = window.performance.timing, 
				EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
				time = ((EstimatedTime/100)%500) * 10
				
			// Loadbar Animation
			$(".loadbar").animate({
				width: width + "%"
			}, time  );	
			
			// Percentage Increment Animation
			var PercentageID = $("#precent"),
					start = 0,
					end = 100,
					durataion = time + 0;
					animateValue(PercentageID, start, end, durataion);
					
			function animateValue(id, start, end, duration) {
			  
				var range = end - start,
				  current = start,
				  increment = end > start? 1 : -1,
				  stepTime = Math.abs(Math.floor(duration / range)),
				  obj = $(id);
				
				var timer = setInterval(function() {
					current += increment;
					$(obj).text(current);
				  //obj.innerHTML = current;
					if (current == end) {
						clearInterval(timer);
					}
				}, stepTime);
			}
			
			// Fading Out Loadbar on Finised
			setTimeout(function(){				
				initOnFirstLoad();						  
			}, time);
		
		} else {			
			initOnFirstLoad();
		}
		
		
	}// End Page Load

	
	
/*--------------------------------------------------
Page Load Actions
---------------------------------------------------*/	
	
	function PageLoadActions() {
		
		
		// Default Page Navigation Load Events
		
		if (!isMobile()) {			
			
			
			$("#page-nav .page-title").on('mouseenter', function() {
				var $this = $(this);			
				gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(128,128,128,0.5)"});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
				$("#ball").addClass("with-blur");
				$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );				
			});
								
			$("#page-nav .page-title").on('mouseleave', function() {				
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();			
			});
					
		}		
		
		if (!$("body").hasClass("disable-ajaxload")) {
			$('#page-nav .page-title').on('click', function() {	
				$("body").addClass("show-loader");
				$('header').removeClass('white-header');
				$("#app").remove();
				$(".big-title-caption").remove();	
					
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon");
				$('#ball p').remove();
				$('#ball i').remove();
				
				gsap.to('.hero-arrow i', {duration: 0.3, y:-40, opacity:0, delay:0, ease:Power2.easeInOut});				
				gsap.to('.page-nav-caption .caption-timeline span', {duration: 0.3, y:-100, opacity:0, delay:0, stagger:0.05, ease:Power2.easeInOut});
				gsap.to($("#main-page-content, #hero, footer"), {duration: 0.3, opacity:0});
			});
		} else if ($("body").hasClass("disable-ajaxload")) {
			$('#page-nav .page-title').on('click', function() {					
				$("body").addClass("load-next-page");
				$("body").addClass("show-loader");
				$('header').removeClass('white-header');
				$("#app").remove();
				$(".big-title-caption").remove();	
					
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon");
				$('#ball p').remove();
				$('#ball i').remove();
				
				gsap.to($("#main-page-content, #hero, #page-nav"), {duration: 0.3, opacity:0});
				gsap.to($("footer"), {duration: 0.3, opacity:0, delay:0, ease:Power2.easeInOut});
			});
		}
		
		
		// Project Page Navigation Load Events
		if (!isMobile()) {
			
			$("#project-nav .next-ajax-link-project").mouseenter(function(e) {	
				var $this = $(this);		
				$( "#ball" ).append( '<p class="first">' + $this.data("firstline") + '</p>' + '<p>' + $this.data("secondline") + '</p>' );
				gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
				$("#ball").addClass("with-blur");
				$("#project-nav .next-hero-title").addClass('hover-title');				
			});
							
			$("#project-nav .next-ajax-link-project").mouseleave(function(e) {
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
				$("#project-nav .next-hero-title").removeClass('hover-title');
			});
		}
		
		if (!$("body").hasClass("disable-ajaxload")) {
			
			
			
			if ($(".next-ajax-link-project").hasClass("auto-trigger")) {
				
				if ( !(typeof window.ReachBottomArr === 'undefined' || window.ReachBottomArr === null) && Array.isArray( window.ReachBottomArr ) ) {
					
					window.ReachBottomArr.forEach( element => {						
						element.kill();
					});
				}
				
				window.ReachBottomArr = new Array();
				
				setTimeout(function() {	
					$('#project-nav').each(function(){
						var $this = $(this);
						const ReachBottom = ScrollTrigger.create({
							id: Math.floor(Math.random() * 100),
							trigger: $("#project-nav"),
							
							start: () => `top+=${window.innerHeight - 10}px`,
							onEnter: function( st ) { 
								$("body").addClass("show-loader");						
								$this.delay(500).queue(function() {
									
									gsap.set($("#project-nav.change-header, .next-hero-progress"), {backgroundColor:"transparent"});
									gsap.to($(".next-hero-progress"), {duration: 0.4, width:"0%", ease:Power4.easeOut,onComplete: function() {
										gsap.set($(".next-hero-progress"), {opacity:0});
									}});
									
									var link = $this.find('.next-ajax-link-project');
									link.trigger('click');
								});												
							},
							onLeaveBack: function() { 
								$("body").removeClass("show-loader");						
								$this.clearQueue();											
							}
						});				
						window.ReachBottomArr.push(ReachBottom);				
						imagesLoaded('body', function() {
							setTimeout( function(){
								ReachBottom.refresh()	
							} , 1200 );
						});						
					});
				}, 100);			
			}
			
			if( $('#hero-image-wrapper').hasClass("change-header-color")) {
				$('#hero-footer').addClass("white-header");	
			}	
			
			$('.next-ajax-link-project').on('click', function() {					
				$("body").addClass("load-project-thumb");
				$('header').removeClass('white-header');
				$("#app").remove();
				$('.next-project-image-wrapper').addClass("temporary").appendTo('body');
				
				if (!$(".next-ajax-link-project").hasClass("auto-trigger")) {
					$("body").addClass("show-loader");
				}				
				
				gsap.to($(".next-hero-counter span"), {duration: 0.3, y:-20, opacity:0, delay:0, ease:Power2.easeInOut});
				gsap.to($(".next-hero-title span"), {duration: 0.3, y:-80, opacity:0, stagger:0.05, delay:0, ease:Power2.easeInOut});
				gsap.to($(".next-hero-subtitle span"), {duration: 0.3, y:-40, opacity:0, stagger:0.05, delay:0.1, ease:Power2.easeInOut});
				
				gsap.set($("#project-nav.change-header, .next-hero-progress"), {backgroundColor:"transparent"});
				gsap.to($(".next-hero-progress span"), {duration: 0.4, width:"100%", ease:Power2.easeInOut,onComplete: function() {
					gsap.to($(".next-hero-progress"), {duration: 0.4, width:"0%", ease:Power2.easeInOut});
				}});
					
				gsap.to('#ball', {duration: 0.3, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.3, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon");
				$('#ball p').remove();
				$('#ball i').remove();
				
				gsap.to($("#main-page-content, #hero, #hero-image-wrapper"), {duration: 0.3, opacity:0});			
				gsap.to($(".next-project-image"), {duration: 0.6, scale:1.02, clipPath: 'inset(0 0%)', opacity:1, ease:Power2.easeInOut,onComplete: function() {
				  $('.temporary .next-project-image').addClass("visible")
				}});
				gsap.to($("footer, .all-works"), {duration: 0.3, opacity:0, ease:Power2.easeInOut});
			});
		} else if ($("body").hasClass("disable-ajaxload")) {
			$('.next-ajax-link-project').on('click', function() {					
				$("body").addClass("load-project-thumb-with-title").addClass("show-loader");							
				$('header').removeClass('white-header');
				$("#app").remove();									
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-icon with-blur");
				$('#ball p').remove();
				$('#ball i').remove();				
				gsap.to($("#main-page-content, #hero, #hero-image-wrapper, #project-nav"), {duration: 0.3, opacity:0});			
				gsap.to($(".next-project-image"), {duration: 0.6, scale:1, opacity: 0, ease:Power2.easeOut});
				gsap.to($("footer, .all-works"), {duration: 0.3, opacity:0, ease:Power2.easeInOut});							
			});
		}
		
		
	}// Page Load Actions
	
	

	
/*--------------------------------------------------
Function Lazy Load
---------------------------------------------------*/

	function LazyLoad() {	
		
		
		imagesLoaded('body', function() {
			$('body').removeClass('loading hidden scale-up scale-none');
			gsap.to($("#header-container, .header-middle"), {duration: 1, opacity:1, ease:Power2.easeOut});
		});
		
		gsap.to($("#main"), {duration: 0.3, opacity:1, delay:0, ease:Power2.easeOut});
		gsap.to($("#footer-container"), {duration: 1, opacity:1, delay:0.2, ease:Power2.easeOut});
				
		
		if( $('#hero').hasClass("has-image")) {	
			if( $('body').hasClass("load-project-thumb")) {
				gsap.set($("#hero-caption .hero-title span"), {y: 120, opacity:0});
				gsap.set($("#hero-caption .hero-subtitle span"), {y: 100, opacity:0});
				
				gsap.to($("#hero-bg-image"), {duration: 0, scale:1.02, opacity:1, delay:0, ease:Power2.easeOut});				
				gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, y: 0, opacity:1, stagger:0.2, delay:0.6, ease:Power3.easeOut, onComplete: function() {										
					gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, delay:0, ease:Power2.easeOut});																				
					gsap.to($("#main-page-content"), {duration: 0.3, opacity:1, delay:0, ease:Power2.easeOut});
				}});
				
			} else if( $('body').hasClass("load-project-thumb-with-title")) {
				gsap.set($("#hero-caption .hero-title span"), {y: 0, opacity:1});
				gsap.set($("#hero-caption .hero-subtitle span"), {y: 30, opacity:0});
								
				gsap.to($("#hero-bg-image"), {duration: 0, scale:1.02, opacity:1, delay:0, ease:Power2.easeOut});
				gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, y: 0, opacity:1, stagger:0.2, delay:0.3, ease:Power3.easeOut, onComplete: function() {									
					gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, delay:0, ease:Power2.easeOut});																				
					gsap.to($("#main-page-content"), {duration: 0.3, opacity:1, delay:0, ease:Power2.easeOut});
				}});
			} else {
				gsap.set($("#hero-bg-image"), {scale:1.1 , opacity:0});
				gsap.set($("#hero-caption .hero-title span"), {y: 120, opacity:0});
				gsap.set($("#hero-caption .hero-subtitle span"), {y: 30, opacity:0});
				
				imagesLoaded('#hero-bg-image', function() {
					gsap.to($("#hero-bg-image"), {duration: 0.7, scale:1 , opacity:1, delay:0, ease:Power2.easeOut});
				});								
				gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, y: 0, opacity:1, stagger:0.2, delay:0.3, ease:Power3.easeOut, onComplete: function() {
					gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, delay:0, ease:Power2.easeOut});																				
					gsap.to($("#main-page-content, #page-nav"), {duration: 0.3, opacity:1, delay:0, ease:Power2.easeOut});
				}});
			}

		} else {						
			gsap.set($("#hero-caption .hero-title span"), {y: 120, opacity:0});
			gsap.set($("#hero-caption .hero-subtitle span"), {y: 30, opacity:0});	
			
			gsap.to($("#hero-caption .caption-timeline span"), {duration: 0.7, y: 0, opacity:1, stagger:0.1, delay:0.3, ease:Power3.easeOut, onComplete: function() {				
				gsap.to($(".post-article-wrap"), {duration: 0.3, y: 0, opacity:1, ease:Power2.easeOut});
				gsap.to($(".error-button"), {duration: 0.3, y: 0, opacity:1, rotation:0, delay:0, ease:Power2.easeOut});
			}});
			
			gsap.to($(".hero-footer-left, .hero-footer-right"), {duration: 0.3, y:0, opacity:1, delay:0.7, ease:Power2.easeOut, onComplete: function() {
				$("#hero-footer.has-border").addClass("visible");																			
			}});
																							
			gsap.to($("#main-page-content, #page-nav"), {duration: 0.3, opacity:1, delay:0.8, ease:Power2.easeOut});			
		}
		
		
		
		
		
		// Fading In Showcase Lists elements on Finised
		gsap.set($(".showcase-lists .slide-title span"), {y: 100, opacity:0});		
		if (!isMobile()) {	
			gsap.to($(".showcase-lists .slide-title span"), {duration: 0.4, y: 0, opacity:1, stagger:0.05, delay:0.1, ease:Power3.easeOut});
		} else {
			gsap.to($(".showcase-lists .slide-title span"), {duration: 0.4, y: 0, opacity:1, stagger:0.01, delay:0.1, ease:Power3.easeOut});
		}
		
		if( $('.load-project-thumb').length > 0 ){
			imagesLoaded('#hero-image-wrapper', function() {
				if (isMobile()) {
					$('#hero-image-wrapper').find('video').each(function() {
						$(this).get(0).play();
					});											
				}					
				setTimeout( function(){					
					$("#app.active").remove();
					$(".big-title-caption").remove();
					$('.thumb-wrapper').remove();
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
						$(".temporary-hero").remove();
					}});
					if (!isMobile()) {
						$('#hero-image-wrapper').find('video').each(function() {
							$(this).get(0).play();
						});	
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.1, ease:Power2.easeOut});										
					} else if (isMobile()) {				
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.5, ease:Power2.easeOut});					
					}
				} , 450 );
			});
		} else if( $('.load-project-thumb-with-title').length > 0 ){
			imagesLoaded('#hero-image-wrapper', function() {
				if (isMobile()) {
					$('#hero-image-wrapper').find('video').each(function() {
						$(this).get(0).play();
					});											
				}				
				setTimeout( function(){					
					$("#app.active").remove();
					$('.thumb-wrapper').remove();
					$("#canvas-slider.active").remove();					
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
						$(".temporary-hero").remove();
					}});
					if (!isMobile()) {
						$('#hero-image-wrapper').find('video').each(function() {
							$(this).get(0).play();
						});	
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.1, ease:Power2.easeOut});										
					} else if (isMobile()) {				
						gsap.to($(".hero-video-wrapper"), {duration: 0.2, opacity:1, delay:0.5, ease:Power2.easeOut});					
					}
					$('body').removeClass("load-project-thumb-with-title").removeClass("show-loader");	
				} , 200 );
			});			
		} else {
			imagesLoaded('#hero-image-wrapper', function() {
				$('#hero-image-wrapper').find('video').each(function() {
					$(this).get(0).play();
				});
				setTimeout( function(){					
					$("#app.active").remove();	
					$("#canvas-slider.active").remove();					
					gsap.to($(".next-project-image-wrapper.temporary"), {duration: 0.1, opacity: 0, ease:Power2.easeOut,onComplete: function() {
						$(".next-project-image-wrapper.temporary").remove();
						$(".temporary-hero").remove();
					}});
				} , 500 );
			});
		}
		
		setTimeout( function(){	
			$('header').removeClass('white-header');
			$('body').removeClass("load-project-thumb load-project-thumb-with-title load-next-page grid-open")
			setTimeout( function(){
				imagesLoaded('body', function() {	
					$('body').removeClass("show-loader disable-scroll");
				});
			} , 300 );			
		} , 800 );
		
	
	}// End Lazy Load
	

	
	
/*--------------------------------------------------
Function Showcase Carousel
---------------------------------------------------*/
	
	function ShowcaseCarousel() {
	
		if( $('.showcase-carousel').length > 0 ){
			
			$('body').addClass("disable-scroll");
			$("footer").addClass("showcase-footer");		
								
			gsap.set($(".showcase-carousel .clapat-slider .slide-inner"), {opacity:0});
			gsap.set($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {opacity:0});
		
			
			
			slider = new ClapatSlider('.showcase-carousel', { 
				direction: 'horizontal', 
				snap: false,
				navigation: {
					nextEl: '.cp-button-next',
					prevEl: '.cp-button-prev'
				},
				parallax : [{
					element: '.section-image',
					margin:-20
				}],				
				on: {
					init : function() {
						
						if ($('body').hasClass("show-loader")) {
							
							imagesLoaded('body', function() {
														
								gsap.to($(".showcase-carousel .clapat-slider .clapat-slide .slide-inner"), {duration: 1.2, opacity:1, delay:0.2, ease:Power4.easeOut});					
								
								
								gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-prev-two .slide-inner"), {yPercent:70});
								gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-prev-two .slide-inner"), {duration: 1.2, yPercent:0, delay:0.1, ease:Power4.easeOut});
								
								
								gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-prev .slide-inner"), {yPercent:-70});
								gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-prev .slide-inner"), {duration: 1.2, yPercent:0, delay:0.15, ease:Power4.easeOut});
								
								
								gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-active .slide-inner"), {yPercent:70});
								gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-active .slide-inner"), {duration: 1.2, yPercent:0, delay:0.2,  ease:Power4.easeOut, onComplete: function() {
										$('body').removeClass(" disable-scroll");
									}
								});
								
								
								gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-next .slide-inner"), {yPercent:-70});
								gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-next .slide-inner"), {duration: 1.2, yPercent:0, delay:0.15, ease:Power4.easeOut});
								
								
								gsap.set($(".showcase-carousel .clapat-slider .clapat-slide-next-two .slide-inner"), {yPercent:70});
								gsap.to($(".showcase-carousel .clapat-slider .clapat-slide-next-two .slide-inner"), {duration: 1.2, yPercent:0, delay:0.1, ease:Power4.easeOut});
								
								gsap.to($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {duration: 0.5, opacity:1, delay:0.4, ease:Power3.easeOut});
								
								var bullets = document.querySelectorAll(".showcase-carousel .clapat-pagination-bullet");
								var initialHeights = Array.from(bullets).map(function(bullet) {
									return bullet.clientHeight + "px";
								});
								
								gsap.set(bullets, { height: 0 });
								gsap.to(bullets, {
									duration: 0.3,
									delay:0.3, 
									height: function(index, target) {
										return initialHeights[index];
									},
									ease:Power3.easeOut,
									stagger: 0.05,
									onComplete: function() {
										gsap.set(bullets, { height: "" });
									  }
								});
								
							});
						
						}						
					}
				}
			});		
			
			
			slider.tl
				.fromTo('.progress-info-fill', {backgroundSize:"0% 100%" }, {backgroundSize:"100% 100%" }, 0)
				.fromTo('.progress-info-fill-2', {backgroundSize:"100% 100%" }, {backgroundSize:"0% 100%", duration: 0.3, ease: 'power3' }, 0);
				
			
			$('.carousel-prev').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"-= 180"}); 
				}
			});
			
			$('.carousel-next').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					 window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"+= 90"}); 
				}
			});
			
			
			
			
			
			class Item {
								
				constructor(DOM_el) {
					
					// DOM elements
					this.DOM = {
						// main element (.item)
						el: null,
						// imageWrap (.item__image-wrap)
						imageWrap: null,
						// imageCaption
						imageCaption: null,
						// image (.item__image)
						image: null,
						// imageInner (.item__image > .item__image-inner)
						imageInner: null,
					};
					
					this.DOM.el = DOM_el;
					this.DOM.imageWrap = this.DOM.el.querySelector('.slide-moving');
					if( this.DOM.imageWrap != null ){						
						this.DOM.imageCaption = this.DOM.imageWrap.querySelector('.slide-caption');
					}
					this.DOM.image = this.DOM.el.querySelector('.trigger-item');
					if( this.DOM.image != null ){						
						this.DOM.imageInner = this.DOM.image.querySelector('.section-image');
					}
				}
			}
			
			
			// Placeholder for the grid items (.item__image). We'll use the gsap FLIP plugin to move the "".item .item__image" inside the grid element
			const grid = document.querySelector('.carousel-thumbs-wrapper');
			const triggeredImage = document.querySelector('.carousel-zoom-wrapper');
			
			let animateTitle = gsap.timeline();
			
			
			const showGrid = () => {
				
				document.body.classList.add('grid-open', 'disable-scroll');
				
				
				
				gsap.to($("footer .link-text, .clapat-pagination, .progress-info"), {duration: 0.3, opacity:0, y:30, stagger:-0.05, ease:Power2.easeInOut});
				
				// get the DOM elements that we'll work with
				const DOM = getDOMElements();
				const allImages = DOM.grid.map(element => {
					
					element.item.DOM.image.setAttribute('data-slide-index', element.item_index);
					return element.item.DOM.image;
				});
				const allImagesInner = DOM.grid.map(element => element.item.DOM.imageInner);
				const currentImage = DOM.currentItem.DOM.image;
				const currentImageInner = DOM.currentItem.DOM.imageInner
				const currentImageCaption = DOM.currentItem.DOM.imageCaption
							
				// Use gsap flip for the animation
				// save the current state of the images
				const flipstate = Flip.getState([allImages]);
				
				const flipstate1 = Flip.getState([currentImage]);
								
				gsap.set(currentImage.closest(".clapat-slide"), {zIndex: 0});
				
				// put them inside the .grid element
				grid.append(...allImages);
								
				triggeredImage.append(currentImage);
				triggeredImage.append(currentImageCaption);
			
				// Flip it
				Flip.from(flipstate, {
					duration: 0.7,
					stagger:0.05,
					ease: 'power3.inOut',
					absolute: true,					 
				})
				.to(currentImageInner, {
					duration: 0.7,
					ease: 'power3.inOut',
					x: 0,
					onComplete: () => {
						gsap.set(currentImageInner, {
						  clearProps: "rotation, x, y"
						});
						document.body.classList.add('enable-trigger');
				  	}
				}, 0)
				
				Flip.from(flipstate1, {
					duration: 0.7 ,
					ease: 'power3.inOut',
					absolute: true       
				});
				
				animateTitle.set(".showcase-carousel .slide-caption span", { y: 120, opacity:0});				
				animateTitle.to(".showcase-carousel .carousel-zoom-wrapper .slide-caption span", { duration: 0.5, y: 0, opacity:1, delay:0.4, stagger:0.03,  ease:Power2.easeOut });
				
			};
			
			const hideGrid = () => {
				
				gsap.to($(".showcase-carousel .carousel-zoom-wrapper .slide-caption"), {duration: 0.5, opacity:0, delay:0.1, ease:Power2.easeOut});
				animateTitle.to(".showcase-carousel .carousel-zoom-wrapper .slide-caption span", { duration: 0.5, y: -100, opacity:0, ease:Power2.easeInOut});
				
				document.body.classList.remove('grid-open');
				
				// get the DOM elements that we'll work with
				const DOM = getDOMElements();
				const allImages = document.querySelectorAll('.carousel-thumbs-wrapper .trigger-item');
				//const allImagesInner = document.querySelectorAll('.carousel-thumbs-wrapper .trigger-item .section-image');
				const currentImage = document.querySelector('.carousel-zoom-wrapper .trigger-item');
				const currentImageCaption = document.querySelector('.carousel-zoom-wrapper .slide-caption');
				const currentImageInner = document.querySelector('.carousel-zoom-wrapper .trigger-item .section-image');
			
				const flipstate = Flip.getState([allImages, /*allImagesInner*/, currentImage, /*currentImageInner*/]);
							
				allImages.forEach((image) => {
					
					let index = image.getAttribute('data-slide-index');
					let element = DOM.items[index];
					image.removeAttribute('data-slide-index');
					element.DOM.imageWrap.appendChild( image );
				});
				
				currentImageInner.classList.add('ease-transform');
				
				DOM.currentItem.DOM.imageWrap.appendChild(currentImage);				
								
				// Remove all the elements from the grid and current triggered image divs
				const liveGrid = document.querySelector('.carousel-thumbs-wrapper');
				const liveTriggeredImage = document.querySelector('.carousel-zoom-wrapper');
				
				while (liveGrid.firstChild) {
					liveGrid.removeChild(liveGrid.firstChild);
				}
				
				Flip.from(flipstate, {
					duration: 0.7,
					stagger:0.02,
					ease: 'power3.inOut',					
					onComplete: function() {
												
						document.body.classList.remove('disable-scroll','enable-trigger');
						
						const triggeredItem = document.querySelector('.clapat-slide.triggered-item');
						if( triggeredItem != null ){							
							triggeredItem.classList.remove('triggered-item');
						}
						
						const clapatSlides = document.querySelectorAll('.clapat-slide');
						clapatSlides.forEach(slide => {
						  	slide.style.zIndex = '';
						});
						
						currentImageInner.classList.remove('ease-transform');
						
						DOM.currentItem.DOM.imageWrap.appendChild(currentImageCaption);
						gsap.set($(".showcase-carousel .slide-caption"), {clearProps: "opacity"});
						
					}
				});
				
				gsap.to($("footer .link-text, .clapat-pagination, .progress-info"), {duration: 0.3, opacity:1, y:0, stagger:0.05, delay:0.4, ease:Power2.easeInOut});
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
				
			
			}
			
			// Returns some DOM elements that are needed for showing/hiding the grid
			const getDOMElements = () => {
			
				// Item instances (slides)
				const items = [];
				[...document.querySelectorAll('.clapat-slide')].forEach(item => {
					items.push(new Item(item));
				});
						
				// Cloned items
				const itemsCloned = [];
				[...document.querySelectorAll('.clapat-slide-clone')].forEach(item => {
					itemsCloned.push(new Item(item));
				});
			
				let firstVisibleIndex = -1;
				let direction = slider.opts.direction;
								
				for( let i = 0; i < items.length; i++ ){
					
					let item = items[i];
					let bounding = item.DOM.el.getBoundingClientRect();
					if( direction == "vertical" ){
					
						start = bounding.top;
						end = bounding.bottom;
					}
					else {
						
						start = bounding.left;
						end = bounding.right;
					}
					if( (start <= 0) && (end > 0) ){
							
						firstVisibleIndex = i;						
						break;
					}
										
				}
				
				const gridItems = [];
				let currentIndex = -1;
				if( direction == "vertical" ){
					
					let selectedItems = 0;
					// in case of the vertical direction cloned items are reverted, last one becomes first
					if( firstVisibleIndex >= itemsCloned.length ){
							
						// the first visible index is a clone, therefore iterate back to the first clone
						for( index = firstVisibleIndex; (index >= itemsCloned.length); index-- ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
						// and then from the beginning the rest of the clones
						for( index = 0; (selectedItems < itemsCloned.length); index++ ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
							
					}
					else{
						
						// the first visible index is not a clone, therefore iterate from the beginning of the items
						for( index = firstVisibleIndex; (index < itemsCloned.length); index++ ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
						// and then from the end of the clones
						for( index = items.length-1; (selectedItems < itemsCloned.length); index-- ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
					}
					
				}
				else {
					
					let iterator = 0;
					while ( iterator < itemsCloned.length ){
						
						let index = gsap.utils.wrap( 0, items.length, firstVisibleIndex + iterator);
						let item = items[index];
						if( !item.DOM.el.classList.contains('triggered-item') ){
							
							gridItems.push( {item_index: index, item: item  } );
						}
						else{
							
							currentIndex = index;
						}
						iterator++;
					}
				}
				
				return {					
					items: items,					
					grid: gridItems,					
					currentItem: new Item( document.querySelector('.clapat-slide.triggered-item') ),
					currentIndex: currentIndex
				};
				
			}
			
			let bGridSwiped = false;
			// Initialize the events
			const initEvents = () => {
				
				const items = document.querySelectorAll('.slide-inner');
				items.forEach((triggerItem) => {
					
					triggerItem.addEventListener('click', (event) => {
						
						if( $('.showcase-carousel').length > 0 ){
							
							event.currentTarget.closest('.clapat-slide').classList.add('triggered-item');
							showGrid();
						}
					});
					
				});
				
				window.addEventListener("wheel", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-carousel').length > 0 ) ) {
						hideGrid();
					}
				});
				
				window.addEventListener("touchmove", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-carousel').length > 0 ) ) {
						bGridSwiped = true;
					}
				});
				window.addEventListener("touchcancel", event => {
					
					if(document.body.classList.contains("grid-open") ( $('.showcase-carousel').length > 0 ) ) {
						bGridSwiped = false;
					}
				});
				window.addEventListener("touchend", event => {
					
					if(document.body.classList.contains("grid-open") && bGridSwiped && ( $('.showcase-carousel').length > 0 ) ) {
						bGridSwiped = false;
						hideGrid();
					}
				});
				
				const closeGrid = document.querySelector('.carousel-close-thumbs');
				
				if( closeGrid != null ){
					
					closeGrid.addEventListener("click", event => {
						
						if(document.body.classList.contains("grid-open") && ( $('.showcase-carousel').length > 0 ) ) {
							hideGrid();
						}
					});
				}
			
			};
			
			const previewModeEnabled = document.querySelector('.preview-mode-enabled');
			
			if (previewModeEnabled) {			
				initEvents();		
			}
							
			
			if (!isMobile()) {				
				
				var dragWrapper = $('.clapat-slider');
				dragWrapper.on('mousedown', function (evt) {
					dragWrapper.on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {					  
							// click
							gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999'});
							$("body").removeClass("scale-drag-x");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();	
							
						} else {
							// drag
							if ($('#magic-cursor').hasClass("light-content")) {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#fff', backgroundColor:'transparent'});
							} else {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#000', backgroundColor:'transparent'});
							}
							$("body" ).addClass("scale-drag-x");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();	
						  
						}
						dragWrapper.off('mouseup mousemove', handler);
					});
				});
				
					
				$('.clapat-slider').on('mouseup touchend', function() {
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999',ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-x");
				});
				
				$("body").on('mouseleave', function() {					
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999',ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-x");					
				});
					
				
				$(".showcase-carousel.preview-mode-enabled .clapat-slide .slide-inner").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						$('#ball p').remove();
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});
				
				$(".trigger-item").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});
				
				$(".showcase-carousel .clapat-slide .slide-inner").on('mouseenter', function() {					
					gsap.to($(this).find('.slide-caption'), {duration: 0.2, opacity:1, ease:Power2.easeOut});
					gsap.set($(this).find('.slide-title span'), {y:40, opacity:0, });
					gsap.to($(this).find('.slide-title span'), {duration: 0.5, y:0, opacity:1, ease:Power2.easeOut});
				});
									
				$(".showcase-carousel .clapat-slide .slide-inner").on('mouseleave', function() {
					gsap.to($(this).find('.slide-caption'), {duration: 0.5, opacity:0, delay:0.1, ease:Power2.easeOut});					
					gsap.to($(this).find('.slide-title span'), {duration: 0.5, y:-60, opacity:0, ease:Power2.easeOut});
				});
			
			}
			
			
			
			$('.trigger-item').on( 'click', function() {
				
				let trigger_item = $(this);
				
				if ($(".showcase-carousel").hasClass("preview-mode-enabled")) {
					$("body").addClass("load-project-thumb-with-title");
				} else {
					$("body").addClass("load-project-thumb");
				}
				
				gsap.to($(".carousel-thumbs-wrapper .trigger-item"), {duration: 0.3, y: 160, x:0,  opacity:1, stagger:0.05,  delay:0, ease:Power2.easeIn});
				
				$("body").append('<div class="temporary-hero light-content"><div class="outer content-full-width"><div class="inner"></div></div></div>');
				
				
				if ($(this).hasClass("change-header")) {	
					gsap.to($(".slide-title"), {duration: 1.5, color: '#000', delay:0.3, ease:Power4.easeInOut});
				} else {
					gsap.to($(".slide-title"), {duration: 1.5, color: '#fff', delay:0.3, ease:Power4.easeInOut});
				}
				
				
				gsap.to($(".showcase-carousel .carousel-zoom-wrapper .slide-caption .slide-subtitle span"), {duration: 0.3, y: 30, opacity:0, stagger:-0.03, ease:Power2.easeInOut});
				
				setTimeout( function(){	
					$('.carousel-zoom-wrapper').find('.slide-title').appendTo('.temporary-hero .inner');
					var moveTitle = $('.temporary-hero .inner').outerHeight() - $('.temporary-hero .slide-title').outerHeight();
					gsap.to($(".temporary-hero .slide-title"), {duration: 1.5, y: moveTitle, opacity:1, delay:0.3, ease:Power4.easeInOut});
					
					if (trigger_item.hasClass("change-header")) {	
						gsap.to($(".slide-title"), {duration: 1.5, color: '#000', ease:Power4.easeInOut});
					}
					
					$("body").addClass("show-loader");
					
				} , 300 );
					
				gsap.to('footer, .carousel-nav-wrapper', {duration: 0.5, opacity:0, ease:Power4.easeInOut});
				
				gsap.to('#ball', {duration: 0.3, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.3, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
					
							
			});
			
			
		}	
		
			
	}//End Showcase Carousel
	
	
	
/*--------------------------------------------------
Function Showcase Slider
---------------------------------------------------*/
	
	function ShowcaseSlider() {
	
		if( $('.showcase-slider').length > 0 ){
			
			$('body').addClass("disable-scroll");
			$("footer").addClass("showcase-footer");		
								
			gsap.set($(".showcase-slider .clapat-slider .slide-inner"), {opacity:0, scale:1.1});
			gsap.set($(".showcase-slider .slide-title span"), {y: 100, opacity: 0});
			gsap.set($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {opacity:0});
			
			
			slider = new ClapatSlider('.showcase-slider', { 
				direction: 'vertical', 
				snap: true,
				navigation: {
					nextEl: '.cp-button-next',
					prevEl: '.cp-button-prev'
				},
				parallax : [{
					element: '.section-image',
					margin:20
				}],				
				on: {
					init : function() {
						
						if ($('body').hasClass("show-loader")) {
							
							imagesLoaded('body', function() {
														
								gsap.to($(".showcase-slider .clapat-slider .clapat-slide .slide-inner"), {duration: 1.2, opacity:1, scale:1, delay:0, ease:Power4.easeOut});	
								gsap.to($(".showcase-slider .slide-title span"), {duration: 0.7, y: 0, opacity:1, delay:0.1, ease:Power4.easeOut});
								gsap.to($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {duration: 0.5, opacity:1, delay:0.4, ease:Power3.easeOut});
								
								var bullets = document.querySelectorAll(".showcase-carousel .clapat-pagination-bullet");
								var initialHeights = Array.from(bullets).map(function(bullet) {
									return bullet.clientHeight + "px";
								});
								
								gsap.set(bullets, { height: 0 });
								gsap.to(bullets, {
									duration: 0.3,
									delay:0.3, 
									height: function(index, target) {
										return initialHeights[index];
									},
									ease:Power3.easeOut,
									stagger: 0.05,
									onComplete: function() {
										gsap.set(bullets, { height: "" });
									  }
								});
								
							});
							
							let pageContent = document.getElementById("page-content");
							let magicCursor = document.getElementById("magic-cursor");
							let firstSlide = document.querySelector(".clapat-slide");
							let videos = firstSlide.querySelectorAll("video");
							
							if (firstSlide.classList.contains("change-header")) {
								
								pageContent.classList.remove("light-content");
								magicCursor.classList.remove("light-content");
							} else {
								
								pageContent.classList.add("light-content");
								magicCursor.classList.add("light-content");
							}
							
							videos.forEach(function(video) {
								video.play();
							});
						
						}						
					},
					activeSlideChanged : function( activeSlide, prevSlide, nextSlide ) {
						
						console.log("Click event ");
						
						let pageContent = document.getElementById("page-content");
						let magicCursor = document.getElementById("magic-cursor");
						
						if (activeSlide.classList.contains("change-header")) {
							
							pageContent.classList.remove("light-content");
							magicCursor.classList.remove("light-content");
						} else {
							
							pageContent.classList.add("light-content");
							magicCursor.classList.add("light-content");
						}
						
						if (prevSlide.querySelector('video')) {
							
    						prevSlide.querySelector('video').pause();
  						}
						
						if (activeSlide.querySelector('video')) {
							
    						activeSlide.querySelector('video').play();
  						}
						
						if (nextSlide.querySelector('video')) {
							
    						nextSlide.querySelector('video').pause();
  						}
						
					},
				}
				
			});		
			
			arrTitles = gsap.utils.toArray('.clapat-slider-wrapper .clapat-sync-slider .clapat-sync-slide');
	
						
			if ($('.showcase-slider').hasClass("rotate-caption")) {
				
				const slideduration = 1/arrTitles.length;
				const transitionduration = slideduration;
							
				let currentTimelinePos = 0;
				for( let i = 0; i < arrTitles.length; i++ ){				
					const rowTitleWrapper = arrTitles[i];					
					if( i != 0 ){	
						gsap.set( rowTitleWrapper, {yPercent: 60, rotationX: -90, z: -60, opacity:0.5}  );						
						slider.tl.to(rowTitleWrapper, {yPercent: 0, rotationX: 0, z: 0, opacity:1, duration: transitionduration}, '<' ) 
								 .to(rowTitleWrapper, {yPercent: -65, rotationX: 90, z: -60, opacity:0.5, duration: transitionduration}, '>')						
						
					} else {
						slider.tl.fromTo(rowTitleWrapper, {yPercent: 0, rotationX: 0, z: 0, opacity:1}, {yPercent: -65, rotationX: 90, z: -60, opacity:0.5, duration: transitionduration}, 0);
					}					
					currentTimelinePos += transitionduration;
				}
				
				const firstTitle = arrTitles[0];
				slider.tl.fromTo(firstTitle, {yPercent: 65, rotationX: -90, z: -60, opacity:0.5}, {yPercent: 0, rotationX: 0, z: 0, opacity:1, duration: transitionduration}, '<');				
				gsap.set( firstTitle, {yPercent: 0, rotationX: 0, z: 0, opacity:1} );
				
				
			} else {
				
				const slideduration = 1/arrTitles.length;
				const transitionduration = slideduration;
							
				let currentTimelinePos = 0;
				for( let i = 0; i < arrTitles.length; i++ ){				
					const rowTitleWrapper = arrTitles[i];					
					if( i != 0 ){	
						gsap.set( rowTitleWrapper, {yPercent: 100}  );  						
						slider.tl.to(rowTitleWrapper, {yPercent: 0, duration: transitionduration}, '<' ) 
								 .to(rowTitleWrapper, {yPercent: -100, duration: transitionduration}, '>') 
					} else {
						slider.tl.fromTo(rowTitleWrapper, {yPercent: 0}, {yPercent: -100, duration: transitionduration}, 0);
					}					
					currentTimelinePos += transitionduration;
				}
				
				const firstTitle = arrTitles[0];
				slider.tl.fromTo(firstTitle, {yPercent: 100}, {yPercent: 0, duration: transitionduration}, '<')	;			
				gsap.set( firstTitle, {yPercent: 0} );
			}
			
			slider.tl
				.fromTo('.progress-info-fill', {backgroundSize:"0% 100%" }, {backgroundSize:"100% 100%" }, 0)
				.fromTo('.progress-info-fill-2', {backgroundSize:"100% 100%" }, {backgroundSize:"0% 100%", duration: 0.3, ease: 'power3' }, 0)
				
			
			$('.carousel-prev').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"-= 180"}); 
				}
			});
			
			$('.carousel-next').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					 window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"+= 90"}); 
				}
			});
			
			
			
			
			
			
			
			
			
							
			
			if (!isMobile()) {				
				
				var dragWrapper = $('.clapat-slider');
				dragWrapper.on('mousedown', function (evt) {
					dragWrapper.on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {					  
							// click
							gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999'});
							$("body").removeClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();	
							
						} else {
							// drag
							if ($('#magic-cursor').hasClass("light-content")) {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#fff', backgroundColor:'transparent'});
							} else {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#000', backgroundColor:'transparent'});
							}
							$("body" ).addClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							$("#ball").removeClass("with-blur");
							$('#ball p').remove();	
						  
						}
						dragWrapper.off('mouseup mousemove', handler);
					});
				});
				
					
				$('.clapat-slider').on('mouseup touchend', function() {
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999',ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");
				});
				
				$("body").on('mouseleave', function() {					
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999',ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");					
				});
				
				$(".trigger-item").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-y')) {
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-y')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});
			
			}
			
			
			
			$('.trigger-item').on( 'click', function() {
					
					let trigger_item = $(this);
					var clickedIndex = $(this).data('index');
					
					$("body").addClass("load-project-thumb-with-title");
					
					$("body").append('<div class="temporary-hero light-content"><div class="outer content-full-width middle"><div class="inner"></div></div></div>');
					
					
					if ($(this).hasClass("change-header")) {	
						gsap.to($(".slide-title"), {duration: 1.5, color: '#000', delay:0.3, ease:Power4.easeInOut});
					} else {
						gsap.to($(".slide-title"), {duration: 1.5, color: '#fff', delay:0.3, ease:Power4.easeInOut});
					}
					
					setTimeout( function(){
						
						// Find the corresponding cloned list item
						var clonedListItem = $('.clapat-sync-slider-viewport .clapat-sync-slide:eq(' + clickedIndex + ')');
						
						clonedListItem.find('.slide-title').appendTo('.temporary-hero .inner');
						var moveTitle = $('.temporary-hero .inner').outerHeight()/2 - $('.temporary-hero .slide-title').outerHeight()*0.5 - 1;
						gsap.to($(".temporary-hero .slide-title"), {duration: 1.5, y: moveTitle, opacity:1, delay:0.3, ease:Power4.easeInOut});
						
						if (trigger_item.hasClass("change-header")) {	
							gsap.to($(".slide-title"), {duration: 1.5, color: '#000', ease:Power4.easeInOut});
						}
						
						$("body").addClass("show-loader");
						
					} , 300 );
						
					gsap.to('footer, .carousel-nav-wrapper', {duration: 0.5, opacity:0, ease:Power4.easeInOut});
					
					gsap.to('#ball', {duration: 0.3, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
					gsap.to('#ball-loader', {duration: 0.3, borderWidth: '4px', top: 0, left: 0});
					$("#ball").removeClass("with-blur");
					$('#ball p').remove();
					
					trigger_item.delay(1500).queue(function() {
						var link = trigger_item.find('a');
						link.trigger('click');
					});
							
			});
			
			
		}	
		
			
	}//End Showcase Slider	
	

/*--------------------------------------------------
Function Showcase Portfolio
---------------------------------------------------*/	
		
	function ShowcasePortfolio() {
		
		
		if( $('.showcase-portfolio').length > 0 ){
				
			gsap.set($(".showcase-portfolio .img-mask"), {scaleY:1.1, y:100, opacity:0, filter: 'brightness(150%)'});
			
			if (isMobile()) {
				gsap.set($(".showcase-portfolio .slide-caption"), {y:30, opacity:0});
			}
							
			var thumbAnimation = gsap.utils.toArray('.img-mask');			
			thumbAnimation.forEach(function(tAnimation) {					
				gsap.to(tAnimation, { 					
					scrollTrigger: {
						trigger: tAnimation,
						start: "top 100%",
						stagger:0.5,
						onEnter: function() {
							tAnimation.classList.add('animated');
							tAnimation.closest('.slide-inner').classList.add('show-caption');
							if ($('body').hasClass("show-loader")) {
								setTimeout( function(){	
									gsap.set($(".showcase-portfolio .img-mask.animated"), {scaleY:1.1, y:100, opacity:0, filter: 'brightness(150%)'});
									gsap.to($(".showcase-portfolio .img-mask.animated"), {duration: 0.7, scaleY:1, y:0, opacity:1, stagger:0.1, delay:0.5, filter: 'brightness(100%)', ease:Power2.easeOut});	
								} , 200 );
							}
							if (isMobile()) {									
								gsap.to($(".show-caption .slide-caption"), {duration: 0.3, y:0, opacity:1, delay:0.4, ease:Power2.easeOut});
							}
						},
					},
					duration: 0.7,
					delay:0.1, 	
					scaleY:1, 
					y:0,
					opacity:1,	
					filter: 'brightness(100%)',
					ease:Power2.easeOut, onComplete: function() {												
						gsap.set(tAnimation, {opacity:""});
					}
				});
			});
			
			
			
			function listView() {
			
				var grid = document.querySelector('.showcase-portfolio');
				var heroFooter = document.getElementById('hero-footer');	
				var startHeight = gsap.getProperty(".showcase-portfolio", "height");
				var stateThumb = Flip.getState('.clapat-item .slide-inner');
				
				
				if (!grid.classList.contains('list-grid')) {
					
					if (isMobile()) {
						gsap.to($('.clapat-item .slide-caption'), {duration: 0.5, opacity:0, y:0, stagger: 0.05, ease: "power3.inOut"});
					}
					
					heroFooter.classList.add('list-enable');
					
					gsap.to($('.clapat-item .section-image'), {duration: 0.5, opacity:0, scale:0.5, stagger: 0.05, ease: "power3.inOut",
						onComplete: function() {												
					
							var otherClass = grid.classList.item(1); 
							grid.classList.remove(otherClass);
							grid.dataset.originalClass = otherClass;
							grid.classList.add('list-grid');
							
							var slideInners = document.querySelectorAll('.clapat-item .slide-inner');
							slideInners.forEach(function(slideInner) {
								var listMask = document.createElement('div');
								listMask.classList.add('list-mask');
								slideInner.appendChild(listMask);
							});
							
							gsap.set($('.list-grid .slide-title span'), {y:"", opacity:""});					
							gsap.set($('.list-grid .slide-cat span'), {y:"", opacity:""});
							
							var borederColorBlack = "rgba(0,0,0,0.1)";
							var borederColorWhite = "rgba(255,255,255,0.15)";
							
							if ($('#page-content').hasClass('light-content')) {
								gsap.to($('.clapat-item'), {duration: 0.5, borderBottomColor: borederColorWhite, stagger: 0.05, ease: "power3.inOut"});
							} else if ($('#page-content').hasClass('dark-content')) {
								gsap.to($('.clapat-item'), {duration: 0.5, borderBottomColor: borederColorBlack, stagger: 0.05, ease: "power3.inOut"});
							}

							gsap.to($('.list-grid .slide-caption'), {duration: 0.5, opacity:1, stagger: 0.05, ease: "power3.inOut"});
							
							var endHeight = gsap.getProperty(".showcase-portfolio", "height");
						
							var flip = Flip.from(stateThumb, {
								absolute: true,
								duration: 0, 
								stagger: 0,					
								ease: "power3.inOut",
								onComplete: function() {												
									ScrollTrigger.refresh();
									
									gsap.set($('.clapat-item .section-image'), {width:"100px"})
								}
							})
							
							flip.fromTo(".showcase-portfolio", { height: startHeight }, { height: endHeight, clearProps: "height", duration: flip.duration() }, 0);
							
						}
					});
					
  				} else {
					
					heroFooter.classList.remove('list-enable');
					
					gsap.to($('.list-grid .slide-caption'), {duration: 0.3, opacity:0, ease:Power2.easeOut});					
					gsap.to($('.clapat-item'), {duration: 0.3, borderBottomColor:'rgba(0,0,0,0)',  ease:Power2.easeOut});
					
					var listMasks = document.querySelectorAll('.clapat-item .slide-inner .list-mask');
					listMasks.forEach(function(listMask) {
						listMask.parentNode.removeChild(listMask);
					});
					
					gsap.to($('.clapat-item .section-image'), {duration: 0.5, width:"100%", scale:0.9, ease: "power3.inOut",
						onComplete: function() {
							
							grid.classList.remove('list-grid');
							if (grid.dataset.originalClass) {
								grid.classList.add(grid.dataset.originalClass);
								delete grid.dataset.originalClass;
							}
							
							var endHeight = gsap.getProperty(".showcase-portfolio", "height");
				
							var flip = Flip.from(stateThumb, {
								absolute: true,
								duration: 0, 
								stagger: 0,					
								ease: "power3.inOut",
								onComplete: function() {												
									ScrollTrigger.refresh();
									gsap.to($('.clapat-item .section-image'), {duration: 0.5, scale:1, opacity:1, stagger: 0.05, ease: "power3.Out"});
									if (isMobile()) {
										gsap.to($('.clapat-item .slide-caption'), {duration: 0.5, opacity:1, delay:0.2, stagger: 0.05, ease: "power3.Out"});
									}
								}
							})
							
							flip.fromTo(".showcase-portfolio", { height: startHeight }, { height: endHeight, clearProps: "height", duration: flip.duration() }, 0);
						}
					});
					
  				}
			
			}
			
			const listViewDiv = document.querySelector('.list-view');
			
			if (listViewDiv) {
				listViewDiv.addEventListener('click', function(event) {
					event.preventDefault();
					listView();
				});
			}
			
			
			function shuffleGrid() {
			
				var grid = document.querySelector('.showcase-portfolio');
				var startHeight = gsap.getProperty(".showcase-portfolio", "height");
				var state = Flip.getState('.clapat-item');						
				
				var layouts = ["layout-one", "layout-two", "layout-three"];
				var curLayout = layouts.indexOf(grid.classList[1]);
				grid.classList.remove(layouts[curLayout]);
				curLayout = (curLayout + 1) % layouts.length;
				grid.classList.add(layouts[curLayout]);
				
				var endHeight = gsap.getProperty(".showcase-portfolio", "height");
				
				var flip = Flip.from(state, {
					absolute: true,
					duration: 0.5, 
					stagger: 0.05,
					ease: "power3.inOut",
					onComplete: function() {												
						ScrollTrigger.refresh();
					}
				})
				
				flip.fromTo(".showcase-portfolio", { height: startHeight }, { height: endHeight, clearProps: "height", duration: flip.duration() }, 0);
			
			}
			
			const shuffleGridDiv = document.querySelector('.shuffle-grid');
			
			if (shuffleGridDiv) {			
				document.querySelector('.shuffle-grid').addEventListener('click', function(event) {
					event.preventDefault();				
					shuffleGrid();
				});			
			}
			
			
			function filter() {
			
				var projects = document.querySelectorAll('.clapat-item');
				var startHeight = gsap.getProperty(".showcase-portfolio", "height");
				var state = Flip.getState('.clapat-item');
				var filters = document.querySelectorAll('.filter-option.is_active');
				
				if (filters.length) {
					projects.forEach(function(project) {
				  		gsap.set(project, { display: 'block' });
				  		project.classList.remove('filtered');
					});
				
					filters.forEach(function(filter) {
						var colorClass = filter.dataset.filter;
					
						if (colorClass !== '') {
							projects.forEach(function(project) {
								if (!project.classList.contains(colorClass)) {
									gsap.set(project, { display: 'none' });
									project.classList.remove('filtered');
								} else {
									gsap.set(project, { display: 'block' });
									project.classList.add('filtered');
								}
							});
						} else {
							projects.forEach(function(project) {
								gsap.set(project, { display: 'block' });
								project.classList.remove('filtered');
							});
						}
					});
				
				} else {
					projects.forEach(function(project) {
				  		gsap.set(project, { display: 'block' });
				  		project.classList.remove('filtered');
					});
				}
				
				var endHeight = gsap.getProperty(".showcase-portfolio", "height");
				
				var flip = Flip.from(state, {
					duration: 0.6,
					ease: "power3.inOut",
					stagger: 0,
					absolute: true,
					onEnter: elements => gsap.fromTo(elements, {opacity: 0, scale: 0}, {opacity: 1, scale: 1, duration: .6}),
					onLeave: elements => gsap.fromTo(elements, {opacity: 1, scale: 1}, {opacity: 0, scale: 0, duration: .6}),
					onComplete: function() {												
						ScrollTrigger.refresh();
					}
				})
				
				flip.fromTo(".showcase-portfolio", { height: startHeight }, { height: endHeight, clearProps: "height", duration: flip.duration() }, 0);
			
			}
			
			const filtersOptionDiv = document.querySelector('.filters-options-wrapper');
			
			if (filtersOptionDiv) {
				document.querySelectorAll('.filter-option').forEach(function(option) {
					option.addEventListener('click', function(event) {
						event.preventDefault();
						document.querySelector('.filter-option.is_active').classList.remove('is_active');
						event.currentTarget.classList.add('is_active');
						filter();
					});
				});
			}
			
			
			if (!isMobile()) {	
							
				$(".showcase-portfolio .clapat-item .slide-inner").on('mouseenter', function() {
					$('#ball p').remove();
					var $this = $(this);			
					gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
					gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
					$("#ball").addClass("with-blur");
					$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
					$(this).find('video').each(function() {
						$(this).get(0).play();
					});								
				}).on('mouseleave', function() {	
					gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
					gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
					$("#ball").removeClass("with-blur");
					$('#ball p').remove();		
					$(this).find('video').each(function() {
						$(this).get(0).pause();
					});
				});
				
				$(".showcase-portfolio .clapat-item .slide-inner").on('mouseenter', function() {
					if (!$('.showcase-portfolio').hasClass('list-grid')) {
						gsap.set($(this).find('.slide-title span'), {y:30, opacity:0, });
						gsap.set($(this).find('.slide-cat span'), {y:30, opacity:0, });
						gsap.to($(this).find('.slide-caption'), {duration: 0.2, opacity:1, ease:Power2.easeOut});
						gsap.to($(this).find('.slide-title span'), {duration: 0.3, y:0, opacity:1, ease:Power2.easeOut});										
						gsap.to($(this).find('.slide-cat span'), {duration: 0.3, y:0, opacity:1, ease:Power2.easeOut});
					}
				}).on('mouseleave', function() {
					if (!$('.showcase-portfolio').hasClass('list-grid')) {
						gsap.to($(this).find('.slide-caption'), {duration: 0.3, opacity:0, delay:0.1, ease:Power2.easeOut});					
						gsap.to($(this).find('.slide-title span'), {duration: 0.3, y:-30, opacity:0, ease:Power2.easeOut});					
						gsap.to($(this).find('.slide-cat span'), {duration: 0.5, y:-30, delay:0.05, opacity:0, ease:Power2.easeOut});
					}
				});
			
			}			

			
			$('.trigger-item').on('click', function() {
				if (!$('.showcase-portfolio').hasClass('list-grid')) {
					$("body").addClass("load-project-thumb");
				}
				$('.showcase-portfolio .trigger-item').each(function(){
					if (!$(this).hasClass("above")) {
						gsap.to($(this), {duration: 0.5, delay:0, opacity:0, ease:Power4.easeInOut});
					} else  {
						gsap.to($(this), {duration: 0.5, delay:0.4, opacity:0, ease:Power4.easeInOut});	
					}
				});
				setTimeout(function() {
					$("body").addClass("show-loader");
				}, 300);
				gsap.to('footer, .carousel-nav-wrapper, .showcase-portfolio.list-grid', { duration: 0.5, opacity: 0, ease: Power4.easeInOut });			
				gsap.to('#ball', { duration: 0.3, borderWidth: '4px', scale: 0.5, borderColor: '#999999', backgroundColor: 'transparent' });
				gsap.to('#ball-loader', { duration: 0.3, borderWidth: '4px', top: 0, left: 0 });
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
			});
			
		}
	
	}//End Showcase Portfolio
	
	

	
	
/*--------------------------------------------------
Function Showcase Lists
---------------------------------------------------*/
	
	function ShowcaseLists() {
	
		if( $('.showcase-lists').length > 0 ){
			
			$("footer").addClass("showcase-footer");
			
			// timeline slide list total height sum < window height,  then duplicate until they pass the window height
			const slidesRoot = document.querySelector('.clapat-sync-slider .clapat-sync-slider-wrapper .clapat-sync-slider-viewport');
			const slidesList = slidesRoot.querySelectorAll('.clapat-sync-slider .clapat-sync-slide');
			
			let slidesHeight = 0;
			for (const clapatSyncSlide of slidesList) {
				
				slidesHeight += clapatSyncSlide.offsetHeight;
			}
			let iterCloning = Math.floor(window.innerHeight/slidesHeight);
			if( iterCloning >= 1 ){
				
				iterCloning--;
				if( (window.innerHeight % slidesHeight) > 0 ){
					
					iterCloning++;
				}
				
				for( let i=0; i<iterCloning; i++ ){
				
					for (const clapatSyncSlide of slidesList) {
				
						let cloneSlide = clapatSyncSlide.cloneNode(true);
						slidesRoot.appendChild(cloneSlide);
					}
				}
			}
			
			const clapatSyncSlider = document.querySelector('.clapat-slider-wrapper.showcase-lists .clapat-sync-slider-viewport');
			const syncSliderClone = clapatSyncSlider.cloneNode(true);
			document.querySelector(".clapat-slider-wrapper.showcase-lists .clapat-sync-slider-wrapper").appendChild(syncSliderClone); 
			
			slider = new ClapatSlider('.showcase-lists', { 
				direction: 'vertical', 
				snap: false,
				navigation: {
					nextEl: '.cp-button-next',
					prevEl: '.cp-button-prev'
				},
				on: {
					init : function() {						
						if ($('body').hasClass("show-loader")) {							
							gsap.to($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {duration: 0.5, opacity:1, delay:0.3, ease:Power2.easeOut});						
						}						
					}
				} 
			});
				 
			
			const syncSliderCloneTranslate = document.querySelectorAll('.clapat-slider-wrapper.showcase-lists .clapat-sync-slider-wrapper > .clapat-sync-slider-viewport');
			const titleWrapper = document.querySelector('.clapat-sync-slider-wrapper')
			
			slider.tl
				.fromTo('.clapat-slider-wrapper.showcase-lists .clapat-sync-slider-wrapper', {yPercent: 0 },{ yPercent: -(100 - (100 / syncSliderCloneTranslate.length))},0)
				.fromTo('.hover-reveal', {y: 0}, {y: + (titleWrapper.offsetHeight/2)}, 0)
				.fromTo('.progress-info-fill', {backgroundSize:"0% 100%" }, {backgroundSize:"100% 100%" }, 0)
				.fromTo('.progress-info-fill-2', {backgroundSize:"100% 100%" }, {backgroundSize:"0% 100%", duration: 0.3, ease: 'power3' }, 0);
				
			$('.carousel-prev').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"-= 180"}); 
				}
			});
			
			$('.carousel-next').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					 window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"+= 90"}); 
				}
			});
			
			
			if (!isMobile()) {				
				
				var dragWrapper = $('.clapat-slider');
				dragWrapper.on('mousedown', function (evt) {
					dragWrapper.on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {					  
							// click
							gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999',});
							$("body").removeClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							
							$(".showcase-lists .clapat-sync-slide .slide-inner").on('click', function() {	
								if (!$('body').hasClass('scale-drag-y')) {
									gsap.to($(".showcase-lists .slide-title span"), {duration: 0.4, y: -70, opacity:0, delay:0.1, ease:Power2.easeInOut});
									gsap.to($(".showcase-lists .slide-title i"), {duration: 0.3, opacity:0, delay:0, ease:Power2.easeInOut});
								}			
							})
							
							
						} else {
							// drag
							if ($('#magic-cursor').hasClass("light-content")) {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#fff', backgroundColor:'transparent'});
							} else {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#000', backgroundColor:'transparent'});
							}
							$("body" ).addClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
						  
						}
						dragWrapper.off('mouseup mousemove', handler);
					});
				});
				
					
				$('.clapat-slider').on('mouseup touchend', function() {
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");
				});
				
				$("body").on('mouseleave', function() {					
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");					
				});
				
				$(".showcase-lists .clapat-sync-slide .slide-inner").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						$('#ball p').remove();
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});
				
				$('.clapat-sync-slide').on('mouseenter', function() {
					$('.clapat-sync-slide').addClass('disable');
					$(this).removeClass('disable');
					$(this).find('video').each(function() {
						$(this).get(0).play();
					});
				}).on('mouseleave', function() {
					$('.clapat-sync-slide').removeClass('disable');
					$(this).find('video').each(function() {
						$(this).get(0).pause();
					});
				});
			
			}
			
			const getMousePos = (e) => {
				let posx = 0;
				let posy = 0;
				if (!e) e = window.event;
				if (e.pageX || e.pageY) {
					posx = e.pageX;
					posy = e.pageY;
				}
				else if (e.clientX || e.clientY) 	{
					posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				return { x : posx, y : posy }
			}
			
			// Effect 1
			class HoverImgFx1 {
				constructor(el) {
					this.DOM = {el: el};
					this.DOM.reveal = this.DOM.el.querySelector('.hover-reveal');				
					this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
					this.DOM.revealInner.style.overflow = 'hidden';
					this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');
					this.initEvents();
				}
				initEvents() {	
					this.positionElement = (ev) => {
						const mousePos = getMousePos(ev);		
						gsap.to($('.hover-reveal'), { 
							duration: 0.7, 
							top: `${mousePos.y-(this.DOM.el.querySelector('.hover-reveal').offsetHeight*0.5)}px`, 
							left: `${mousePos.x-(this.DOM.el.querySelector('.hover-reveal').offsetWidth*0.5)}px`,
							
							/*top: `${window.innerHeight*0.5-(this.DOM.el.querySelector('.hover-reveal').offsetHeight*0.5)}px`, 
							left: `${window.innerWidth*0.5-(this.DOM.el.querySelector('.hover-reveal').offsetWidth*0.5)}px`, */
							
							ease:Power4.easeOut 
						});
					};
					this.mouseenterFn = (ev) => {
						this.positionElement(ev);
						this.showImage();
					};
					this.mousemoveFn = ev => requestAnimationFrame(() => {
						this.positionElement(ev);
					});
					this.mouseleaveFn = () => {
						this.hideImage();
					};
					
					this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
					this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
					this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
				}
				showImage() {
					gsap.killTweensOf(this.DOM.revealInner);
					gsap.killTweensOf(this.DOM.revealImg);
			
					this.tl = gsap.timeline({
						onStart: () => {
							this.DOM.reveal.style.opacity = 1;
							gsap.set(this.DOM.el, {zIndex: 1000});
						}
					})
					.add('begin')
					.add(gsap.to(this.DOM.revealInner, {
						duration: 0.4,
						ease: Sine.easeOut,
						startAt: {x: '-100%'},
						x: '0%'
					}), 'begin')
					.add(gsap.to(this.DOM.revealImg, {
						duration: 0.4,
						ease: Sine.easeOut,
						startAt: {x: '100%'},
						x: '0%'
					}), 'begin');
				}
				hideImage() {
					gsap.killTweensOf(this.DOM.revealInner);
					gsap.killTweensOf(this.DOM.revealImg);
			
					this.tl = gsap.timeline({
						onStart: () => {
							gsap.set(this.DOM.el, {zIndex: 999});
						},
						onComplete: () => {
							gsap.set(this.DOM.el, {zIndex: ''});
							gsap.set(this.DOM.reveal, {opacity: 0});
						}
					})
					.add('begin')
					.add(gsap.to(this.DOM.revealInner, {
						duration: 0.4,
						ease: Sine.easeOut,
						x: '100%'
					}), 'begin')
					
					.add(gsap.to(this.DOM.revealImg, {
						duration: 0.4,
						ease: Sine.easeOut,
						x: '-100%'
					}), 'begin');
				}
			}
			
			Array.from(document.querySelectorAll('.clapat-sync-slide')).forEach(link => new HoverImgFx1(link));
			
			
			$('.trigger-item').on('click', function() {
				
				$("body").addClass("load-project-thumb");
			
				setTimeout(function() {
					$("body").addClass("show-loader");
				}, 300);
			
				gsap.to('footer, .carousel-nav-wrapper', { duration: 0.5, opacity: 0, ease: Power4.easeInOut });
			
				gsap.to('#ball', { duration: 0.3, borderWidth: '4px', scale: 0.5, borderColor: '#999999', backgroundColor: 'transparent' });
				gsap.to('#ball-loader', { duration: 0.3, borderWidth: '4px', top: 0, left: 0 });
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
			});
			
			
		}	
		
			
	}//End Showcase Lists	
	
	
/*--------------------------------------------------
Function Showcase Gallery
---------------------------------------------------*/	
		
	function ShowcaseGallery() {
		
		if( $('.showcase-gallery').length > 0 ){
			
			const updateGalleryItemHeight = () => {
				const items = document.querySelectorAll('.showcase-gallery .clapat-slide .slide-inner');
				if (!items.length) {
					return;
				}

				const isPhone = window.matchMedia('(max-width: 640px)').matches;
				const isTablet = window.matchMedia('(max-width: 1200px)').matches && !isPhone;
				const ratio = isPhone ? 120 : isTablet ? 105 : 90; // desktop items stay visibly shorter
				const heightUnit = ratio / 10;
				// const aspect = `10 / 14`;
				const aspect = `10 / ${heightUnit}`;

				items.forEach((item) => {
					item.style.setProperty('--gallery-item-ratio', `${ratio}%`);
					item.style.setProperty('--gallery-item-aspect', aspect);
				});
			};

			updateGalleryItemHeight();

			if (window.__harpiaGalleryResizeHandler) {
				window.removeEventListener('resize', window.__harpiaGalleryResizeHandler);
			}

			const galleryResizeHandler = (() => {
				let resizeTimer;
				return () => {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(updateGalleryItemHeight, 150);
				};
			})();

			window.addEventListener('resize', galleryResizeHandler);
			window.__harpiaGalleryResizeHandler = galleryResizeHandler;
			
			$("footer").addClass("showcase-footer");
			
			gsap.set($(".showcase-gallery .slide-hero-title span, .showcase-gallery .slide-hero-subtitle span"), { y: 120, opacity: 0 });
			gsap.set($(".showcase-gallery .clapat-slider .slide-inner"), { opacity: 0 });
			
			
			
			slider = new ClapatSlider('.showcase-gallery', { 
				direction: 'vertical', 
				snap: false,
				navigation: {
					nextEl: '.cp-button-next',
					prevEl: '.cp-button-prev'
				},
				parallax : [{
					element: '.speed-50',
					margin: -80					
				}],
				on: {	
					init : function(slide) {
						
						if ($('body').hasClass("show-loader")) {
							
							imagesLoaded('body', function() {
						
								gsap.to($(".showcase-gallery .slider-fixed-content .caption-timeline span"), { duration: 0.7, y: 0, opacity: 1, stagger: 0.1, delay: 0.55, ease: Power3.easeOut });
								gsap.to($(".showcase-gallery .clapat-slider .clapat-slide .slide-inner"), { duration: 0.7, opacity: 1, delay: 0.4, ease: Power2.easeOut });
								
								var gallerySlideClasses = [".clapat-slide-prev-two", ".clapat-slide-prev", ".clapat-slide-active", ".clapat-slide-next", ".clapat-slide-next-two"];
								
								gallerySlideClasses.forEach(function(gallerySlideClass, index) {
									var gallerySlide = $(".showcase-gallery .clapat-slider " + gallerySlideClass + " .slide-inner");
									var delay = 0 + index * 0.1;						
									gsap.set(gallerySlide, { yPercent: 150 });
									gsap.to(gallerySlide, { duration: 1.5, yPercent: 0, delay: delay, ease: Power4.easeOut });
								});
								
								gsap.to($("#filters-wrapper, .clapat-pagination, .cp-button-prev, .cp-button-next, .progress-info, footer .link-text"), {duration: 0.5, opacity:1, delay:0.4, ease:Power2.easeOut});
							
							});
						
						}
						
					},
					slideLeaveViewport : function( slide ) {						
						gsap.set($('.clapat-slider div:not(.clapat-slide-visible) .slide-events'), { y: "" });						
					},

				},
			});
			
			 slider.tl					
			 	.fromTo('.progress-info-fill', {backgroundSize:"0% 100%" }, {backgroundSize:"100% 100%" }, 0)
				.fromTo('.progress-info-fill-2', {backgroundSize:"100% 100%" }, {backgroundSize:"0% 100%", duration: 0.3, ease: 'power3' }, 0);
				
				
			
			$('.carousel-prev').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"-= 180"}); 
				}
			});
			
			$('.carousel-next').on( 'click', function() {				
				if( window.rotateElement && window.rotateElement.isActive() ){  
					return; 
				} else {
					 window.rotateElement = gsap.to($(this).find('i'), {duration: 0.3, rotate:"+= 90"}); 
				}
			});
			
			class Item {
								
				constructor(DOM_el) {
					
					// DOM elements
					this.DOM = {
						// main element (.item)
						el: null,
						// imageWrap (.item__image-wrap)
						imageWrap: null,
						// imageCaption
						imageCaption: null,
						// image (.item__image)
						image: null,
						// imageInner (.item__image > .item__image-inner)
						imageInner: null,
					}; 
					
					this.DOM.el = DOM_el;
					this.DOM.imageWrap = this.DOM.el.querySelector('.slide-moving');
					if( this.DOM.imageWrap != null ){						
						this.DOM.imageCaption = this.DOM.imageWrap.querySelector('.slide-caption');
					}
					this.DOM.image = this.DOM.el.querySelector('.trigger-item');
					if( this.DOM.image != null ){						
						this.DOM.imageInner = this.DOM.image.querySelector('.section-image');
					}
				}
			}
			
			
			// Placeholder for the grid items (.item__image). We'll use the gsap FLIP plugin to move the "".item .item__image" inside the grid element
			const grid = document.querySelector('.gallery-thumbs-wrapper');
			const triggeredImage = document.querySelector('.gallery-zoom-wrapper');
			
			let animateTitle = gsap.timeline();	
					
			let endScaleSmall = gsap.getProperty(".showcase-gallery .has-scale-small .section-image", "scale");
			gsap.set(".showcase-gallery .has-scale-small .section-image", { scale:endScaleSmall});		
			let endScaleMedium = gsap.getProperty(".showcase-gallery .has-scale-medium .section-image", "scale");
			gsap.set(".showcase-gallery .has-scale-medium .section-image", { scale:endScaleMedium});			
			
			
			const showGrid = () => {
				
				document.body.classList.add('grid-open', 'disable-scroll');
				
				slider.enabled = false;
				
				gsap.to($("footer .link-text, .clapat-pagination, .progress-info, #filters-wrapper"), {duration: 0.3, opacity:0, y:30, stagger:-0.05, ease:Power2.easeInOut});
				gsap.to($(".showcase-gallery .slider-fixed-content .caption-timeline span"), { duration: 0.3, y: -100, opacity: 0, stagger: 0.1, delay: 0, ease: Power3.easeIn });
				
				
				// get the DOM elements that we'll work with
				const DOM = getDOMElements();
				const allImages = DOM.grid.map(element => {
					
					element.item.DOM.image.setAttribute('data-slide-index', element.item_index);
					return element.item.DOM.image;
				});
				const allImagesInner = DOM.grid.map(element => element.item.DOM.imageInner);
				const currentImage = DOM.currentItem.DOM.image;
				const currentImageInner = DOM.currentItem.DOM.imageInner;
				const currentImageCaption = DOM.currentItem.DOM.imageCaption;
							
				// Use gsap flip for the animation
				// save the current state of the images
				const flipstate = Flip.getState([allImages]);				
				const flipstate1 = Flip.getState([currentImage]);
								
				gsap.set(currentImage.closest(".clapat-slide"), {zIndex: 0});
				
				// put them inside the .grid element
				grid.append(...allImages);
				
				currentImage.setAttribute('data-slide-index', DOM.currentIndex);
				triggeredImage.append(currentImage);
				triggeredImage.append(currentImageCaption);
				
				gsap.to(".clapat-slider .clapat-slide .trigger-item", { duration: 1, opacity:0, scale:0.7, ease:Power2.easeOut });
				
				// Flip it
				Flip.from(flipstate, {
					duration: 0.7,
					stagger:0.02,
					ease: 'power3.inOut',
					absolute: true,					 
				})
				.to(currentImageInner, {
					duration: 0.7,
					ease: 'power3.inOut',
					scale:1,
					onComplete: () => {
						document.body.classList.add('enable-trigger');
				  	}
				}, 0)
				.to(allImagesInner, {
					duration: 0.7,
					ease: 'power3.inOut',
					scale:1,
				}, 0)
				.to(".img-mask", {
					duration: 0.7,
					ease: 'power3.inOut',
					opacity:1
				}, 0)
				
				Flip.from(flipstate1, {
					duration: 0.7 ,
					ease: 'power3.inOut',
					absolute: true       
				});
				
				animateTitle.set(".showcase-gallery .slide-caption span", { y: 120, opacity:0});				
				animateTitle.to(".showcase-gallery .gallery-zoom-wrapper .slide-caption span", { duration: 0.5, y: 0, opacity:1, delay:0.2, stagger:0.03,  ease:Power2.easeOut });				
				gsap.to(".showcase-gallery .gallery-zoom-wrapper a.slide-link", { duration: 0.7, opacity:1, scale:1, ease:Power2.easeIn });
				
			};
			
			const hideGrid = () => {
				
				gsap.to(".clapat-slider .clapat-slide .trigger-item", { duration: 0.5, opacity:1, scale:1, delay:0.2, ease: 'power3.inOut' });				
				gsap.to($(".showcase-gallery .gallery-zoom-wrapper .slide-caption"), {duration: 0.25, opacity:0, delay:0, ease:Power2.easeOut});
				animateTitle.to(".showcase-gallery .gallery-zoom-wrapper .slide-caption span", { duration: 0.5, y: -100, opacity:0, ease:Power2.easeInOut});
				gsap.to(".showcase-gallery a.slide-link", { duration: 0.3, opacity:0, scale:0.8, delay:0, ease:Power2.easeOut });
				
				document.body.classList.remove('grid-open');
				
				slider.enabled = true;
				
				// get the DOM elements that we'll work with
				const DOM = getDOMElements();
				const allImages = document.querySelectorAll('.gallery-thumbs-wrapper .trigger-item');
				const currentImage = document.querySelector('.gallery-zoom-wrapper .trigger-item');
				const currentImageCaption = document.querySelector('.gallery-zoom-wrapper .slide-caption');
				const currentImageInner = document.querySelector('.gallery-zoom-wrapper .trigger-item .section-image');
			
				const flipstate = Flip.getState([allImages]);				
				const flipstate1 = Flip.getState([currentImage]);
							
				allImages.forEach((image) => {					
					let index = image.getAttribute('data-slide-index');
					let element = DOM.items[index];
					image.removeAttribute('data-slide-index');
					element.DOM.imageWrap.appendChild( image );
				});
				
				currentImage.removeAttribute('data-slide-index');
				DOM.currentItem.DOM.imageWrap.appendChild(currentImage);
								
				// Remove all the elements from the grid and current triggered image divs
				const liveGrid = document.querySelector('.gallery-thumbs-wrapper');
				const liveTriggeredImage = document.querySelector('.gallery-zoom-wrapper');
				
				while (liveGrid.firstChild) {
					liveGrid.removeChild(liveGrid.firstChild);
				}
				
				Flip.from(flipstate, {
					duration: 0.7,
					stagger:0.02,
					ease: 'power3.inOut'
				});				
				
				Flip.from(flipstate1, {
					duration: 0.7,
					stagger:0.02,
					ease: 'power3.inOut',					
					onComplete: function() {
						
						DOM.currentItem.DOM.imageWrap.appendChild(currentImageCaption);	
						
						const triggeredItem = document.querySelector('.clapat-slide.triggered-item');
						if( triggeredItem != null ){							
							triggeredItem.classList.remove('triggered-item');
						}
						
						const clapatSlides = document.querySelectorAll('.clapat-slide');
						clapatSlides.forEach(slide => {
						  	slide.style.zIndex = '';
							slideInner = slide.querySelector('.slide-inner');
							slideInner.classList.remove('disabled');

						});					
						
						document.body.classList.remove('disable-scroll','enable-trigger');
						gsap.set($(".showcase-gallery .slide-caption"), {clearProps: "opacity"});
						
					}
				}).to($('.showcase-gallery .has-scale-small .section-image'), {
					duration: 0.7,
					ease: 'power3.inOut',
					scale:endScaleSmall
				}, 0).to($('.showcase-gallery .has-scale-medium .section-image'), {
					duration: 0.7,
					ease: 'power3.inOut',
					scale:endScaleMedium
				}, 0)
				
				gsap.to($("footer .link-text, .clapat-pagination, .progress-info, #filters-wrapper"), {duration: 0.3, opacity:1, y:0, stagger:0.05, delay:0.4, ease:Power2.easeInOut});
				gsap.set($('.showcase-gallery .slider-fixed-content .caption-timeline span'), { y: 100});
				gsap.to($(".showcase-gallery .slider-fixed-content .caption-timeline span"), { duration: 0.7, y: 0, opacity: 1, stagger: 0.1, delay: 0.3, ease: Power3.easeOut });
				gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
				gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
				
			
			}
			
			// Returns some DOM elements that are needed for showing/hiding the grid
			const getDOMElements = () => {
			
				// Item instances (slides)
				const items = [];
				[...document.querySelectorAll('.clapat-slide')].forEach(item => {
					items.push(new Item(item));
				});
						
				// Cloned items
				const itemsCloned = [];
				[...document.querySelectorAll('.clapat-slide-clone')].forEach(item => {
					itemsCloned.push(new Item(item));
				});
			
				let firstVisibleIndex = -1;
				let direction = slider.opts.direction;
								
				for( let i = 0; i < items.length; i++ ){
					
					let item = items[i];
					let bounding = item.DOM.el.getBoundingClientRect();
					if( direction == "vertical" ){
					
						start = bounding.top;
						end = bounding.bottom;
					}
					else {
						
						start = bounding.left;
						end = bounding.right;
					}
					if( (start <= 0) && (end > 0) ){
							
						firstVisibleIndex = i;						
						break;
					}
										
				}
				
				const gridItems = [];
				let currentIndex = -1;
				if( direction == "vertical" ){
					
					let selectedItems = 0;
					// in case of the vertical direction cloned items are reverted, last one becomes first
					if( firstVisibleIndex >= itemsCloned.length ){
							
						// the first visible index is a clone, therefore iterate back to the first clone
						for( index = firstVisibleIndex; (index >= itemsCloned.length); index-- ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
						// and then from the beginning the rest of the clones
						for( index = 0; (selectedItems < itemsCloned.length); index++ ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
							
					}
					else{
						
						// the first visible index is not a clone, therefore iterate from the beginning of the items
						for( index = firstVisibleIndex; (index < itemsCloned.length); index++ ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
						// and then from the end of the clones
						for( index = items.length-1; (selectedItems < itemsCloned.length); index-- ){
								
							let item = items[index];
							if( !item.DOM.el.classList.contains('triggered-item') ){
									
								gridItems.push( {item_index: index, item: item} );
							}
							else{
									
								currentIndex = index;
							}
							
							selectedItems++;
						}
					}
					
				}
				else {
					
					let iterator = 0;
					while ( iterator < itemsCloned.length ){
						
						let index = gsap.utils.wrap( 0, items.length, firstVisibleIndex + iterator);
						let item = items[index];
						if( !item.DOM.el.classList.contains('triggered-item') ){
							
							gridItems.push( {item_index: index, item: item  } );
						}
						else{
							
							currentIndex = index;
						}
						iterator++;
					}
				}
				
				return {					
					items: items,					
					grid: gridItems,					
					currentItem: new Item( document.querySelector('.clapat-slide.triggered-item') ),
					currentIndex: currentIndex
				};
				
			}
			
			let bGridSwiped = false;
			// Initialize the events
			const initEvents = () => {
				
				const items = document.querySelectorAll('.slide-inner');
				items.forEach((triggerItem) => {
					
					triggerItem.addEventListener('click', (event) => {
						
						if( $('.showcase-gallery').length > 0 ){
							
							event.currentTarget.closest('.clapat-slide').classList.add('triggered-item');
							showGrid();
						}
					});
					
				});
				
				window.addEventListener("wheel", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
						hideGrid();
					}
				});
				
				window.addEventListener("touchmove", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
						bGridSwiped = true;
					}
				});
				window.addEventListener("touchcancel", event => {
					
					if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
						bGridSwiped = false;
					}
				});
				window.addEventListener("touchend", event => {
					
					if(document.body.classList.contains("grid-open") && bGridSwiped && ( $('.showcase-gallery').length > 0 ) ) {
						bGridSwiped = false;
						hideGrid();
					}
				});
				
				const closeGrid = document.querySelector('.gallery-close-thumbs');
				
				if( closeGrid != null ){
					
					closeGrid.addEventListener("click", event => {
						
						if(document.body.classList.contains("grid-open") && ( $('.showcase-gallery').length > 0 ) ) {
							hideGrid();
						}
					});
				}
				
				function moveThumbGrid( direction = "next" ){
					
					if(document.body.classList.contains("grid-open")) {
							
						const allImages = document.querySelectorAll('.gallery-thumbs-wrapper .trigger-item');
						if( allImages.length <= 0 ){
							
							return;
						}
						const currentImage = document.querySelector('.gallery-zoom-wrapper .trigger-item');
						const currentImageCaption = document.querySelector('.gallery-zoom-wrapper .slide-caption');
						const currentImageInner = document.querySelector('.gallery-zoom-wrapper .trigger-item .section-image');
						const liveGrid = document.querySelector('.gallery-thumbs-wrapper');
						const liveTriggeredImage = document.querySelector('.gallery-zoom-wrapper');
							
						let currentIndex = Number( currentImage.getAttribute('data-slide-index') );
						let nextImage = null;
						
						if( direction == "next" ){
						
							for( let i=0; i<allImages.length; i++ )
							{
								let image = allImages[i];
								let index = Number( image.getAttribute('data-slide-index') );
								if( nextImage == null ){
									
									if( index > currentIndex ){
											
										nextImage = image;
										break
									}
								}
							}
						}
						else {
						
							for( let i=allImages.length-1; i>=0; i-- )
							{
								let image = allImages[i];
								let index = Number( image.getAttribute('data-slide-index') );
								if( nextImage == null ){
									
									if( index < currentIndex ){
											
										nextImage = image;
										break
									}
								}
							}
						}
						
						const flipstate = Flip.getState([allImages, /*allImagesInner*/, currentImage, /*currentImageInner*/]);
							
						if( nextImage != null ){
							
							liveGrid.replaceChild( currentImage, nextImage );
						}
						else{
							
							if( direction == "next" ){
								
								nextImage = allImages[0];
								liveGrid.appendChild( currentImage );
							}
							else{
								
								nextImage = allImages[allImages.length-1];
								liveGrid.insertBefore( currentImage, liveGrid.firstChild );
							}
							
						}
						
						liveTriggeredImage.appendChild( nextImage );
						
						// Get all the slides
						let slides = document.querySelectorAll('.clapat-slide');
						
						// Remove the caption in the image preview in order to replace it with the next
						let currentSlide = slides[currentIndex];
						let elWrap = currentSlide.querySelector('.slide-moving');
						if( elWrap != null ){
							
							animateTitle.to(".showcase-gallery .gallery-zoom-wrapper .slide-caption span", { duration: 0.2, y:-15, opacity:0, delay:0, stagger:0, ease:Power2.easeInOut, onComplete: function() { 
								elWrap.appendChild(currentImageCaption);
							}});
														
							
						}
						
						// Update the triggered item flag in slider as it marks the current image
						$('.clapat-slide').removeClass('triggered-item');
						let indexSlide = Number( nextImage.getAttribute('data-slide-index') );
						let nextSlide = slides[indexSlide];
						if( nextSlide ){
							
							nextSlide.classList.add('triggered-item');
							let elNextWrap = nextSlide.querySelector('.slide-moving');
							if( elNextWrap != null ){
								
								let nextCaption = elNextWrap.querySelector('.slide-caption');
								liveTriggeredImage.appendChild( nextCaption );
							}
						}
						
						// Move the slider to the next or prev slide
						slider.goTo(indexSlide);
						
						animateTitle.set(".showcase-gallery .slide-caption span", { y: 15, opacity:0});				
						gsap.to(".showcase-gallery a.slide-link", { duration: 0.2, opacity:0, scale:0.8, ease:Power2.easeInOut });
															
						Flip.from(flipstate, {
							duration: 0.5,
							stagger:0,
							ease: 'power3.inOut',
							absolute: true,
							onComplete: function() {
								animateTitle.to(".showcase-gallery .gallery-zoom-wrapper .slide-caption span", { duration: 0.3, y: 0, opacity:1, delay:0, stagger:0.03, ease:Power2.easeOut });
								gsap.to(".showcase-gallery .gallery-zoom-wrapper a.slide-link", { duration: 0.3, opacity:1, scale:1, delay:0, ease:Power2.easeOut });
							}					 
						})
						
						
						
					}
				}
				
				function throttle(calback, delay = 250) {

					let shouldWait = false;

					return (...args) => {
						
						if (shouldWait) return;

						calback(...args);
						shouldWait = true;
						setTimeout(() => {
							
							shouldWait = false;
						}, delay)
					}
				}
				
				const nextBtn = document.querySelector('.cp-button-next');
				
				if( nextBtn != null ){
					
					nextBtn.addEventListener("click", throttle( (event) => {
						console.log("Click event " + performance.now());
						moveThumbGrid("next");
					}, 500));
				}
				
				const prevBtn = document.querySelector('.cp-button-prev');
				
				if( prevBtn != null ){
					
					prevBtn.addEventListener("click", throttle( (event) => {
						
						moveThumbGrid("prev");
					}, 500));
				}
			
			};
			
			
			const previewModeEnabled = document.querySelector('.preview-mode-enabled');
			
			if (previewModeEnabled) {			
				initEvents();		
			}
			
			
			if (!isMobile()) {
				
				if ($('.showcase-gallery').hasClass("tilt-gallery")) {
					var timeout;
				
					$('.showcase-gallery').mousemove(function (e) {
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(callTiltSlider.bind(null, e));
					});
				
					function callTiltSlider(e) {
						moveItSlider(e, '.clapat-slider-viewport', 30);
					}
				
					function moveItSlider(e, target, movement) {
						var $this = $('.showcase-gallery');
						var relX = e.pageX - $this.offset().left;
						var relY = e.pageY - $this.offset().top;
						gsap.to(target, 1, {
							x: (relX - $this.width() / 2) / $this.width() * movement,
							y: (relY - $this.height() / 2) / $this.height() * movement,
							ease: "power4.out",
						});
					}
				}

				
				
				var dragWrapper = $('.clapat-slider');
				dragWrapper.on('mousedown', function (evt) {
					dragWrapper.on('mouseup mousemove', function handler(evt) {
						if (evt.type === 'mouseup') {					  
							// click
							gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
							$("body").removeClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
							
						} else {
							// drag
							if ($('#magic-cursor').hasClass("light-content")) {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#fff', backgroundColor:'transparent'});
							} else {
								gsap.to('#ball', {duration: 0.2, borderWidth: '2px', scale: 1, borderColor:'#000', backgroundColor:'transparent'});
							}
							$("body" ).addClass("scale-drag-y");
							$("#ball").removeClass("with-icon");
							$('#ball i').remove();
						  
						}
						dragWrapper.off('mouseup mousemove', handler);
					});
				});
				
					
				$('.clapat-slider').on('mouseup touchend', function() {
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");
				});
				
				$("body").on('mouseleave', function() {					
					gsap.to('#ball', {duration: 1, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent', ease:Elastic.easeOut});
					$("body").removeClass("scale-drag-y");					
				});
					
				
				$(".showcase-gallery.preview-mode-enabled .clapat-slide .slide-inner").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						$('#ball p').remove();
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
						gsap.to($(".slider-fixed-content"), { duration: 0.3, opacity: 0.4 });
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
						gsap.to($(".slider-fixed-content"), { duration: 0.3, opacity: 1});
					}
				});
				
				$(".trigger-item").on('mouseenter', function() {	
					if (!$('body').hasClass('scale-drag-x')) {
						var $this = $(this);			
						gsap.to('#ball', {duration: 0.3, borderWidth: '2px', scale: 1.4, borderColor:"rgba(255,255,255,0)", backgroundColor:"rgba(255,255,255,0.1)"});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '2px', top: 2, left: 2});
						$("#ball").addClass("with-blur");
						$( "#ball" ).append( '<p class="center-first">' + $this.data("centerline") + '</p>' );
						$(this).find('video').each(function() {
							$(this).get(0).play();
						});
					}			
				}).on('mouseleave', function() {					
					if (!$('body').hasClass('scale-drag-x')) {
						gsap.to('#ball', {duration: 0.2, borderWidth: '4px', scale:0.5, borderColor:'#999999', backgroundColor:'transparent'});
						gsap.to('#ball-loader', {duration: 0.2, borderWidth: '4px', top: 0, left: 0});
						$("#ball").removeClass("with-blur");
						$('#ball p').remove();		
						$(this).find('video').each(function() {
							$(this).get(0).pause();
						});
					}
				});
			
			}
			
			$('.slide-hero-title span, .slide-hero-subtitle span').wrap('<div></div>');
			
			
			if( $('#filters-wrapper').length > 0 ){
				
				$('li.filters-timeline a').on('click', function(e){			
					e.preventDefault();				
					$('.slide-inner').removeClass('disabled');
					gsap.to( $('.slide-inner .img-mask'), {duration: 0.2, opacity: 1, ease: "power1.in" });
									
					let filterClass = $(this).attr('data-filter');
					if( filterClass == '*' ){
						return;
					}
					
					$( '.slide-inner' ).not(filterClass).addClass('disabled');				
					gsap.to( $('.slide-inner').not(filterClass).find(".img-mask"), {duration: 0.2, opacity: 0.2, ease: "power1.out" });				
				});
				
				$('#footer-container').on('click', '.toggle-filters, #close-filters', function() {
					var closeFiltersDiv = document.getElementById("close-filters");
					
					if (!closeFiltersDiv) {
						closeFiltersDiv = document.createElement("div");
						closeFiltersDiv.id = "close-filters";
						document.getElementById("footer-container").appendChild(closeFiltersDiv);
					} else {
						closeFiltersDiv.parentNode.removeChild(closeFiltersDiv);
					}
					
					var filtersWrapper = $("#filters-wrapper");
					filtersWrapper.toggleClass("on open active");
					$(".toggle-filters").text(filtersWrapper.hasClass("on") ? "Close" : "Filters");
					
					var filters = $('#filters');
					var filtersLi = filters.find('li');
					var filtersHeight = 4 + filtersLi.toArray().reduce((acc, li) => acc + $(li).outerHeight(true), 0);
					
					gsap.to(filters, { duration: 0.3, opacity: filtersWrapper.hasClass("on") ? 1 : 0, height: filtersWrapper.hasClass("on") ? filtersHeight : 0, delay: 0 });
					gsap.to('.active-filter-bg', { duration: 0.3, opacity: filtersWrapper.hasClass("on") ? 1 : 0, delay: 0.1 });
				});
			
			
				$("#filters-wrapper").on('click', function () {
					if ($(window).width() > 1024) {
						var filtersWrapper = $(this);
						filtersWrapper.addClass("open");
						setTimeout(() => filtersWrapper.addClass("active"), 200);
					}
				});
				
				$("#filters").on('mouseleave', function() {
					if ($(window).width() > 1024) {
						var filtersWrapper = $("#filters-wrapper");
						filtersWrapper.removeClass("open active on");
						gsap.to('#filters', { duration: 0.3, opacity: 0, height: 0, delay: 0.1 });
					}
				});
				
				
				var filtersTimeline = $(".filters-timeline");
				var firstChild = filtersTimeline.find(":first-child");
				var firstOffsetLeft = firstChild.position().left;
				var firstOffsetTop = firstChild.position().top;
				
				filtersTimeline.on('mouseenter', function() {
					var $this = $(this);
					var offsetLeft = $this.position().left;
					var offsetTop = $this.position().top;								
					gsap.to('.active-filter-bg', { duration: 0.3, width: $this.outerWidth(), x: offsetLeft, y: offsetTop });
					
				}).on('mouseleave', function() {
					gsap.to('.active-filter-bg', { duration: 0.3, width: firstChild.outerWidth(), x: firstOffsetLeft, y: firstOffsetTop });
					
				});
				
			}
			
			$('.trigger-item').on('click', function() {
				
				$("body").addClass("load-project-thumb");
				
				gsap.to(".showcase-gallery .gallery-zoom-wrapper .slide-caption span", { duration: 0.3, y:15, opacity:0, delay:0, stagger:0, ease:Power2.easeIn});
				gsap.to(".showcase-gallery a.slide-link", { duration: 0.3, opacity:0, scale:0.8, delay:0, ease:Power2.easeIn });
				gsap.to($(".gallery-thumbs-wrapper .trigger-item"), {duration: 0.3, y: 160, x:0,  opacity:1, stagger:0.05,  delay:0, ease:Power2.easeIn});
			
				setTimeout(function() {
					$("body").addClass("show-loader");
				}, 300);
			
				gsap.to('footer, .carousel-nav-wrapper', { duration: 0.5, opacity: 0, ease: Power4.easeInOut });
			
				gsap.to('#ball', { duration: 0.3, borderWidth: '4px', scale: 0.5, borderColor: '#999999', backgroundColor: 'transparent' });
				gsap.to('#ball-loader', { duration: 0.3, borderWidth: '4px', top: 0, left: 0 });
				$("#ball").removeClass("with-blur");
				$('#ball p').remove();
			});
			
			
		}
	
	}//End Showcase Gallery



	window.LoadViaAjax = function() {	
		
		CleanupBeforeAjax();	
		FirstLoad();
		ScrollEffects();
		Sliders();
		PageLoadActions();
		FitThumbScreenGSAP();
		ShowcaseCarousel();
		ShowcaseSlider();		
		ShowcasePortfolio();
		ShowcaseLists();
		ShowcaseGallery();
		FitThumbScreenWEBGL();		
		LazyLoad();	
		Shortcodes();		
		JustifiedGrid();
		Lightbox();
		PlayVideo();
		ContactForm();
		ContactMap();
		CustomFunction();
		HeroResponsiveBackground();
		
	}//End Load Via Ajax
	
});	


var LoadViaAjax = window.LoadViaAjax;	
	
	
