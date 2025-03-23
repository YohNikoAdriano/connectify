"use client";

import { headerLinks } from "@/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-5 w-full items-start md:flex-between md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route} onClick={onLinkClick}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
