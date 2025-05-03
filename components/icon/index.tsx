"use client";

import * as Ai from "react-icons/ai"; // Ant Design icons
import * as Bi from "react-icons/bi"; // Boxicons
import * as Bs from "react-icons/bs"; // Bootstrap icons
import * as Md from "react-icons/md"; // Material Design icons
import * as Pi from "react-icons/pi"; // Phosphor Icons
import * as Ri from "react-icons/ri"; // Remix icons
import * as Go from "react-icons/go"; // Github Octicons icons
import * as Hi from "react-icons/hi"; // Heroicons
import * as Lu from "react-icons/lu"; // Lucide Icons

import { ReactNode } from "react";

// Map of prefixes to icon packages
const iconPackages: { [key: string]: any } = {
  Ai,
  Bs,
  Bi,
  Go,
  Hi,
  Lu,
  Md,
  Pi,
  Ri,
};

export default function Icon({
  name,
  className,
  onClick,
}: {
  name: string;
  className?: string;
  onClick?: () => void;
}) {
  function getIcon(name: string): ReactNode {
    // Extract prefix (first two characters)
    const prefix = name.slice(0, 2);

    // Get the corresponding icon package
    const iconPackage = iconPackages[prefix];
    if (iconPackage) {
      const iconName = name as keyof typeof iconPackage;
      return iconPackage[iconName] || null;
    }

    return null;
  }

  const IconComponent = getIcon(name) as React.ElementType;

  // Return null if no icon is found
  if (!IconComponent) return null;

  // Render the icon component instead of returning it directly
  return (
    <IconComponent
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    />
  );
}
