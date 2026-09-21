"use client";

import type { ReactNode } from "react";
import { isReservationHref, openReservation } from "@/lib/booking";

interface ReserveLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

/** A plain link that opens the reservation drawer when it points at the booking flow. */
export default function ReserveLink({ href, className, children, ...rest }: ReserveLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        if (!isReservationHref(href) || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        openReservation();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
