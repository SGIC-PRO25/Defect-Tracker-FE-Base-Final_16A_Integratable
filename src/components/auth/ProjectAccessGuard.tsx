import React from "react";

interface Props {
  children: React.ReactNode;
}

const ProjectAccessGuard: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default ProjectAccessGuard;