import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BoxIcon } from '../ui/icons';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-white shadow-level1">
          <BoxIcon className="h-6 w-6 animate-pulse text-ink" />
        </div>
        <p className="text-sm font-medium text-muted">
          Loading...
        </p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/account/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
