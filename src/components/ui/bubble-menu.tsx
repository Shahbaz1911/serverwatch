'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  profileAction?: ReactNode;
};

const DEFAULT_ITEMS: MenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = 'hsl(var(--card))',
  menuContentColor = 'hsl(var(--foreground))',
  useFixedPosition = true,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.08,
  profileAction,
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    'left-0 right-0 top-4 md:top-6',
    'flex items-start justify-center',
    'pointer-events-none',
    'z-[100]',
    className
  ]
    .filter(Boolean)
    .join(' ');
    
  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) {
        document.body.style.overflow = 'hidden';
        setShowOverlay(true);
    } else {
        document.body.style.overflow = '';
    }
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };
  
  // Close menu on route change
  useEffect(() => {
    if(isMenuOpen) {
        handleToggle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay, { opacity: 1, duration: 0.3 });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            '-=' + animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels, overlay]);
      gsap.to(overlay, { opacity: 0, duration: 0.4, delay: 0.2 });
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        stagger: -0.05,
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .bubble-menu-items .pill-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
        }
        .bubble-menu-items .pill-link:hover {
          transform: scale(1.06);
          background: var(--hover-bg) !important;
          color: var(--hover-color) !important;
        }
        .bubble-menu-items .pill-link:active {
          transform: scale(.94);
        }
      `}</style>

      <div className={containerClassName} style={style}>
        <div className="w-full max-w-md md:max-w-6xl mx-auto flex items-center justify-between px-4 md:px-0">
            <div
            className={[
                'bubble logo-bubble',
                'inline-flex items-center justify-center',
                'rounded-full',
                'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
                'pointer-events-auto',
                'h-12 md:h-14',
                'px-4',
                'gap-2',
                'will-change-transform'
            ].join(' ')}
            aria-label="Logo"
            style={{
                background: menuBg,
                borderRadius: '9999px'
            }}
            >
            <span
                className={['logo-content', 'inline-flex items-center justify-center', 'h-full'].join(' ')}
            >
                {logo}
            </span>
            </div>
            
            <div className="flex items-center gap-2 pointer-events-auto">
                {profileAction}
                <button
                    type="button"
                    className={[
                        'bubble toggle-bubble menu-btn',
                        isMenuOpen ? 'open' : '',
                        'inline-flex flex-col items-center justify-center',
                        'rounded-full',
                        'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
                        'w-12 h-12 md:w-14 md:h-14',
                        'border-0 cursor-pointer p-0',
                        'will-change-transform'
                    ].join(' ')}
                    onClick={handleToggle}
                    aria-label={menuAriaLabel}
                    aria-pressed={isMenuOpen}
                    style={{ background: menuBg }}
                >
                    <span
                    className="menu-line block mx-auto rounded-[2px]"
                    style={{
                        width: 26,
                        height: 2,
                        background: menuContentColor,
                        transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : 'none'
                    }}
                    />
                    <span
                    className="menu-line short block mx-auto rounded-[2px]"
                    style={{
                        marginTop: '6px',
                        width: 26,
                        height: 2,
                        background: menuContentColor,
                        transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none'
                    }}
                    />
                </button>
            </div>
        </div>
      </div>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            'bubble-menu-items',
            useFixedPosition ? 'fixed' : 'absolute',
            'inset-0',
            'flex items-center justify-center',
            'pointer-events-auto',
            'z-[99]',
            'bg-background/80 backdrop-blur-sm',
            'opacity-0 p-4 pt-24 md:pt-28'
          ].join(' ')}
          aria-hidden={!isMenuOpen}
        >
          <ul
            className={[
              'pill-list',
              'list-none m-0',
              'w-full max-w-6xl mx-auto',
              'pointer-events-auto overflow-y-auto h-full'
            ].join(' ')}
            role="menu"
            aria-label="Menu links"
          >
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                role="none"
                className='pill-col h-full'
              >
                <a
                  role="menuitem"
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={item.ariaLabel || item.label}
                  className={[
                    'pill-link',
                    'w-full h-full',
                    'rounded-2xl',
                    'no-underline',
                    'shadow-[0_4px_14px_rgba(0,0,0,0.10)]',
                    'flex items-center justify-center',
                    'relative',
                    'transition-[transform,background,color] duration-300 ease-in-out',
                    'box-border',
                    'whitespace-nowrap overflow-hidden'
                  ].join(' ')}
                  style={
                    {
                      ['--item-rot']: `${item.rotation ?? 0}deg`,
                      ['--pill-bg']: menuBg,
                      ['--pill-color']: menuContentColor,
                      ['--hover-bg']: item.hoverStyles?.bgColor || 'hsl(var(--primary))',
                      ['--hover-color']: item.hoverStyles?.textColor || 'hsl(var(--primary-foreground))',
                      background: 'var(--pill-bg)',
                      color: 'var(--pill-color)',
                      padding: 'clamp(1.5rem, 3vw, 8rem) 0',
                      fontSize: 'clamp(1.2rem, 2vw, 2rem)',
                      fontWeight: 500,
                      lineHeight: 1,
                      willChange: 'transform',
                    } as CSSProperties
                  }
                  ref={el => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label inline-block"
                    style={{
                      willChange: 'transform, opacity',
                      lineHeight: 1.2,
                    }}
                    ref={el => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
