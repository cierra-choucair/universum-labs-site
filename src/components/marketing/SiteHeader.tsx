"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { UniversumLogo } from "@/components/marketing/Logo";
import { LOGIN_URL, NAV_ITEMS } from "@/lib/site";

/**
 * Fixed site header. Transparent over the hero, gaining a Void Black
 * veil once the page scrolls. The mobile menu is a full-screen
 * dialog-style overlay with focus kept on real links — no dead ends.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    // Async initial sync, for loads restored mid-page.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu on Escape; lock body scroll while open.
  // (Every menu link also closes it on click.)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const loginIsExternal = LOGIN_URL.startsWith("http");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-lavender-15 bg-void/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-10">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Universum Labs — home"
          onClick={() => setOpen(false)}
        >
          <UniversumLogo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-linen-70 transition-colors hover:text-linen"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {loginIsExternal ? (
            <a
              href={LOGIN_URL}
              className="text-sm text-linen-70 transition-colors hover:text-linen"
            >
              Log In
            </a>
          ) : (
            <Link
              href={LOGIN_URL}
              className="text-sm text-linen-70 transition-colors hover:text-linen"
            >
              Log In
            </Link>
          )}
          <Link
            href="/early-access"
            className="rounded-full bg-[linear-gradient(100deg,#6B21E8,#3B0FCC)] px-5 py-2 text-sm font-medium text-linen transition hover:brightness-110"
          >
            Join Early Access
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-lavender-15 text-linen lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-200 ${open ? "top-1/2 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-200 ${open ? "bottom-1/2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="border-t border-lavender-15 bg-void/95 backdrop-blur-md lg:hidden"
      >
        <nav aria-label="Primary mobile" className="flex flex-col px-6 py-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-lavender-15/60 py-4 font-display text-2xl text-linen transition-colors hover:text-lavender"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={LOGIN_URL}
            onClick={() => setOpen(false)}
            className="border-b border-lavender-15/60 py-4 font-display text-2xl text-linen transition-colors hover:text-lavender"
          >
            Log In
          </a>
          <Link
            href="/early-access"
            onClick={() => setOpen(false)}
            className="mt-6 rounded-full bg-[linear-gradient(100deg,#6B21E8,#3B0FCC)] px-6 py-3.5 text-center text-base font-medium text-linen"
          >
            Join Early Access
          </Link>
        </nav>
      </div>
    </header>
  );
}
