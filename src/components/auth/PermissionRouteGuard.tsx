import React from "react";

interface Props {
  children: React.ReactNode;
  permission?: boolean;
}

const PermissionRouteGuard: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default PermissionRouteGuard;