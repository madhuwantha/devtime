import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthProps {
  onAuthSuccess: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleAuthSuccess = (token: string) => {
    onAuthSuccess(token);
  };

  return (
    <div>
      {isLogin ? (
        <Login
          onLoginSuccess={handleAuthSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      ) : (
        <Register
          onRegisterSuccess={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
};

export default Auth;
