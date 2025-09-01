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
      
      // Only show header when at the very top of the page
      if (currentScrollY <= 10) {
        setIsVisible(true);
        setScrollDirection(null);
      } else {
        // Hide header when scrolled down from the top
        setIsVisible(false);
        setScrollDirection('down');
      }
      
      setPrevScrollY(currentScrollY);
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
