import { type AuthUser } from 'wasp/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = ({ user }: { user: AuthUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard/delegate', { replace: true });
  }, [navigate]);

  return null;
};

export default DashboardRedirect; 