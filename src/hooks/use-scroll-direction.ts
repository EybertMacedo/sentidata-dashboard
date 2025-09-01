import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const currentScrollY = target.scrollTop || window.scrollY;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (currentScrollY > prevScrollY && currentScrollY > 20) {
        setScrollDirection('down');
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY) {
        setScrollDirection('up');
        setIsVisible(true);
      }
      
      setPrevScrollY(currentScrollY);
      
      // Auto-show header after 1.5 seconds of no scrolling
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    // Also listen for scroll events on the dashboard container
    const dashboardContainer = document.querySelector('[data-dashboard-container]');
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (dashboardContainer) {
      dashboardContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (dashboardContainer) {
        dashboardContainer.removeEventListener('scroll', handleScroll);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [prevScrollY]);

  return { scrollDirection, isVisible };
}
