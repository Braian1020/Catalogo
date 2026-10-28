import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  backFallbackPath?: string;
}

export default function Breadcrumbs({
  items,
  showBackButton = false,
  backFallbackPath = '/',
}: BreadcrumbsProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(backFallbackPath);
    }
  };

  return (
    <nav
      aria-label="Ruta de navegación"
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 w-full flex items-center justify-between gap-3 text-xs"
    >
      <ol className="flex items-center flex-wrap gap-1.5 text-slate-500 font-medium">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            title="Inicio"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="sr-only sm:not-sr-only">Inicio</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-slate-900 transition-colors truncate max-w-[140px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-bold text-slate-900 truncate max-w-[160px] sm:max-w-sm"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {showBackButton && (
        <button
          type="button"
          onClick={handleBack}
          className="shrink-0 hidden sm:inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver</span>
        </button>
      )}
    </nav>
  );
}
