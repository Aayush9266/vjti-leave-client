import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';

function SuggestionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return <div>SuggestionPage</div>;
}

export default SuggestionPage;
