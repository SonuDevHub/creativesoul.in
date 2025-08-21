(function ($) {
	'use strict';


	var tt_isMobile = false;
	if ("maxTouchPoints" in navigator) {
		tt_isMobile = navigator.maxTouchPoints > 0;
	} else if ("msMaxTouchPoints" in navigator) {
		tt_isMobile = navigator.msMaxTouchPoints > 0;
	} else {
		const mQ = matchMedia?.("(pointer:coarse)");
		if (mQ?.media === "(pointer:coarse)") {
			tt_isMobile = !!mQ.matches;
		} else if ("orientation" in window) {
			tt_isMobile = true; // deprecated, but good fallback
		} else {
			// Only as a last resort, fall back to user agent sniffing
			tt_isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini|Tablet|Mobile/i.test(navigator.userAgent);
		}
	}

	// Add class "is-mobile" to </body>
	if (tt_isMobile) {
		$("body").addClass("is-mobile");
	}



	// =========================================
	// Page transitions
	// =========================================

	if ($("body").hasClass("creativesoul-transition")) {

		let $tt_pageTransition = $("#creativesoul-page-transition");
		let $tt_ptrPreloader = $(".creativesoul-ptr-preloader");
		let $tt_ptrOverlayTop = $(".creativesoul-ptr-overlay-top");
		let $tt_ptrOverlayBottom = $(".creativesoul-ptr-overlay-bottom");
		let $tt_ptrContentWrap = $("#creativesoul-content-wrap");

		let $tt_ptrDuration = 0.7; // Animation duration


		// Wrap words and elements inside the text
		// ========================================
		let $phCaptionAppear = $(".ph-caption-title, .ph-caption-subtitle, .ph-caption-description");
		if ($phCaptionAppear.length) {
			$phCaptionAppear.each(function () {
				let $this = $(this);
				$this.contents().each(function () {
					if (this.nodeType === 3) { // Text node
						let $text = $(this).text();
						let $wrappedText = $text.replace(/([^\s]+)/g, '<span class="creativesoul-cap-word-wrap"><span class="creativesoul-cap-word">$1</span></span>');
						$(this).replaceWith($wrappedText);
					} else if (this.nodeType === 1) { // Element node (HTML element)
						let $thisElement = $(this);

						// Exclude certain elements from being wrapped
						if ($thisElement.is('br') || $thisElement.is('hr')) {
							return;
						}

						// Wrap the HTML element itself
						let $wrappedElement = $('<span class="creativesoul-cap-word-wrap"><span class="creativesoul-cap-word"></span></span>');
						// Clone the current element and append it inside the newly created structure
						$wrappedElement.find('span.creativesoul-cap-word').append($thisElement.clone(true));

						// Replace the original element with the new wrapped structure
						$thisElement.replaceWith($wrappedElement);
					}
				});
			});
			$(".creativesoul-cap-word-wrap").css({ "display": "inline-flex", "overflow": "hidden" });
			$(".creativesoul-cap-word").css({ "display": "inline-block", "will-change": "transform" });
		}


		// Page transitions In 
		// ====================
		function ttAnimateTransitionIn() {
			let tl_transitIn = gsap.timeline({ defaults: { duration: $tt_ptrDuration, ease: Expo.easeInOut } });
			if ($tt_pageTransition.length) {
				tl_transitIn.set($tt_pageTransition, { autoAlpha: 1 });
				tl_transitIn.to($tt_ptrContentWrap, { autoAlpha: 0 }, 0.1);
				tl_transitIn.to($tt_ptrOverlayTop, { scaleX: 1, transformOrigin: "center left" }, 0);
				tl_transitIn.to($tt_ptrOverlayBottom, { scaleX: 1, transformOrigin: "center right" }, 0);
				tl_transitIn.to($tt_ptrPreloader, { autoAlpha: 1 }, 0.5);
			}
		}


		// Page transitions Out
		// =====================
		function ttAnimateTransitionOut() {
			let tl_transitOut = gsap.timeline({ defaults: { duration: $tt_ptrDuration, ease: Expo.easeInOut } });
			if ($tt_pageTransition.length) {
				tl_transitOut.to($tt_ptrPreloader, { autoAlpha: 0 });
				tl_transitOut.to($tt_ptrOverlayTop, { scaleX: 0, transformOrigin: "center left" }, 0.5);
				tl_transitOut.to($tt_ptrOverlayBottom, { scaleX: 0, transformOrigin: "center right" }, 0.5);
				tl_transitOut.from($tt_ptrContentWrap, { autoAlpha: 0, clearProps: "all" }, 0.7);
			}

			// Animate page header elements
			if ($(".ph-caption-title").length) {
				tl_transitOut.from(".ph-caption-title .creativesoul-cap-word", { yPercent: 101, ease: Power2.easeOut, clearProps: "yPercent" }, 1.3);
				// tl_transitOut.set(".ph-caption-title .creativesoul-cap-word-wrap", { overflow: "unset", clearProps: "overflow" }, 1.87); // Remove "overflow: hidden;"
			}

			if ($(".ph-caption-subtitle").length) {
				tl_transitOut.from(".ph-caption-subtitle .creativesoul-cap-word", { yPercent: 101, ease: Power2.easeOut, clearProps: "yPercent" }, 1.8);
				// tl_transitOut.set(".ph-caption-subtitle .creativesoul-cap-word-wrap", { overflow: "unset", clearProps: "overflow" }, 2.3); // Remove "overflow: hidden;"
			}

			if ($(".ph-caption-categories").length) {
				tl_transitOut.from(".ph-caption-categories", { y: 20, autoAlpha: 0, ease: Power2.easeOut, clearProps: "all" }, 1.8);
			}

			if ($(".ph-caption-description").length) {
				tl_transitOut.from(".ph-caption-description .creativesoul-cap-word", { yPercent: 101, ease: Power2.easeOut, clearProps: "yPercent" }, 2.1);
			}

			if ($(".ph-caption-meta").length) {
				tl_transitOut.from(".ph-caption-meta", { y: 20, autoAlpha: 0, ease: Power2.easeOut, clearProps: "all" }, 2.1);
			}

			if ($(".ph-caption").find(".creativesoul-btn").length) {
				tl_transitOut.from(".ph-caption .creativesoul-btn", { y: 20, autoAlpha: 0, ease: Power2.easeOut, clearProps: "all" }, 2.5);
			}

			if ($(".ph-image, .ph-video").length) {
				tl_transitOut.from(".ph-image img, .ph-video video", { duration: 1.2, scale: 1.2, autoAlpha: 0, ease: Power2.easeOut, clearProps: "all" }, 1);
			}

			if ($(".ph-social").length) {
				tl_transitOut.from($(".ph-social > ul > li"), { y: 40, autoAlpha: 0, stagger: 0.1, ease: Power2.easeOut, clearProps: "all" }, 1.7);
			}

			if ($(".ph-share").length) {
				tl_transitOut.from($(".ph-share"), { y: 40, autoAlpha: 0, stagger: 0.1, ease: Power2.easeOut, clearProps: "all" }, 1.7);
			}

			if ($(".creativesoul-scroll-down").length) {
				tl_transitOut.from($(".creativesoul-scroll-down-inner"), { y: 80, autoAlpha: 0, ease: Power2.easeOut, clearProps: "all" }, 1.7);
			}

		}

		// Force the page to reload on the browser by clicking the "Back" button
		window.onpageshow = function (event) {
			if (event.persisted) {
				window.location.reload();
			}
		}

		// Optimize event handling (on link click)
		$("a")
			.not('.no-transition') // omit from selection.
			.not('[target="_blank"]') // omit from selection.
			.not('[href^="#"]') // omit from selection.
			.not('[href^="mailto"]') // omit from selection.
			.not('[href^="tel"]') // omit from selection.
			.not('[data-fancybox]') // omit from selection
			.not('.creativesoul-btn-disabled') // omit from selection
			.not('.creativesoul-submenu-trigger > a[href=""]') // omit from selection
			.not('.ttgr-cat-classic-item a') // omit from selection
			.not('.ttgr-cat-item a') // omit from selection
			.on('click', function (e) {
				e.preventDefault();
				setTimeout((url) => {
					window.location = url;
				}, $tt_ptrDuration * 2000, this.href);

				ttAnimateTransitionIn();
			});

		// Animations on page load
		setTimeout(function () {
			ttAnimateTransitionOut();
		}, 0);
	}



	// =================================================================================
	// Background noise
	// =================================================================================

	if ($("body").hasClass("creativesoul-noise")) {
		$(".creativesoul-noise").each(function () {
			$(this).prepend('<div class="creativesoul-bg-noise"></div>');
		});
	}



	// ===========================================================
	// Lenis - smooth scroll plugin
	// More info: https://github.com/darkroomengineering/lenis
	// ===========================================================

	if ($("body").hasClass("creativesoul-smooth-scroll")) {
		if (!tt_isMobile) { // No effect on touch devices!

			// Init Lenis
			var lenis = new Lenis({
				duration: 1.5,
			});

			// GSAP ScrollTrigger integration
			lenis.on('scroll', ScrollTrigger.update)
			gsap.ticker.add((time) => {
				lenis.raf(time * 1000);
			})
			gsap.ticker.lagSmoothing(0);

		}
	}



	// ===================================================
	// Header
	// ===================================================

	if ($("#creativesoul-header").hasClass("creativesoul-header-fixed")) {
		$("body").addClass("creativesoul-header-fixed-on");
	}

	if ($("#creativesoul-header").hasClass("creativesoul-header-scroll")) {
		$("body").addClass("creativesoul-header-scroll-on");
	}

	// Hide header on scroll down and show on scroll up.
	// =================================================
	let didScroll;
	let lastScrollTop = 0;
	let delta = 120;
	let tt_Header = $("#creativesoul-header");
	let tt_HeaderScroll = $(".creativesoul-header-scroll");
	let navbarHeight = tt_HeaderScroll.outerHeight();

	$(window).scroll(function (event) {
		didScroll = true;
	});

	setInterval(function () {
		if (didScroll) {
			hasScrolled();
			didScroll = false;
		}
	}, 50);

	function hasScrolled() {
		let st = $(window).scrollTop();

		// Make sure they scroll more than delta
		if (Math.abs(lastScrollTop - st) <= delta)
			return;

		// If scrolled down and are past the header, add class .creativesoul-fly-up.
		// This is necessary so you never see what is "behind" the header.
		if (st > lastScrollTop && st > navbarHeight) {
			// Scroll Down
			tt_HeaderScroll.addClass("creativesoul-fly-up");
		} else {
			// Scroll Up
			if (st + $(window).height() < $(document).height()) {
				tt_HeaderScroll.removeClass("creativesoul-fly-up");
			}

			// Header filled
			if (tt_Header.hasClass("creativesoul-header-filled")) {
				if (tt_Header.hasClass("creativesoul-header-scroll") || tt_Header.hasClass("creativesoul-header-fixed")) {
					if (st > delta) {
						tt_Header.addClass("creativesoul-filled");
					} else {
						tt_Header.removeClass("creativesoul-filled");
					}
				}
			}
		}

		lastScrollTop = st;
	}


	// Style switch
	// =============
	// Note. Add the "creativesoul-lightmode-default" class to the <body> tag of your HTML page to enable light mode by default (you must clear your browser's cookies and cache first!).

	// Style switch button
	$(".creativesoul-style-switch").on("click", function () {
		$(this).toggleClass("active");
	});

	// Check for saved 'creativesoul-lightmode-on' in localStorage
	let lightMode = localStorage.getItem('creativesoul-lightmode-on');

	// Define enable and disable functions for light mode
	function enableLightMode() {
		$('body').addClass('creativesoul-lightmode-on');
		localStorage.setItem('creativesoul-lightmode-on', 'enabled');
	}

	function disableLightMode() {
		$('body').removeClass('creativesoul-lightmode-on');
		localStorage.setItem('creativesoul-lightmode-on', 'disabled');  // Save disabled state
	}

	// Check if light mode should be enabled by default
	if ($('body').hasClass('creativesoul-lightmode-default') && lightMode !== 'enabled') {
		enableLightMode();
	}

	// Apply saved light mode state if it was enabled previously
	if (lightMode === 'enabled') {
		enableLightMode();
	} else if (lightMode === 'disabled') {
		disableLightMode();
	}

	// Toggle light mode on button click
	$('.creativesoul-style-switch').on('click', function () {
		lightMode = localStorage.getItem('creativesoul-lightmode-on');

		if (lightMode !== 'enabled') {
			enableLightMode();
		} else {
			disableLightMode();
		}
	});



	// ==================================================
	// Main menu (classic)
	// ==================================================

	// Add class to <body> if mobile menu is active.
	function ttMobileMenuIsActive() {
		$("body").toggleClass("creativesoul-m-menu-on", window.matchMedia("(max-width: 1024px)").matches);
	}
	ttMobileMenuIsActive();
	$(window).on("resize", ttMobileMenuIsActive);


	// Sub menus
	// ==========

	// Open submenu on hover
	$(".creativesoul-submenu-wrap").on("mouseenter", function () {
		$(this).addClass("creativesoul-submenu-open");
	}).on("mouseleave", function () {
		$(this).removeClass("creativesoul-submenu-open");
	});

	// Prevent submenu trigger click if href is emty or contains # or #0
	$(".creativesoul-submenu-trigger > a").on("click", function (e) {
		let href = $(this).attr("href");
		if (!href || href === "#" || href === "#0") {
			e.preventDefault();
		}
	});

	// Only for desktop menu
	if (!$("body").hasClass("creativesoul-m-menu-on")) {

		// Keeping sub-menus inside screen (useful if multi level sub-menus are used). No effect on mobile menu!
		let $window = $(window);
		let $submenuTrigger = $(".creativesoul-submenu-trigger").parent();
		$submenuTrigger.on("mouseenter", function () {
			let $ttSubMenu = $(this).children(".creativesoul-submenu");
			let ttSubMenuPos = $ttSubMenu.offset();

			if (ttSubMenuPos.left + $ttSubMenu.outerWidth() > $window.width()) {
				let ttSubMenuNewPos = -$ttSubMenu.outerWidth();
				$ttSubMenu.css({ left: ttSubMenuNewPos });
			}
		});

		// Disable first click on touch devices (no effect on mobile menu!)
		if (tt_isMobile) {
			const ttSubmenuTriggers = $(".creativesoul-submenu-trigger > a");

			ttSubmenuTriggers.each(function () {
				const href = $(this).attr("href");
				if (href && href !== "#" && href !== "#0") {
					$(this).closest(".creativesoul-submenu-trigger").addClass("creativesoul-no-first-click");
				}
			});

			$(document).on("click", function (e) {
				const tt_mmTarget = $(e.target);
				const ttNoFirstClick = tt_mmTarget.closest(".creativesoul-no-first-click");
				const ttSubmenuOpen = tt_mmTarget.closest(".creativesoul-submenu-open");

				if (ttNoFirstClick.length) {
					ttNoFirstClick.removeClass("creativesoul-no-first-click");
					e.preventDefault();
				} else if (!ttSubmenuOpen.length) {
					ttSubmenuTriggers.closest(".creativesoul-submenu-trigger").addClass("creativesoul-no-first-click");
				}
			});
		}

	}


	// Mobile menu (for classic menu)
	// ===============================

	// Open/close mobile menu on toggle button click
	$("#creativesoul-m-menu-toggle-btn-wrap").on("click", function () {
		$("html").toggleClass("creativesoul-no-scroll");
		$("body").toggleClass("creativesoul-m-menu-open").addClass("creativesoul-m-menu-active");
		if ($("body").hasClass("creativesoul-m-menu-open")) {

			// Disable toggle button click until the animations last.
			$("body").addClass("creativesoul-m-menu-toggle-no-click");

			// Menu animationIn
			let tl_mMenuIn = gsap.timeline({
				onComplete: function () {
					$("body").removeClass("creativesoul-m-menu-toggle-no-click");
				}
			});

			tl_mMenuIn.to(".creativesoul-main-menu", { duration: 0.4, autoAlpha: 1 });
			tl_mMenuIn.from(".creativesoul-main-menu-content > ul > li", { duration: 0.4, y: 80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeOut, clearProps: "all" });

			// Mobile submenu accordion
			$('.creativesoul-submenu-trigger > a[href="#"], .creativesoul-submenu-trigger > a[href="#0"], .creativesoul-submenu-trigger > a[href=""]').parent(".creativesoul-submenu-trigger").append('<span class="creativesoul-submenu-trigger-m"></span>'); // if href contains #
			$(".creativesoul-submenu-trigger").append('<span class="creativesoul-m-caret"></span>');

			$(".creativesoul-submenu-trigger-m, .creativesoul-m-caret").on("click", function () {
				let $this = $(this).parent();
				if ($this.hasClass("creativesoul-m-submenu-open")) {
					$this.removeClass("creativesoul-m-submenu-open");
					$this.next().slideUp(350);
				} else {
					$this.parent().parent().find(".creativesoul-submenu").prev().removeClass("creativesoul-m-submenu-open");
					$this.parent().parent().find(".creativesoul-submenu").slideUp(350);
					$this.toggleClass("creativesoul-m-submenu-open");
					$this.next().slideToggle(350);
				}
			});

			// On menu link click
			$(".creativesoul-main-menu a, .creativesoul-logo a")
				.not('[target="_blank"]') // omit links that open in a new tab
				.not('[href="#"]') // omit dummy links
				.not('[href^="mailto"]') // omit mailto links
				.not('[href^="tel"]') // omit tel links
				.on('click', function () {
					let tl_mMenuClick = gsap.timeline({
						onComplete: function () {
							$("body").removeClass("creativesoul-m-menu-open creativesoul-m-menu-active");
							$("html").removeClass("creativesoul-no-scroll");

							// Close submenus if they are open
							if ($(".creativesoul-submenu-trigger").hasClass("creativesoul-m-submenu-open")) {
								$(".creativesoul-submenu").slideUp(350);
								$(".creativesoul-submenu-trigger").removeClass("creativesoul-m-submenu-open");
							}
						}
					});
					tl_mMenuClick.to(".creativesoul-main-menu-content > ul > li", { duration: 0.4, y: -80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeIn });
					tl_mMenuClick.to(".creativesoul-main-menu", { duration: 0.4, autoAlpha: 0, clearProps: "all" }, "+=0.2");
					tl_mMenuClick.set(".creativesoul-main-menu-content > ul > li", { clearProps: "all" });
				});

			// Close mobile menu if orientation change
			function ttCloseMobileMenu() {
				$("html").removeClass("creativesoul-no-scroll");
				$("body").removeClass("creativesoul-m-menu-open");
				$(".creativesoul-submenu").slideUp(0);
				$(".creativesoul-submenu-trigger").removeClass("creativesoul-m-submenu-open");
				$(".creativesoul-submenu-wrap").removeClass("creativesoul-submenu-open");
				gsap.set(".creativesoul-main-menu, .creativesoul-main-menu-content > ul > li", { clearProps: "all" });
			}
			$(window).on("orientationchange", ttCloseMobileMenu); // Close mobile menu on orientation change (for mobile view)

			$(window).on("resize", function () { // Close mobile menu on resize (for desktop view)
				if (window.matchMedia("(min-width: 1025px)").matches) {
					ttCloseMobileMenu();
				}
			});

		} else {

			// Disable toggle button click until the animations last.
			$("body").addClass("creativesoul-m-menu-toggle-no-click");

			// Menu animationOut
			let tl_mMenuOut = gsap.timeline({
				onComplete: function () {
					$("body").removeClass("creativesoul-m-menu-toggle-no-click creativesoul-m-menu-active");

					// Close submenus if open
					if ($(".creativesoul-submenu-trigger").hasClass("creativesoul-m-submenu-open")) {
						$(".creativesoul-submenu").slideUp(350);
						$(".creativesoul-submenu-trigger").removeClass("creativesoul-m-submenu-open");
					}
				}
			});
			tl_mMenuOut.to(".creativesoul-main-menu-content > ul > li", { duration: 0.4, y: -80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeIn });
			tl_mMenuOut.to(".creativesoul-main-menu", { duration: 0.4, autoAlpha: 0, clearProps: "all" }, "+=0.2");
			tl_mMenuOut.set(".creativesoul-main-menu-content > ul > li", { clearProps: "all" });
		}

		return false;
	});



	// ================================================================
	// Page header
	// ================================================================

	const $ttPageHeader = $("#page-header");

	if ($ttPageHeader.length) {

		// Add classes to <body>
		$("body").addClass("page-header-on");

		if ($ttPageHeader.hasClass("ph-full")) {
			$("body").addClass("ph-full-on");
		}

		if ($ttPageHeader.hasClass("ph-full-m")) {
			$("body").addClass("ph-full-m-on");
		}

		if ($ttPageHeader.hasClass("ph-center")) {
			$("body").addClass("ph-center-on");
		}

		if ($(".ph-image").length) {
			$("body").addClass("ph-image-on");
		}

		if ($(".ph-video").length) {
			$("body").addClass("ph-video-on");
		}

		if ($ttPageHeader.hasClass("ph-bg-is-light")) {
			if ($(".ph-image").length || $(".ph-video").length) {
				$("body").addClass("ph-bg-is-light-on");
			}
		}


		// If page header is visible on viewport 
		// ======================================
		ScrollTrigger.create({
			trigger: $ttPageHeader,
			start: "top bottom",
			end: "bottom top",
			scrub: true,
			markers: false,
			onLeave: () => toggleBodyClass(false),
			onEnter: () => toggleBodyClass(true),
			onLeaveBack: () => toggleBodyClass(false),
			onEnterBack: () => toggleBodyClass(true),
		});

		function toggleBodyClass(isVisible) {
			$("body").toggleClass("creativesoul-ph-visible", isVisible);
		}


		// Page header caption mask effect on hover
		// =========================================
		if (!tt_isMobile) {
			const $ttPhMask = $(".ph-mask");
			let cursorX = 0;
			let cursorY = 0;

			if ($ttPhMask.length) {
				$("body").addClass("ph-mask-on");

				// Follow cursor
				window.addEventListener("mousemove", (e) => {
					cursorX = e.pageX;
					cursorY = e.pageY - window.scrollY; // Adjust for scroll position
					updateMaskPosition();
				});

				function updateMaskPosition() {
					const maskRect = $ttPhMask[0].getBoundingClientRect(); // Get ph-mask position
					const xPercent = ((cursorX - maskRect.left) / maskRect.width) * 100;
					const yPercent = ((cursorY - maskRect.top) / maskRect.height) * 100;

					gsap.to($ttPhMask, {
						"--x": `${xPercent}%`,
						"--y": `${yPercent}%`,
						duration: 0.3,
						ease: "sine.out"
					});
				}

				// Handle scroll and resize
				window.addEventListener("scroll", updateMaskPosition);
				window.addEventListener("resize", updateMaskPosition);

				// Show mask on hover
				$("body.ph-mask-on .page-header-inner:not(.ph-mask) .ph-caption").on("mouseover", function () {
					$("body").addClass("ph-mask-active");
				}).on("mouseleave", function () {
					$("body").removeClass("ph-mask-active");
				});
			}
		}


		// Page header image/video parallax
		// =================================
		const $phBgMedia = $(".ph-image, .ph-video");
		if ($phBgMedia.length && $ttPageHeader.hasClass("ph-image-parallax")) {
			gsap.to(".ph-image-inner, .ph-video-inner", {
				yPercent: 30,
				ease: "none",
				scrollTrigger: {
					trigger: $ttPageHeader,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
					markers: false
				}
			});
		}

		// Page header caption parallax
		// =============================
		const $phCaption = $(".ph-caption");
		if ($phCaption.length && $ttPageHeader.hasClass("ph-caption-parallax")) {
			gsap.to(".ph-caption-inner", {
				// yPercent: 20,
				scale: 0.85,
				ease: "none",
				scrollTrigger: {
					trigger: $ttPageHeader,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
					markers: false,
				}
			});
		}

		// Page header scroll down circle and social buttons parallax
		// ===========================================================
		const $phScrItem = $(".creativesoul-scroll-down, .ph-social, .ph-share-inner");
		if ($phScrItem.length) {
			const $phScrWindow = $(window);

			const phScrTriggerHeight = $ttPageHeader.height();
			const phScrWindowHeight = $phScrWindow.height();

			// Check if the page header height is more than the window height
			if (phScrTriggerHeight > phScrWindowHeight) {
				$("body").addClass("ph-oversized-on");
				$phScrItem.css("position", "fixed");

				gsap.to($phScrItem, {
					ease: "none",
					scrollTrigger: {
						trigger: $ttPageHeader,
						start: "top bottom",
						end: "bottom bottom",
						markers: false,
						onEnter: () => phScrItemShow(),
						onLeave: () => phScrItemHide(),
						onEnterBack: () => phScrItemShow(),
						onLeaveBack: () => phScrItemHide(),
					}
				});

				function phScrItemShow() {
					$phScrItem.css("position", "fixed");
				}
				function phScrItemHide() {
					$phScrItem.css("position", "absolute");
				}

			} else {

				gsap.to($phScrItem, {
					scale: 0.8,
					autoAlpha: 0,
					ease: "none",
					scrollTrigger: {
						trigger: $ttPageHeader,
						start: "50% top",
						end: "70% top",
						scrub: true,
						markers: false
					}
				});

			}
		}

	}



	// ============================================================================
	// Isotope
	// More info: http://isotope.metafizzy.co
	// Note: "imagesloaded" blugin is required! https://imagesloaded.desandro.com/ 
	// ============================================================================

	// Initialize Isotope
	const $isotopeContainer = $(".isotope-items-wrap");
	const isoTransitionDuration = "0.5s";

	$isotopeContainer.imagesLoaded(function () {
		$isotopeContainer.isotope({
			itemSelector: ".isotope-item",
			layoutMode: "packery",
			transitionDuration: isoTransitionDuration,
			percentPosition: true
		});
	});

	// Filter function
	function applyFilter(filterSelector, resetScroll = false) {
		$isotopeContainer.isotope({ filter: filterSelector });

		// Refresh ScrollTrigger after the transition
		setTimeout(() => {
			if (resetScroll) {
				ScrollTrigger.refresh(true); // Reset scroll position
			} else {
				ScrollTrigger.refresh(); // Don't reset scroll position
			}
		}, parseFloat(isoTransitionDuration) * 1000);
	}

	// Event delegation for filter clicks
	$(document).on("click", ".ttgr-cat-classic-item a", function (e) {
		e.preventDefault();
		const filterSelector = $(this).attr("data-filter");
		applyFilter(filterSelector); // Default behavior (no scroll reset)
	});

	$(document).on("click", ".ttgr-cat-item a", function (e) {
		e.preventDefault();
		const filterSelector = $(this).attr("data-filter");
		applyFilter(filterSelector, true); // Reset scroll position
	});

	// Active class management
	$(document).on("click", ".ttgr-cat-list a, .ttgr-cat-classic-list a", function () {
		const $this = $(this);
		if (!$this.hasClass("active")) {
			$(".ttgr-cat-list a, .ttgr-cat-classic-list a").removeClass("active");
			$this.addClass("active");
		}
	});



	// ================================================================
	// Portfolio grid
	// ================================================================

	// If "pgi-cap-inside enabled
	// ===========================
	if ($("#portfolio-grid").hasClass("pgi-cap-inside")) {

		// Move "pgi-caption" to inside "pgi-image-wrap".
		$(".portfolio-grid-item").each(function () {
			$(this).find(".pgi-caption").appendTo($(this).find(".pgi-image-wrap"));
		});

		// Remove grid item title anchor tag if exist.
		if ($(".pgi-title a").length) {
			$(".pgi-title a").contents().unwrap();
		}
	}


	// Play video on hover
	// ====================
	$(".pgi-image-wrap").on("mouseenter touchstart", function () {
		$(this).find("video").each(function () {
			$(this).get(0).play();
		});
	}).on("mouseleave touchend", function () {
		$(this).find("video").each(function () {
			$(this).get(0).pause();
		});
	});


	// Portfolio grid categories filter
	// =================================

	// On category trigger click.
	$(".ttgr-cat-trigger").on("click", function () {
		$("body").addClass("ttgr-cat-nav-open");
		if ($("body").hasClass("ttgr-cat-nav-open")) {

			gsap.to(".portfolio-grid-item", { duration: 0.3, scale: 0.9 });
			gsap.to("#page-header, #creativesoul-header, .ttgr-cat-trigger", { duration: 0.3, autoAlpha: 0 });

			// Make "ttgr-cat-nav" unclickable.
			$(".ttgr-cat-nav").off("click");

			// Catecories step in animations.
			let tl_ttgrIn = gsap.timeline({
				// Wait until the timeline is completed then make "ttgr-cat-nav" clickable again.
				onComplete: function () {
					ttCatNavClose();

					// Disable page scroll if open
					if ($("body").hasClass("creativesoul-smooth-scroll") && !tt_isMobile) {
						lenis.stop();
					} else {
						$("html").addClass("creativesoul-no-scroll");
					}
				}
			});
			tl_ttgrIn.to(".ttgr-cat-nav", { duration: 0.3, autoAlpha: 1 });
			tl_ttgrIn.from(".ttgr-cat-close-btn", { duration: 0.3, y: 10, autoAlpha: 0, ease: Power2.easeIn });
			tl_ttgrIn.from(".ttgr-cat-list > li", { duration: 0.3, y: 40, autoAlpha: 0, stagger: 0.07, ease: Power2.easeOut, clearProps: "all" }, "-=0.2");

			// On catecory link hover
			$(".ttgr-cat-list").on("mouseenter", function () {
				$(this).parents(".ttgr-cat-nav").addClass("ttgr-cat-nav-hover");
			}).on("mouseleave", function () {
				$(this).parents(".ttgr-cat-nav").removeClass("ttgr-cat-nav-hover");
			});

		}
	});

	// On close click function
	function ttCatNavClose() {
		const $ttgrCatNavList = $(".ttgr-cat-list");

		// Close nav when clicking outside the ".ttgr-cat-list"
		$(".ttgr-cat-nav, .ttgr-cat-close-btn").on("click", function (e) {
			if ($("body").hasClass("ttgr-cat-nav-open") && !$ttgrCatNavList.is(e.target) && $ttgrCatNavList.has(e.target).length === 0) {

				$("body").removeClass("ttgr-cat-nav-open");

				// Catecories step out animations
				let tl_ttgrClose = gsap.timeline();
				tl_ttgrClose.to(".ttgr-cat-close-btn", { duration: 0.3, y: -10, autoAlpha: 0, ease: Power2.easeIn });
				tl_ttgrClose.to(".ttgr-cat-list > li", { duration: 0.3, y: -40, autoAlpha: 0, stagger: 0.07, ease: Power2.easeIn }, "-=0.3");
				tl_ttgrClose.to(".ttgr-cat-nav", { duration: 0.3, autoAlpha: 0, clearProps: "all" }, "+=0.2");
				tl_ttgrClose.to(".portfolio-grid-item", { duration: 0.3, scale: 1, clearProps: "all" }, "-=0.4");
				tl_ttgrClose.to("#page-header, #creativesoul-header, .ttgr-cat-trigger", { duration: 0.3, autoAlpha: 1, clearProps: "all" }, "-=0.4");
				tl_ttgrClose.to(".ttgr-cat-list > li, .ttgr-cat-close-btn", { clearProps: "all" }); // clearProps only

				// Enable page scroll if closed
				if ($("body").hasClass("creativesoul-smooth-scroll") && !tt_isMobile) {
					lenis.start();
				} else {
					$("html").removeClass("creativesoul-no-scroll");
				}

			}

			// Refresh ScrollTrigger
			ScrollTrigger.refresh();
		});
	}



	// ================================================================
	// Portfolio compact list
	// ================================================================

	// Play video on hover
	// ====================
	$(".pcli-item").on("mouseenter touchstart", function () {
		$(this).find("video").each(function () {
			$(this).get(0).play();
		});
	}).on("mouseleave touchend", function () {
		$(this).find("video").each(function () {
			$(this).get(0).pause();
		});
	});



	// ================================================================
	// Portfolio preview list
	// ================================================================

	if ($(".creativesoul-ppli-preview").length) {

		// Function to enable or disable the mouse follow feature based on screen width 
		function ttHandleMouseFollow() {
			if (window.innerWidth >= 768) {
				ttEnableMouseFollow();
			} else {
				ttDisableMouseFollow();
			}
		}

		// Function to enable mouse follow
		function ttEnableMouseFollow() {
			// Mouse follow
			let $ppliPreview = $(".creativesoul-ppli-preview");
			let $pplipDuration = 1;
			let $pplipEase = "power3.out";

			let $xTo = gsap.quickTo($ppliPreview, "x", { duration: $pplipDuration, ease: $pplipEase });
			let $yTo = gsap.quickTo($ppliPreview, "y", { duration: $pplipDuration, ease: $pplipEase });

			gsap.set($ppliPreview, { xPercent: -50, yPercent: -50 });

			$(window).on('mousemove.followMouse', function (e) {
				$xTo(e.clientX);
				$yTo(e.clientY);
			});
		}

		// Function to disable mouse follow
		function ttDisableMouseFollow() {
			$(window).off('mousemove.followMouse');
			let $ppliPreview = $(".creativesoul-ppli-preview");
			gsap.set($ppliPreview, { clearProps: "all" });
		}

		// Initial check on page load
		ttHandleMouseFollow();

		// Add event listener for window resize
		window.addEventListener("resize", function () {
			ttHandleMouseFollow();
		});


		// Play video on hover
		// ====================
		$(".creativesoul-ppl-item").on("mouseenter touchstart", function () {
			$(this).find("video").each(function () {
				$(this).get(0).play();
			});
		}).on("mouseleave touchend", function () {
			$(this).find("video").each(function () {
				$(this).get(0).pause();
			});
		});
	}


	// ================================================================
	// Portfolio sticky
	// ================================================================

	$(".creativesoul-sticky-portfolio").each(function () {
		let $ttStPortfItem = $(this).find(".creativesoul-stp-item");
		$ttStPortfItem.each(function (index) {
			let $this = $(this);

			// Add z-index to each item
			$this.css('z-index', index + 1);

			// Calculate item height and sticky offset
			if ($("#creativesoul-header").is(".creativesoul-header-fixed, .creativesoul-header-scroll")) {
				var $ttStPortfOffset = $(".creativesoul-header-inner").innerHeight() + 20;
				$('.creativesoul-stp-item').css('min-height', 'calc(100vh - ' + ($ttStPortfOffset * 1.4) + 'px)');
			} else {
				var $ttStPortfOffset = 40;
				$('.creativesoul-stp-item').css('min-height', 'calc(100vh - ' + ($ttStPortfOffset * 2) + 'px)');
			}

			// Sticky items (not last item)
			if (!$this.is(":last-child")) {
				let tl_ttStPortfItem = gsap.timeline({
					defaults: { ease: "none" },
					scrollTrigger: {
						trigger: $this,
						pin: true,
						start: "top " + $ttStPortfOffset,
						end: "bottom " + ($ttStPortfOffset - 30),
						pinSpacing: false,
						scrub: true,
						markers: false,
					}
				});

				// Scale items
				if (tt_isMobile) {
					tl_ttStPortfItem.to($this, { scale: 0.78 });
					tl_ttStPortfItem.to($this.find(".creativesoul-stp-item-image img, .creativesoul-stp-item-video video"), { scale: 1.15 }, 0);
					tl_ttStPortfItem.set($this, { autoAlpha: 0 });
				} else {
					tl_ttStPortfItem.to($this, { scale: 0.78 });
					tl_ttStPortfItem.to($this.find(".creativesoul-stp-item-image img, .creativesoul-stp-item-video video"), { scale: 1.15 }, 0);
					tl_ttStPortfItem.set($this, { autoAlpha: 0 });
				}
			}

		});
	});


	// Play video on hover
	// ====================
	$(".creativesoul-stp-item").on("mouseenter touchstart", function () {
		$(this).find("video").each(function () {
			$(this).get(0).play();
		});
	}).on("mouseleave touchend", function () {
		$(this).find("video").each(function () {
			$(this).get(0).pause();
		});
	});



	// =======================================================================================
	// Portfolio slider (full screen)
	// Source: https://swiperjs.com/
	// =======================================================================================

	var $ttPortfolioSlider = $(".creativesoul-portfolio-slider");

	if ($ttPortfolioSlider.length) {
		$("body").addClass("creativesoul-portfolio-slider-on");

		// Add class to the <body> if vertical direction is enabled
		if ($ttPortfolioSlider.is('.cursor-drag-mouse-down[data-direction="vertical"]')) {
			$("body").addClass("creativesoul-posl-verical-on");
		}

		// Data attributes
		// ================
		var $data_ttPoslMousewheel = $ttPortfolioSlider.data("mousewheel");
		var $data_ttPoslKeyboard = $ttPortfolioSlider.data("keyboard");
		var $data_ttPoslSimulateTouch = $ttPortfolioSlider.data("simulate-touch");
		var $data_ttPoslParallax = $ttPortfolioSlider.data("parallax");
		var $data_ttPoslLoop = $ttPortfolioSlider.data("loop");
		var $data_ttPoslAutoplay = $ttPortfolioSlider.data("autoplay") ? { delay: $ttPortfolioSlider.data("autoplay"), disableOnInteraction: true, } : $ttPortfolioSlider.data("autoplay");

		if ($ttPortfolioSlider.is("[data-speed]")) {
			var $data_ttPoslSpeed = $ttPortfolioSlider.data("speed");
		} else {
			var $data_ttPoslSpeed = 900; // by default
		}

		if ($ttPortfolioSlider.is("[data-direction]")) {
			var $data_ttPoslDirection = $ttPortfolioSlider.data("direction");
		} else {
			var $data_ttPoslDirection = "vertical"; // by default
		}

		// Init Swiper
		// ============
		var $ttPortfolioSliderSwiper = new Swiper($ttPortfolioSlider.find(".swiper")[0], {

			// Parameters
			direction: $data_ttPoslDirection,
			slidesPerView: "auto",
			centeredSlides: true,
			disableOnInteraction: true,
			grabCursor: true,
			resistanceRatio: 0,
			longSwipesRatio: 0.1,
			speed: $data_ttPoslSpeed,
			autoplay: $data_ttPoslAutoplay,
			loop: $data_ttPoslLoop,
			parallax: $data_ttPoslParallax,
			mousewheel: $data_ttPoslMousewheel,
			keyboard: $data_ttPoslKeyboard,
			simulateTouch: $data_ttPoslSimulateTouch,

			// Navigation (arrows)
			navigation: {
				nextEl: ".creativesoul-posl-nav-next",
				prevEl: ".creativesoul-posl-nav-prev",
				disabledClass: "creativesoul-posl-nav-arrow-disabled",
			},

			// Pagination
			pagination: {
				el: ".creativesoul-posl-pagination",
				type: "fraction",
				modifierClass: "creativesoul-posl-pagination-",
				verticalClass: "creativesoul-posl-pagination-vertical",
				dynamicBullets: false,
				dynamicMainBullets: 1,
				clickable: true,
				renderFraction: function (currentClass, totalClass) {
					return '<span class="' + currentClass + '"></span>' + '  ' + '<span class="' + totalClass + '"></span>';
				},
			},

			// Events
			// Swiper Events
			on: {
				init: function () {
					const $this = this;
					const $slideActive = $($this.slides[$this.activeIndex]);

					// Play video on page load if first slide contains video
					$slideActive.find("video").each(function () {
						const ttPoslVideo = $(this).get(0);
						ttPoslVideo.addEventListener("loadeddata", function () {
							ttPoslVideo.play();
						}, { once: true });
					});
				},

				transitionStart: function () {
					const $this = this;
					const $slideActive = $($this.slides[$this.activeIndex]);

					// Ensure video plays only after it's loaded
					$slideActive.find("video").each(function () {
						const ttPoslVideo = $(this).get(0);
						if (ttPoslVideo.readyState >= 3) { // Video is already loaded
							ttPoslVideo.play();
						} else {
							ttPoslVideo.addEventListener("loadeddata", function () {
								ttPoslVideo.play();
							}, { once: true });
						}
					});

					// If slider image is light
					setTimeout(function () {
						if ($slideActive.hasClass("creativesoul-posl-bg-is-light")) {
							$("body").addClass("creativesoul-posl-light-bg-on");
						} else {
							$("body").removeClass("creativesoul-posl-light-bg-on");
						}
					}, 200);
				},

				transitionEnd: function () {
					const $this = this;
					const $slideActive = $($this.slides[$this.activeIndex]);

					// Pause videos only in previous and next slides
					$slideActive.prevAll().find("video").each(function () {
						this.pause();
					});
					$slideActive.nextAll().find("video").each(function () {
						this.pause();
					});
				},
			}

		});
	}



	// =======================================================================================
	// Sticky horizontal scroll
	// =======================================================================================

	$(".creativesoul-sticky-horizontal-scroll").each(function () {
		const $this = $(this);
		const $ttShsPinWrap = $this.find(".creativesoul-shs-pin-wrap");
		const $ttShsAnimWrap = $ttShsPinWrap.find(".creativesoul-shs-animation-wrap");

		// Retrieve the scroll speed from the data attribute (default to 3000px if not set)
		const $ttShsScrollDuration = parseInt($this.data('speed'), 10) || 3000;

		// Retrieve the direction from the data attribute (default to "left" if not set)
		const $ttShsDirection = $this.data('direction') || 'left';

		// Calculate the total animation distance
		const ttShsAnimDistance = () => -($ttShsAnimWrap[0].scrollWidth - window.innerWidth);

		// Animate
		gsap.fromTo($ttShsAnimWrap[0], {
			x: () => $ttShsDirection === 'right' ? ttShsAnimDistance() : 0
		}, {
			x: () => $ttShsDirection === 'right' ? 0 : ttShsAnimDistance(),
			ease: "none",
			scrollTrigger: {
				trigger: $this[0],
				pin: $ttShsPinWrap[0],
				start: "50% 50%",
				end: `+=${$ttShsScrollDuration}`, // Use the value from the data attribute
				scrub: 1,
				invalidateOnRefresh: true, // Recalculate on resize
				markers: false,
				onToggle: self => {
					// Add class when pinned, remove when unpinned
					if (self.isActive) {
						$this.addClass("is-pinned");
					} else {
						$this.removeClass("is-pinned");
					}
				}
			}
		});
	});



	// =================================================================
	// creativesoul-Sticker 
	// Note: Must be located below the "Sticky horizontal scroll" code!
	// =================================================================

	let $ttStickerTriggers = [];

	function $ttStickerFunction() {
		if ($(window).outerWidth() > 991) {
			// Kill all previous triggers first
			$ttStickerTriggers.forEach(trigger => trigger.kill());
			$ttStickerTriggers = [];

			$(".creativesoul-sticky-element").each(function () {
				const $ttPinElement = $(this);
				const $ttPinSection = $ttPinElement.closest(".creativesoul-sticker");
				const $ttPinScroller = $ttPinSection.find(".creativesoul-sticker-scroller");

				let $ttPinElementOffset;
				if ($("#creativesoul-header").is(".creativesoul-header-fixed, .creativesoul-header-scroll")) {
					$ttPinElementOffset = $(".creativesoul-header-inner").innerHeight() + 30;
				} else {
					$ttPinElementOffset = 50;
				}

				// Create new ScrollTrigger and store each instance
				const trigger = ScrollTrigger.create({
					trigger: $ttPinElement,
					start: "top " + $ttPinElementOffset,
					end: "+=" + ($ttPinScroller.outerHeight() - $ttPinElement.outerHeight()),
					pin: $ttPinElement,
					markers: false,
				});

				$ttStickerTriggers.push(trigger);
			});

		} else {
			// Kill all triggers on small screens
			$ttStickerTriggers.forEach(trigger => trigger.kill());
			$ttStickerTriggers = [];
		}
	}

	// Run on page load
	$ttStickerFunction();

	// Run on window resize
	$(window).on("resize orientationchange", function () {
		setTimeout(function () {
			$ttStickerFunction();
		}, 300);
	});



	// =======================================================================================
	// Sticky testimonials 
	// =======================================================================================

	$(".creativesoul-sticky-testimonials").each(function () {
		let $ttStteItem = $(this).find(".creativesoul-stte-item");

		$ttStteItem.each(function (index) {
			let $this = $(this);

			// Set elements to equal heights (based on the tallest element).
			// ==============================
			function setEqualHeight(selector) {
				let maxHeight = 0;
				$(selector).css("height", "auto"); // Reset heights to auto before recalculating (useful for responsive designs).

				$(selector).each(function () {
					let elementHeight = $(this).height();
					if (elementHeight > maxHeight) {
						maxHeight = elementHeight;
					}
				});
				$(selector).height(maxHeight);
			}
			setEqualHeight(".creativesoul-stte-card");

			$(window).on("resize orientationchange", function () {
				setTimeout(function () {
					setEqualHeight(".creativesoul-stte-card");
				}, 100);
			});

			// Calculate item height and sticky offset.
			// ========================================
			if ($("#creativesoul-header").is(".creativesoul-header-fixed, .creativesoul-header-scroll")) {
				var ttStTestimOffset = $(".creativesoul-header-inner").innerHeight() + 30;
				$('.creativesoul-stp-item').css('min-height', 'calc(100vh - ' + (ttStTestimOffset * 1.4) + 'px)');
			} else {
				var ttStTestimOffset = 60;
				$('.creativesoul-stp-item').css('min-height', 'calc(100vh - ' + (ttStTestimOffset * 2) + 'px)');
			}

			// Sticky items (not last item).
			// =============
			if (!$this.is(":last-child")) {
				let ttStTestimItem = gsap.timeline({
					defaults: { ease: "none" },
					scrollTrigger: {
						trigger: $this,
						pin: true,
						start: "top " + ttStTestimOffset,
						end: "bottom " + (ttStTestimOffset - 30),
						pinSpacing: false,
						scrub: true,
						markers: false,
					}
				});

				// Scale items.
				ttStTestimItem.to($this, { scale: 0.77, opacity: 0.88 });
				ttStTestimItem.set($this, { autoAlpha: 0 });
			}

		});
	});



	// ================================================================
	// creativesoul-Gallery
	// ================================================================

	// Play video on hover
	$(".creativesoul-gallery-video-wrap").on("mouseenter touchstart", function () {
		$(this).find("video").each(function () {
			$(this).get(0).play();
		});
	}).on("mouseleave touchend", function () {
		$(this).find("video").each(function () {
			$(this).get(0).pause();
		});
	});



	// =======================================================================================
	// Content slider
	// Source: https://swiperjs.com/
	// =======================================================================================

	if ($(".creativesoul-content-slider").length) {
		$(".creativesoul-content-slider").each(function () {
			var $ttContentSlider = $(this);

			// Data attributes
			// ================
			var $data_ttCsAutoplay = $ttContentSlider.data("autoplay") ? { delay: $ttContentSlider.data("autoplay"), disableOnInteraction: true, } : $ttContentSlider.data("autoplay");
			var $data_ttCsLoop = $ttContentSlider.data("loop");

			if ($ttContentSlider.is("[data-speed]")) {
				var $data_ttCsSpeed = $ttContentSlider.data("speed");
			} else {
				var $data_ttCsSpeed = 800; // by default
			}

			if ($ttContentSlider.is("[data-pagination-type]")) {
				var $data_ttCsPaginationType = $ttContentSlider.data("pagination-type");
			} else {
				var $data_ttCsPaginationType = "bullets"; // by default (bullets/fraction/progressbar)
			}

			var $tt_simulateTouch = $(".creativesoul-cs-nav-prev").hasClass("cursor-arrow-left") || $(".creativesoul-cs-nav-next").hasClass("cursor-arrow-right") ? false : true;

			// Init Swiper
			// ============
			var $ttContentSliderSwiper = new Swiper($ttContentSlider.find(".swiper")[0], {

				// Parameters
				direction: "horizontal",
				slidesPerView: 1,
				grabCursor: true,
				parallax: true,
				speed: $data_ttCsSpeed,
				autoplay: $data_ttCsAutoplay,
				loop: $data_ttCsLoop,
				simulateTouch: $tt_simulateTouch,

				// Navigation (arrows)
				navigation: {
					nextEl: $ttContentSlider.find(".creativesoul-cs-nav-next")[0],
					prevEl: $ttContentSlider.find(".creativesoul-cs-nav-prev")[0],
					disabledClass: "creativesoul-cs-nav-arrow-disabled",
				},

				// Pagination
				pagination: {
					el: $ttContentSlider.find(".creativesoul-cs-pagination")[0],
					type: $data_ttCsPaginationType,
					modifierClass: "creativesoul-cs-pagination-",
					dynamicBullets: true,
					dynamicMainBullets: 1,
					clickable: true,
				},
			});

		});
	}



	// =======================================================================================
	// Content carousel
	// Source: https://swiperjs.com/
	// =======================================================================================

	if ($(".creativesoul-content-carousel").length) {
		$(".creativesoul-content-carousel").each(function () {
			var $ttContentCarousel = $(this);

			// Data attributes
			// ================
			var $data_ttCcSimulateTouch = $ttContentCarousel.data("simulate-touch");
			var $data_ttCcAutoplay = $ttContentCarousel.data("autoplay") ? { delay: $ttContentCarousel.data("autoplay"), disableOnInteraction: true, } : $ttContentCarousel.data("autoplay");
			var $data_ttCcLoop = $ttContentCarousel.data("loop");

			if ($ttContentCarousel.is("[data-speed]")) {
				var $data_ttCcSpeed = $ttContentCarousel.data("speed");
			} else {
				var $data_ttCcSpeed = 900; // by default
			}

			if ($ttContentCarousel.is("[data-pagination-type]")) {
				var $data_ttCcPaginationType = $ttContentCarousel.data("pagination-type");
			} else {
				var $data_ttCcPaginationType = "bullets"; // by default (bullets/fraction/progressbar)
			}

			if ($ttContentCarousel.attr("data-size-small") == "true") {
				var $data_ttCcCentered = false;
				var $data_ttCcSize = 3;
			} else {
				var $data_ttCcCentered = true;
				var $data_ttCcSize = 2;
			}

			// Init Swiper
			// ============
			var $ttContentCarouselSwiper = new Swiper($ttContentCarousel.find(".swiper")[0], {
				// Parameters
				direction: "horizontal",
				slidesPerView: 1,
				longSwipesRatio: 0.3,
				simulateTouch: $data_ttCcSimulateTouch,
				grabCursor: $data_ttCcSimulateTouch,
				speed: $data_ttCcSpeed,
				autoplay: $data_ttCcAutoplay,
				loop: $data_ttCcLoop,
				breakpoints: {
					991: {
						slidesPerView: $data_ttCcSize,
						centeredSlides: $data_ttCcCentered,
					}
				},

				// Navigation (arrows)
				navigation: {
					nextEl: $ttContentCarousel.find(".creativesoul-cc-nav-next")[0],
					prevEl: $ttContentCarousel.find(".creativesoul-cc-nav-prev")[0],
					disabledClass: "creativesoul-cc-nav-arrow-disabled",
				},

				// Pagination
				pagination: {
					el: $ttContentCarousel.find(".creativesoul-cc-pagination")[0],
					type: $data_ttCcPaginationType,
					modifierClass: "creativesoul-cc-pagination-",
					dynamicBullets: true,
					dynamicMainBullets: 1,
					clickable: true,
				},
			});


			// Scale down animation on carousel click
			// =======================================
			if ($ttContentCarousel.attr("data-simulate-touch") == "true") {
				if ($ttContentCarousel.hasClass("cc-scale-down")) {
					$ttContentCarousel.find(".swiper-wrapper").on("mousedown touchstart pointerdown", function (e) {
						if (e.which === 1) { // Affects the left mouse button only!
							gsap.to($ttContentCarousel.find(".creativesoul-content-carousel-item"), { duration: 0.7, scale: 0.9 });
						}
					});
					$("body").on("mouseup touchend pointerup mouseleave", function () {
						gsap.to($ttContentCarousel.find(".creativesoul-content-carousel-item"), { duration: 0.7, scale: 1, clearProps: "scale" });
					});
				}
			}


			// Check if the current item has the data-fancybox attribute
			// =======================================
			$(".creativesoul-content-carousel-item").each(function () {
				if ($(this).is("[data-fancybox]")) {
					// Check if the .creativesoul-lightbox-icon already exists
					if (!$(this).find(".creativesoul-lightbox-icon").length) {
						$(this).append('<div class="creativesoul-lightbox-icon"></div>');
					}
				}
			});

		});
	}



	// =======================================================================================
	// Next project
	// =======================================================================================

	// Play video on hover
	$(".creativesoul-npi-image").on("mouseenter touchstart", function () {
		$(this).find("video").each(function () {
			$(this).get(0).play();
		});
	}).on("mouseleave touchend", function () {
		$(this).find("video").each(function () {
			$(this).get(0).pause();
		});
	});



	// ================================================================
	// Fancybox (lightbox plugin)
	// https://fancyapps.com/
	// ================================================================

	$('[data-fancybox]').fancybox({
		animationEffect: "fade",
		loop: true,
		wheel: false,
		buttons: [
			"close"
		],
		onInit: function () {
			// Pause lenis
			if ($("body").hasClass("creativesoul-smooth-scroll")) {
				$("body").addClass("fancybox-is-open");
				if (!tt_isMobile) {
					lenis.stop();
				}
			}
		},
		afterClose: function () {
			// Start lenis
			if ($("body").hasClass("creativesoul-smooth-scroll")) {
				$("body").removeClass("fancybox-is-open");
				if (!tt_isMobile) {
					lenis.start();
				}
			}
		},
	});



	// ================================================================
	// Scrolling text
	// ================================================================

	$(".creativesoul-scrolling-text").each(function () {
		let $this = $(this);
		let $tt_scrtScrollerContent = $this.find(".creativesoul-scrt-content");

		// Clone content.
		// ===============
		let $tt_scrtClone = 5; // How many times to clone an item

		for (let i = 0; i < $tt_scrtClone; i++) {
			let $tt_scrtClonedItem = $tt_scrtScrollerContent.clone();
			$tt_scrtClonedItem.attr("aria-hidden", true);
			$tt_scrtClonedItem.insertAfter($tt_scrtScrollerContent);
		}

		// Scroll.
		// ========
		let $tt_scrtCurrentScroll = 0;
		let $tt_scrtIsScrollingDown = true;
		let $tt_scrtAtrSpeed = $this.data("scroll-speed");
		let $tt_scrtAtrOpDirection = $this.data("opposite-direction") == true;
		let $tt_scrtAtrChangeDirection = $this.data("change-direction") == true;

		if ($tt_scrtAtrSpeed) {
			var $tt_scrtSpeed = $tt_scrtAtrSpeed;
		} else {
			var $tt_scrtSpeed = 10; // Default value
		}

		if ($tt_scrtAtrOpDirection) {
			var $tt_scrtDirection = 100;
		} else {
			var $tt_scrtDirection = -100; // Default value
		}

		let $tt_scrtTween = gsap.to($this.find(".creativesoul-scrt-content"), { duration: $tt_scrtSpeed, xPercent: $tt_scrtDirection, repeat: -1, ease: "linear" }).totalProgress(0.5);

		gsap.set(".creativesoul-scrt-inner", { xPercent: -50 });

		if ($tt_scrtAtrChangeDirection) {
			window.addEventListener("scroll", function () {
				if (window.pageYOffset > $tt_scrtCurrentScroll) {
					$tt_scrtIsScrollingDown = true;
					$this.removeClass("scrolled-up");
				} else {
					$tt_scrtIsScrollingDown = false;
					$this.addClass("scrolled-up");
				}

				gsap.to($tt_scrtTween, { timeScale: $tt_scrtIsScrollingDown ? 1 : -1 });

				$tt_scrtCurrentScroll = window.pageYOffset;
			});
		} else {
			$tt_scrtCurrentScroll = window.pageYOffset;
		}

	});



	// ================================================================
	// Accordion
	// ================================================================

	$(".creativesoul-accordion").each(function () {
		let $ttAccordion = $(this);

		// If accordion content has class "is-open"
		$ttAccordion.find(".creativesoul-accordion-item").each(function () {
			let $ttAccItem = $(this);

			if ($ttAccItem.find(".creativesoul-accordion-content").hasClass("is-open")) {
				$ttAccItem.addClass("active");
			}
		});

		// Accordion item on click
		$ttAccordion.find(".creativesoul-accordion-heading").on("click", function () {
			let $ttAccHeading = $(this);
			let $ttAccItem = $ttAccHeading.parents(".creativesoul-accordion-item");
			let $ttAccContent = $ttAccHeading.next(".creativesoul-accordion-content");

			if ($ttAccItem.hasClass("active")) {
				$ttAccItem.removeClass("active");
				$ttAccContent.slideUp(350);
			} else {
				$ttAccordion.find(".creativesoul-accordion-item.active").removeClass("active")
					.find(".creativesoul-accordion-content").slideUp(350);
				$ttAccItem.addClass("active");
				$ttAccContent.slideDown(350);
			}
			return false;
		});
	});



	// ================================================================
	// Horizontal accordion
	// ================================================================

	$(".creativesoul-horizontal-accordion").each(function () {
		let $ttHorAccordion = $(this);
		let $ttHorAccItem = $ttHorAccordion.find('.creativesoul-hac-item');
		let $ttHorAccFirtItem = $ttHorAccItem.first();
		let $ttHorAccNotFirtItem = $ttHorAccItem.not(':first-child');
		let $ttHorAccItemCount = $ttHorAccItem.length;
		let $ttHorAccItemWidth = 100 / $ttHorAccItemCount + '%';

		// Set z-index in reverse order
		$ttHorAccItem.each(function (index) {
			$(this).css('z-index', $ttHorAccItemCount - index);
		});

		// Add mouseenter and mouseleave event listeners
		$ttHorAccNotFirtItem.on('mouseenter', function () {
			if (!$(this).hasClass('active')) {
				$ttHorAccItem.removeClass('active');
				$(this).addClass('active');
				$ttHorAccFirtItem.addClass('inactive');
			}
		}).on('mouseleave', function () {
			$ttHorAccItem.removeClass('active');
			$ttHorAccFirtItem.removeClass('inactive');
		});

		// Set width of each item
		$ttHorAccItem.css('width', $ttHorAccItemWidth);

		// Calculate title and description width
		function ttHorAccItemSize() {
			setTimeout(function () {
				let $ttHorAccItemContent = $(".creativesoul-haci-title, .creativesoul-haci-description");
				let $ttHorAccItemInner = $ttHorAccFirtItem.find(".creativesoul-hac-item-inner").width() * 0.84;
				$ttHorAccItemContent.width($ttHorAccItemInner);
			}, 500);
		}

		// Initial size calculation and on resize/orientation change
		ttHorAccItemSize();
		$(window).on("resize orientationchange", ttHorAccItemSize);
	});



	// ================================================================
	// creativesoul-Image
	// ================================================================

	$(".creativesoul-image").each(function () {
		const $this = $(this);
		const $ttImageLightboxIcon = $this.find(".creativesoul-image-link");

		// Check if the current element has the "data-fancybox" attribute
		if ($ttImageLightboxIcon.is("[data-fancybox]")) {
			$ttImageLightboxIcon.append('<div class="creativesoul-lightbox-icon"></div>');
		}
	});

	// Wrap the entire content of <figcaption>
	$("figcaption").each(function () {
		$(this).contents().wrapAll('<div class="figcaption-inner"></div>');
	});



	// ================================================================
	// Forms
	// ================================================================

	// Remove placeholder on focus
	$('input:not([type="checkbox"]):not([type="radio"]), textarea').focus(function () {
		$(this).data("placeholder", $(this).attr("placeholder")).attr("placeholder", "");
	}).blur(function () {
		$(this).attr("placeholder", $(this).data("placeholder"));
	});

	// If <form> has class "creativesoul-form-creative"
	if ($("form").hasClass("creativesoul-form-creative")) {
		// Add class "creativesoul-fg-typing" if typing 
		$('input:not([type="checkbox"]):not([type="radio"]), textarea, select').on('input', function () {
			$(this).parent().toggleClass("creativesoul-fg-typing", this.value.trim().length > 0);
		});
	}

	// Form "Browse File" button info
	$(document).on("change", ":file", function () {
		var input = $(this),
			numFiles = input.get(0).files ? input.get(0).files.length : 1,
			label = input.val().replace(/\\/g, "/").replace(/.*\//, "");
		input.trigger("fileselect", [numFiles, label]);
	});
	$(":file").on("fileselect", function (event, numFiles, label) {
		var input = $(this).parents(".creativesoul-form-file").find(".creativesoul-file-info"),
			log = numFiles > 1 ? numFiles + " files selected" : label;

		if (input.length) {
			input.val(log);
		} else {
			if (log) alert(log);
		}
	});



	// ================================================================
	// Contact form
	// ================================================================

	let $ttContactForm = $("#creativesoul-contact-form");

	$ttContactForm.submit(function (e) {
		e.preventDefault(); // Prevent default form submission.

		let $cfmContainer = $("#creativesoul-contact-form-messages");
		let $cfmContainerInner = $(".creativesoul-cfm-inner");

		// Clear previous messages and show loading indicator.
		$cfmContainerInner.empty().html('<span class="creativesoul-cfm-sending">Sending your message...</span>');

		// Send email
		const formData = $(this).serialize();
		$.ajax({
			type: "POST",
			url: "./c.php", // Path to your PHP script.
			data: formData,
			dataType: "json",
		}).done(function (response) {
			// Clear previous messages.
			$cfmContainerInner.empty();

			if (response.success) {
				$ttContactForm.addClass("cfm-submitted");

				// Display success message.
				$cfmContainerInner.html('<span class="creativesoul-cfm-success">' + response.message + '</span>');

				$ttContactForm.trigger("reset"); // Reset the form.
				$(".creativesoul-form-group").removeClass("creativesoul-fg-typing");
			} else {
				$ttContactForm.addClass("cfm-submitted");

				// Display error message.
				$cfmContainerInner.html('<span class="creativesoul-cfm-error">' + response.message + '</span>');
			}

			scrollToContactFormTop(); // Scroll to the form top.
		}).fail(function () {
			$ttContactForm.addClass("cfm-submitted");

			// Clear previous messages and display AJAX error message.
			$cfmContainerInner.empty().html('<span class="creativesoul-cfm-error">An error occurred. Please try again later.</span>');

			scrollToContactFormTop(); // Scroll to the form top.
		});

		// Scroll to the form top function.
		function scrollToContactFormTop() {
			if (!tt_isMobile) {
				if ($("body").hasClass("creativesoul-smooth-scroll")) {
					const cfmTopY = $ttContactForm.offset().top - $("body").offset().top - 240;
					lenis.scrollTo(cfmTopY, {
						duration: 1,
						easing: (x) => Math.min(x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)
					});
				} else {
					$("html, body").animate({ scrollTop: $ttContactForm.offset().top - 240 }, 600);
				}
			} else {
				$("html, body").animate({ scrollTop: $ttContactForm.offset().top - 240 }, 600);
			}
		}

		// Message close button click.
		$(document).on("click", ".creativesoul-cfm-close", function () {
			if ($cfmContainerInner.find("span").length) {
				$cfmContainerInner.find("span").remove();
				$ttContactForm.removeClass("cfm-submitted");
			}
		});
	});




	// ================================================================
	// Scroll between anchors 
	// ================================================================

	$('a[href^="#"]')
		.not('[href$="#"]') // omit from selection
		.not('[href$="#0"]') // omit from selection
		.on("click", function (e) {

			let $tt_sbaHeader = $("#creativesoul-header");
			let $tt_sbaTarget = this.hash;

			// If fixed header position enabled.
			if ($tt_sbaHeader.hasClass("creativesoul-header-fixed")) {
				var $tt_sbaOffset = $tt_sbaHeader.height();
			} else {
				var $tt_sbaOffset = 0;
			}

			// You can use data attribute (for example: data-offset="100") to set top offset in HTML markup if needed. 
			if ($(this).data("offset") != undefined) $tt_sbaOffset = $(this).data("offset");

			let $tt_sbaTopY = $($tt_sbaTarget).offset().top - $("body").offset().top - $tt_sbaOffset;
			if ($("body").hasClass("creativesoul-smooth-scroll")) {
				if (!tt_isMobile) {
					lenis.scrollTo($tt_sbaTopY, {
						duration: 1,
						easing: (x) => Math.min(x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)
					});
				} else {
					$("html,body").animate({ scrollTop: $tt_sbaTopY }, 800);
				}
			} else {
				$("html,body").animate({ scrollTop: $tt_sbaTopY }, 800);
			}

			// If scroll down circle 
			if ($(this).hasClass("creativesoul-scroll-down-inner")) {
				e.preventDefault();
			}

		});



	// ================================================================
	// Scroll to top 
	// ================================================================

	if ($(".creativesoul-scroll-to-top").length) {
		var $tt_ScrollToTop = $(".creativesoul-scroll-to-top");
		var $tt_SttOffset = 150;

		// Show/hide button
		$(window).on('scroll', function () {
			if ($(window).scrollTop() > $tt_SttOffset) {
				$tt_ScrollToTop.addClass("creativesoul-screativesoul-active");
			} else {
				$tt_ScrollToTop.removeClass("creativesoul-screativesoul-active");
			}
		});

		// Scroll to top on click
		$tt_ScrollToTop.on("click", function (e) {
			if ($("body").hasClass("creativesoul-smooth-scroll")) {
				if (!tt_isMobile) {
					lenis.scrollTo(0, {
						duration: 1,
						easing: (x) => Math.min(x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)
					});
				} else {
					$("html,body").animate({ scrollTop: 0 }, 800);
				}
			} else {
				$("html,body").animate({ scrollTop: 0 }, 800);
			}
			e.preventDefault();
		});

		// Scrolling progress bar
		var $tt_SttProgressPath = document.querySelector(".creativesoul-screativesoul-progress path");
		var $tt_SttPathLength = $tt_SttProgressPath.getTotalLength();

		$tt_SttProgressPath.style.transition = $tt_SttProgressPath.style.WebkitTransition = "none";
		$tt_SttProgressPath.style.strokeDasharray = $tt_SttPathLength + " " + $tt_SttPathLength;
		$tt_SttProgressPath.style.strokeDashoffset = $tt_SttPathLength;
		$tt_SttProgressPath.style.transition = $tt_SttProgressPath.style.WebkitTransition = "stroke-dashoffset 10ms linear";

		$(window).on("scroll", function () {
			var $tt_SttScroll = $(window).scrollTop();
			var $tt_SttHeight = $(document).height() - $(window).height();
			var $tt_SttProgress = $tt_SttPathLength - ($tt_SttScroll * $tt_SttPathLength / $tt_SttHeight);
			$tt_SttProgressPath.style.strokeDashoffset = $tt_SttProgress;
		});
	}



	// ================================================================
	// GSAP ScrollTrigger plugin (do something while scrolling)
	// More info: https://greensock.com/docs/v3/Plugins/ScrollTrigger/
	// ================================================================ 

	// Image parallax on scroll
	// =========================
	$(".creativesoul-image-parallax").each(function () {
		let $animImageParallax = $(this);

		// Add wrap <div>
		$animImageParallax.wrap('<div class="creativesoul-image-parallax-wrap"><div class="creativesoul-image-parallax-inner"></div></div>');

		let $aipWrap = $animImageParallax.parents(".creativesoul-image-parallax-wrap");
		let $aipInner = $aipWrap.find(".creativesoul-image-parallax-inner");

		// Set CSS styles
		$aipWrap.css({ "overflow": "hidden" });
		$aipInner.css({ "transform": "scale(1.2)", "transform-origin": "50% 100%", "will-change": "transform" });

		// Initialize animations
		function tt_animImageParallax() {
			// Scroll animation
			let tl_ImageParallax = gsap.timeline({
				scrollTrigger: {
					trigger: $aipWrap,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
					markers: false,
				},
			});
			tl_ImageParallax.to($aipInner, { yPercent: 25, ease: "none" });
		}

		// Wait for the image to load
		if ($animImageParallax[0].complete) {
			// If the image is already loaded (cached), initialize animations immediately
			tt_animImageParallax();
		} else {
			$animImageParallax.on("load", function () {
				tt_animImageParallax();
			});
		}
	});


	// Image zoom-in on scroll
	// ========================
	$(".creativesoul-anim-zoomin").each(function () {

		// Add wrap <div>.
		$(this).wrap('<div class="creativesoul-anim-zoomin-wrap"></div>');

		// Add overflow hidden.
		$(".creativesoul-anim-zoomin-wrap").css({ "overflow": "hidden" })

		var $this = $(this);
		var $asiWrap = $this.parents(".creativesoul-anim-zoomin-wrap");

		let tl_ZoomIn = gsap.timeline({
			scrollTrigger: {
				trigger: $asiWrap,
				start: "top bottom",
				markers: false,
			}
		});
		tl_ZoomIn.from($this, { duration: 1.5, autoAlpha: 0, scale: 1.3, ease: Power2.easeOut, clearProps: "all" });
	});


	// Element reveal on scroll (fade in-up)
	// ======================================
	$(".creativesoul-anim-fadeinup").each(function () {
		let $this = $(this);
		let tl_FadeInUp = gsap.timeline({
			scrollTrigger: {
				trigger: $this,
				start: "top bottom",
				markers: false,
			},
		});

		$this.css({ "will-change": "transform" });

		// Check if the body has the "creativesoul-transition" class and the element is in viewport
		let $fadeInUpDelay = $("body").hasClass("creativesoul-transition") && ScrollTrigger.isInViewport($this[0], 0.2) ? 1.2 : 0.3;
		tl_FadeInUp.from($this, { duration: 2, autoAlpha: 0, y: 50, ease: Expo.easeOut, clearProps: "all" }, `+=${$fadeInUpDelay}`);
	});


	// Text horizontal reveal on scroll
	// =================================
	$(".creativesoul-text-reveal").each(function () {
		$(this).wrapInner("<span/>");
	});

	// Convert the elements into an array for GSAP
	let ttTextRevealElements = gsap.utils.toArray(".creativesoul-text-reveal");

	// Apply GSAP animations
	ttTextRevealElements.forEach(function (ttTextReveal) {
		let ttTextRevealSpans = ttTextReveal.querySelectorAll("span");

		let tl_ttTextRevealAnim = gsap.timeline({
			scrollTrigger: {
				trigger: ttTextReveal,
				start: "top 87%",
				end: () => `+=${ttTextReveal.offsetHeight * 2}`,
				scrub: 1,
				markers: false,
			},
		});
		tl_ttTextRevealAnim.to(ttTextRevealSpans, { duration: 1, backgroundSize: "200% 100%", stagger: 0.5, ease: "none" });
	});


	// creativesoul-Clipper
	// ===========
	$(".creativesoul-clipper").each(function () {
		const $this = $(this);
		const $ttClipperInner = $this.find(".creativesoul-clipper-inner");
		const $isInWrap = $this.parents(".creativesoul-wrap").length > 0;
		const $clipPathValue = $isInWrap ? "inset(0% round var(--_creativesoul-clipper-radius))" : "inset(0% round 0px)";

		const tl_ttClipper = gsap.timeline({
			scrollTrigger: {
				trigger: $this,
				start: "top bottom",
				end: "bottom bottom",
				scrub: true,
				markers: false,
				onEnter: () => tt_clipperRefresh(),
			},
		});

		tl_ttClipper.to($ttClipperInner, { clipPath: $clipPathValue, ease: "none", });

		// Refresh on enter
		function tt_clipperRefresh() {
			tl_ttClipper.scrollTrigger.refresh();
		}
	});


	// Moving images on scroll
	// ========================
	function ttMovingImages() {
		$('.creativesoul-moving-images').each(function (index) {
			let $this = $(this);
			let w = $this.find('.creativesoul-mi-list');
			let x, xEnd;

			// Calculate the initial and end positions based on index parity
			if (index % 2) {
				x = $this.width() - w.get(0).scrollWidth;
				xEnd = 0;
			} else {
				x = 0;
				xEnd = $this.width() - w.get(0).scrollWidth;
			}

			// Create a GSAP timeline with scroll trigger
			let tl_miSt = gsap.timeline({
				scrollTrigger: {
					trigger: $this,
					start: "top bottom",
					scrub: 0.5,
					markers: false,
					onEnter: () => tt_miStRefresh(),
					onLeave: () => tt_miStRefresh(),
				},
			});

			// Animate the element from x to xEnd
			tl_miSt.fromTo(w, { x: x }, { x: xEnd });

			// Refresh on enter
			function tt_miStRefresh() {
				tl_miSt.scrollTrigger.refresh();
			}
		});
	}

	// Call function on first load
	ttMovingImages();

	// Call function on window resize or orientation change
	$(window).on('resize orientationchange', function () {
		ttMovingImages();
	});


	// creativesoul-Grid "layout-creative" parallax on scroll
	// =============================================
	ScrollTrigger.matchMedia({
		"(min-width: 768px)": function () {
			const $ttgrSelectors = [
				".creativesoul-grid.ttgr-layout-creative-1 .creativesoul-grid-item:nth-of-type(6n+2) .ttgr-item-inner",
				".creativesoul-grid.ttgr-layout-creative-1 .creativesoul-grid-item:nth-of-type(6n+4) .ttgr-item-inner",
				".creativesoul-grid.ttgr-layout-creative-2 .creativesoul-grid-item:nth-of-type(4n+2) .ttgr-item-inner",
				".creativesoul-grid.ttgr-layout-creative-2 .creativesoul-grid-item:not(:last-child):nth-of-type(4n+3) .ttgr-item-inner",
			];

			$($ttgrSelectors.join(", ")).each(function () {
				const $this = $(this);

				const tl_ttgrLayoutCreativeParalax = gsap.timeline({
					scrollTrigger: {
						trigger: $this,
						start: "top bottom",
						end: "bottom top",
						scrub: 1,
						markers: false,
					},
				});

				tl_ttgrLayoutCreativeParalax.to($this, { yPercent: -35 });
			});
		},
	});


	// creativesoul-Grid categories filter show/hide on scroll
	// ==============================================
	if ($(".creativesoul-grid-categories").length) {

		let $ttgCatTriggerWrap = $(".ttgr-cat-trigger-wrap");
		let $ttgCatTriggerHolder = $(".ttgr-cat-trigger-holder");

		if ($ttgCatTriggerWrap.hasClass("ttgr-cat-fixed")) {
			//$ttgCatTriggerWrap.appendTo("#body-inner");
			$("body").addClass("ttgr-cat-fixed-on");

			let tl_ttgrCatFilter = gsap.timeline({
				scrollTrigger: {
					trigger: "#portfolio-grid",
					start: "top bottom",
					end: "bottom 75%",
					markers: false,
					onEnter: () => ttgCatShow(),
					onLeave: () => ttgCatHide(),
					onEnterBack: () => ttgCatShow(),
					onLeaveBack: () => ttgCatHide(),
				},
			});

			function ttgCatShow() {
				tl_ttgrCatFilter.to($ttgCatTriggerHolder, { duration: 0.4, autoAlpha: 1, scale: 1, ease: Power2.easeOut });
			}
			function ttgCatHide() {
				tl_ttgrCatFilter.to($ttgCatTriggerHolder, { duration: 0.4, autoAlpha: 0, scale: 0.9, ease: Power2.easeOut });
			}
		}
	}



	// =======================================================================================
	// Defer videos
	// Note: Videos causes your page to load slower. Deffering will allow your page to load more quickly.
	// =======================================================================================

	// HTML video lazy loading 
	$(function () {
		if ($("video source").attr("data-src")) {
			var lazyVideos = $("video").toArray();

			if ("IntersectionObserver" in window) {
				var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							$(entry.target).find("source").each(function () {
								$(this).attr("src", $(this).data("src")).removeAttr("data-src");
							});

							entry.target.load();
							lazyVideoObserver.unobserve(entry.target);
						}
					});
				});

				lazyVideos.forEach(function (video) {
					lazyVideoObserver.observe(video);
				});
			}
		}
	});



	// =======================================================================================
	// Magic cursor (no effect on small screens!)
	// https://codepen.io/Sahil89/pen/MQbdNR
	// https://greensock.com/forums/topic/17490-follow-button-effect/?tab=comments#comment-81107
	// =======================================================================================

	if ($("body").not(".is-mobile").hasClass("creativesoul-magic-cursor")) {
		if ($(window).width() > 1024) {
			$(".creativesoul-magnetic-item").wrap('<div class="magnetic-wrap"></div>');

			let $ballMouse = { x: 0, y: 0 }; // Cursor position
			let $ballPos = { x: 0, y: 0 }; // Cursor position
			let $ballRatio = 0.15; // delay follow cursor
			let $ballActive = false;
			let $ball = $("#ball");

			let $ballWidth = 36; // Ball default width
			let $ballHeight = 36; // Ball default height
			let $ballOpacity = 1; // Ball default opacity
			let $ballBorderWidth = 2; // Ball default border width

			let $ballMagneticWidth = 70; // Ball magnetic width
			let $ballMagneticHeight = 70; // Ball magnetic height

			let $ballAlterWidth = 100; // Cursor alter width
			let $ballAlterHeight = 100; // Cursor alter height

			let $ballViewWidth = 130; // Ball view width
			let $ballViewHeight = 130; // Ball view height

			let $ballDragWidth = 100; // Ball drag width
			let $ballDragHeight = 100; // Ball drag height

			let $ballDragMouseDownWidth = 50; // Ball drag width
			let $ballDragMouseDownHeight = 50; // Ball drag height

			let $ballArrowWidth = 100; // Ball arrow width
			let $ballArrowHeight = 100; // Ball arrow height

			let $ballCloseWidth = 100; // Ball close width
			let $ballCloseHeight = 100; // Ball close height

			gsap.set($ball, {  // scale from middle and style ball
				xPercent: -50,
				yPercent: -50,
				width: $ballWidth,
				height: $ballHeight,
				borderWidth: $ballBorderWidth,
				opacity: $ballOpacity,
			});

			document.addEventListener("mousemove", mouseMove);

			function mouseMove(e) {
				$ballMouse.x = e.clientX;
				$ballMouse.y = e.clientY;
			}

			gsap.ticker.add(updatePosition);

			function updatePosition() {
				if (!$ballActive) {
					$ballPos.x += ($ballMouse.x - $ballPos.x) * $ballRatio;
					$ballPos.y += ($ballMouse.y - $ballPos.y) * $ballRatio;

					gsap.set($ball, { x: $ballPos.x, y: $ballPos.y });
				}
			}

			$(".magnetic-wrap").mousemove(function (e) {
				parallaxCursor(e, this, 2); // magnetic ball = low number is more attractive
				callParallax(e, this);
			});

			function callParallax(e, parent) {
				parallaxIt(e, parent, parent.querySelector(".creativesoul-magnetic-item"), 25); // magnetic area = higher number is more attractive
			}

			function parallaxIt(e, parent, target, movement) {
				let boundingRect = parent.getBoundingClientRect();
				let relX = e.clientX - boundingRect.left;
				let relY = e.clientY - boundingRect.top;

				gsap.to(target, {
					duration: 0.3,
					x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
					y: ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
					ease: Power2.easeOut
				});
			}

			function parallaxCursor(e, parent, movement) {
				let rect = parent.getBoundingClientRect();
				let relX = e.clientX - rect.left;
				let relY = e.clientY - rect.top;

				$ballPos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
				$ballPos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
				gsap.to($ball, { duration: 0.3, x: $ballPos.x, y: $ballPos.y });
			}


			// Magic cursor behavior
			// ======================

			// Magnetic item hover.
			$(".magnetic-wrap").on("mouseenter", function (e) {
				$ball.addClass("magnetic-active");
				gsap.to($ball, { duration: 0.3, width: $ballMagneticWidth, height: $ballMagneticHeight, opacity: 1 });
				$ballActive = true;
			}).on("mouseleave", function (e) {
				$ball.removeClass("magnetic-active");
				gsap.to($ball, { duration: 0.3, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
				gsap.to(this.querySelector(".creativesoul-magnetic-item"), { duration: 0.3, x: 0, y: 0, clearProps: "all" });
				$ballActive = false;
			});

			// Alternative cursor style on hover.
			$(".cursor-alter, .creativesoul-main-menu-list > li > a, .creativesoul-main-menu-list > li > .creativesoul-submenu-trigger > a")
				.not(".creativesoul-magnetic-item") // omit from selection.
				.on("mouseover", function () {
					gsap.to($ball, {
						duration: 0.3,
						borderWidth: 0,
						opacity: 0.2,
						backgroundColor: "#999",
						width: $ballAlterWidth,
						height: $ballAlterHeight,
					});
				}).on("mouseleave", function () {
					gsap.to($ball, {
						duration: 0.3,
						borderWidth: $ballBorderWidth,
						opacity: $ballOpacity,
						backgroundColor: "transparent",
						width: $ballWidth,
						height: $ballHeight,
						clearProps: "backgroundColor"
					});
				});

			// Cursor view on hover (data attribute data-cursor="...").
			$("[data-cursor]").each(function () {
				$(this).on("mouseenter", function () {
					$ball.addClass("ball-view").append('<div class="ball-view-inner"></div>');
					$(".ball-view-inner").append($(this).attr("data-cursor"));
					gsap.to($ball, { duration: 0.3, yPercent: -70, width: $ballViewWidth, height: $ballViewHeight, opacity: 1, borderWidth: 0 });
					gsap.to(".ball-view-inner", { duration: 0.3, scale: 1, autoAlpha: 1 });
				}).on("mouseleave", function () {
					gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity, borderWidth: $ballBorderWidth });
					$ball.removeClass("ball-view").find(".ball-view-inner").remove();
				});
				$(this).addClass("not-hide-cursor");
			});

			// Cursor drag on hover (class "cursor-drag"). For Swiper.
			$(".swiper").each(function () {
				if ($(this).parent().attr("data-simulate-touch") == "true") {
					if ($(this).parent().hasClass("cursor-drag")) {
						$(this).find(".swiper-wrapper").on("mouseenter", function () {
							$ball.addClass("ball-drag").append('<div class="ball-drag-inner"></div>');
							gsap.to($ball, { duration: 0.3, yPercent: -75, width: $ballDragWidth, height: $ballDragHeight, opacity: 1 });
						}).on("mouseleave", function () {
							$ball.removeClass("ball-drag").find(".ball-drag-inner").remove();
							gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
						});
						$(this).addClass("not-hide-cursor");
					}
				}
			});

			// Cursor drag on mouse down / click and hold effect (class "cursor-drag-mouse-down"). For Swiper.
			$(".swiper").each(function () {
				if ($(this).parent().attr("data-simulate-touch") == "true") {
					if ($(this).parent().hasClass("cursor-drag-mouse-down")) {
						$(this).on("mousedown pointerdown", function (e) {
							if (e.which === 1) { // Affects the left mouse button only!
								gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballDragMouseDownWidth, height: $ballDragMouseDownHeight, opacity: 1 });
								$ball.addClass("ball-drag-mouse-down").append('<div class="ball-drag-mouse-down-inner"></div>');
							}
						}).on("mouseup pointerup", function () {
							$ball.removeClass("ball-drag-mouse-down").find(".ball-drag-mouse-down-inner").remove();
							if ($(this).find("[data-cursor]:hover").length) {
							} else {
								gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
							}
						}).on("mouseleave", function () {
							$ball.removeClass("ball-drag-mouse-down").find(".ball-drag-mouse-down-inner").remove();
							gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
						});

						// Ignore "data-cursor" on mousedown.
						$(this).find("[data-cursor]").on("mousedown pointerdown", function () {
							return false;
						});

						// Ignore "data-cursor" on hover.
						$(this).find("[data-cursor]").on("mouseover", function () {
							$ball.removeClass("ball-drag-mouse-down").find(".ball-drag-mouse-down-inner").remove();
							return false;
						});
					}
				}
			});

			// Cursor arrow left on hover (class "cursor-arrow-left"). For Swiper.
			$(".cursor-arrow-left").on("mouseenter", function () {
				$ball.addClass("ball-arrow").append('<div class="ball-arrow-left"></div>');
				gsap.to($ball, { duration: 0.3, yPercent: -70, width: $ballArrowWidth, height: $ballArrowHeight, opacity: 1 });
			}).on("mouseleave", function () {
				$ball.removeClass("ball-arrow").find(".ball-arrow-left").remove();
				gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
			});

			// Cursor arrow right on hover (class "cursor-arrow-right"). For Swiper.
			$(".cursor-arrow-right").on("mouseenter", function () {
				$ball.addClass("ball-arrow").append('<div class="ball-arrow-right"></div>');
				gsap.to($ball, { duration: 0.3, yPercent: -70, width: $ballArrowWidth, height: $ballArrowHeight, opacity: 1 });
			}).on("mouseleave", function () {
				$ball.removeClass("ball-arrow").find(".ball-arrow-right").remove();
				gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
			});

			// Cursor close ".cursor-close".
			function ttShowCursorClose() {
				$ball.addClass("ball-close");
				$ball.append('<div class="ball-close-inner">Close</div>');
				gsap.to($ball, { duration: 0.3, yPercent: -75, width: $ballCloseWidth, height: $ballCloseHeight, opacity: 1 });
				gsap.from(".ball-close-inner", { duration: 0.3, scale: 0, autoAlpha: 0 });
			}

			function ttHideCursorClose() {
				$ball.removeClass("ball-close");
				gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
				$ball.find(".ball-close-inner").remove();
			}

			$(".cursor-close").each(function () {
				let $this = $(this);

				$this.on("mouseenter", function () {
					ttShowCursorClose();
				}).on("mouseleave", function () {
					ttHideCursorClose();
				});

				$this.on("mouseenter", ".hide-cursor", function () {
					ttHideCursorClose();
				}).on("mouseleave", ".hide-cursor", function () {
					ttShowCursorClose();
				});

				$this.on("click", function (e) {
					let $ttPreventCursorClose = $this.find(".hide-cursor");
					if (!$ttPreventCursorClose.is(e.target) && $ttPreventCursorClose.has(e.target).length === 0) {
						ttHideCursorClose();
					}
				});
			});

			// Magnetic buttons
			if ($(".creativesoul-btn").hasClass("creativesoul-magnetic-item")) {
				$(".creativesoul-btn").parents(".magnetic-wrap").addClass("creativesoul-magnetic-btn");
			}

			$("a, button, .creativesoul-magnetic-btn, .creativesoul-form-control, .creativesoul-form-radio, .creativesoul-form-check, .creativesoul-hide-cursor, .creativesoul-video, iframe, body.ph-mask-on .ph-caption, .creativesoul-cfm-close") // class "hide-cursor" is for global use.
				.not(".not-hide-cursor") 
				.not(".cursor-alter") // omit from selection
				.not("#page-header:not(.ph-full) .creativesoul-scroll-down-inner") // omit from selection
				.not(".ph-social > ul > li a") // omit from selection
				.not(".ph-share-buttons > ul > li a") // omit from selection
				.not(".creativesoul-social-buttons > ul > li a") // omit from selection
				.not(".creativesoul-main-menu-list > li > a") // omit from selection
				.not(".creativesoul-main-menu-list > li > .creativesoul-submenu-trigger > a") // omit from selection
				.on("mouseenter", function () {
					gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
				}).on("mouseleave", function () {
					gsap.to($ball, { duration: 0.3, scale: 1, opacity: $ballOpacity });
				});

			// Hide on click.
			$("a")
				.not('[target="_blank"]') // omit from selection.
				.not('[href^="#"]') // omit from selection.
				.not('[href^="mailto"]') // omit from selection.
				.not('[href^="tel"]') // omit from selection.
				.not(".creativesoul-btn-disabled") // omit from selection.
				.not('[data-fancybox]') // omit from selection
				.on('click', function () {
					gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
				});

			// Show/hide on document leave/enter.
			$(document).on("mouseleave", function () {
				gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
			}).on("mouseenter", function () {
				gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
			});

			// Show as the mouse moves.
			$(document).mousemove(function () {
				gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
			});
		}
	}



	
	$(".creativesoul-section-background").each(function () {
		const $this = $(this);
		const $thisParent = $this.parents(".creativesoul-section");

		$thisParent.addClass("creativesoul-sbg-on");

		if ($this.hasClass("creativesoul-sbg-is-light")) {
			$thisParent.addClass("creativesoul-sbg-is-light-on");
		}
	});



	$(".creativesoul-btn").each(function () {
		$(this).contents().wrapAll('<span class="creativesoul-btn-inner"></span>');
	});

	$(".creativesoul-btn-disabled").on("click", function () {
		return false;
	});


	$(window).on("pagehide", function () {
		$(window).scrollTop(0);
	});


	$(".creativesoul-copyright-year").html(new Date().getFullYear());


	$("*").on("touchstart", function () {
		$(this).trigger("hover");
	}).on("touchend", function () {
		$(this).trigger("hover");
	});


})(jQuery); 
