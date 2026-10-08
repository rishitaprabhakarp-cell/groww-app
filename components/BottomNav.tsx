"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/community", label: "Community", icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 bg-[#111111] border-t border-white/10 px-4">
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
              isActive ? "text-[#00d4a0]" : "text-white/40 hover:text-white/70"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5 transition-all",
                isActive && "drop-shadow-[0_0_8px_rgba(0,212,160,0.6)]"
              )}
            />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
