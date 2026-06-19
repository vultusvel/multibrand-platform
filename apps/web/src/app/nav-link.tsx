'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';

type NavLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    transitionTypes?: string[];
  };

export function NavLink({ transitionTypes, onClick, ...props }: NavLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (transitionTypes?.length) {
      document.documentElement.dataset.vt = transitionTypes[0];
      setTimeout(() => delete document.documentElement.dataset.vt, 600);
    }
    onClick?.(e);
  };

  return <Link onClick={handleClick} {...props} />;
}
