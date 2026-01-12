'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Utensils,
  Scale,
  ClipboardList,
  Backpack,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/meals', icon: Utensils, label: 'Comidas' },
  { href: '/weight', icon: Scale, label: 'Peso' },
  { href: '/mealprep', icon: ClipboardList, label: 'Prep' },
  { href: '/backpack', icon: Backpack, label: 'Mochila' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
