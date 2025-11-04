import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login since Zitadel handles both login and registration
    navigate('/login');
  }, [navigate]);

  return null;
}
