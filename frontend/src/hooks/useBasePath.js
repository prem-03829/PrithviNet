import { useLocation } from 'react-router-dom';

export function useBasePath() {
  const location = useLocation();
  
  if (location.pathname.startsWith('/admin')) return '/admin';
  if (location.pathname.startsWith('/official')) return '/official';
  if (location.pathname.startsWith('/authority')) return '/authority';
  if (location.pathname.startsWith('/inspector')) return '/inspector';
  if (location.pathname.startsWith('/citizen')) return '/citizen';
  
  return '/admin'; // fallback
}
