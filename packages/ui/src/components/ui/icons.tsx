'use client';

import {
  Home,
  MessageSquareQuote,
  TrendingUp,
  Flame,
  Hash,
  Settings,
  Lock,
  User,
  Users,
  CircleAlert,
  Sun,
  Moon,
  ArrowLeft,
  LaptopMinimal,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  LogOut,
  CircleStar,
  Star,
  CalendarClock,
  MessageSquareDot,
  CheckCheck,
  Plus,
  X,
  Clock,
  Tag,
} from 'lucide-react';

export const Icons = {
  LogoIcon: MessageSquareQuote,
  Home,
  TrendingUp,
  Flame,
  Hash,
  Settings,
  Lock,
  User,
  Check,
  CircleAlert,
  Users,
  Clock,
  Tag,
  SunForTheme: Sun,
  MoonForTheme: Moon,
  SystemForTheme: LaptopMinimal,
  ChevronUp,
  ChevronLeft,
  DoubleCheck: CheckCheck,
  ChevronDown,
  X,
  Plus,
  LogOut,
  Star,
  ArrowLeft,
  Since: CalendarClock,
  MessageSquareDot,
  NodeconShop: CircleStar,
  FillCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" className="fill-currentColor" />
    </svg>
  ),
  NP: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="12"
        className="fill-blue-500 dark:fill-blue-400"
      />
      <circle
        cx="12"
        cy="12"
        r="11.5"
        className="stroke-black/15 dark:stroke-white/20"
      />
      <path
        d="M15.148 7.75079C16.0223 7.75079 16.6438 7.98223 17.0124 8.44511C17.3895 8.90799 17.5781 9.60659 17.5781 10.5409C17.5781 11.4838 17.3853 12.1867 16.9995 12.6496C16.6224 13.1125 16.0052 13.3439 15.148 13.3439H14.3251V16.6226H12.7565V7.75079H15.148ZM15.0966 11.9167C15.4309 11.9167 15.6623 11.8053 15.7909 11.5824C15.9281 11.3595 15.9966 11.0124 15.9966 10.5409C15.9966 10.0695 15.9281 9.72231 15.7909 9.49944C15.6623 9.27657 15.4309 9.16514 15.0966 9.16514H14.3251V11.9167H15.0966Z"
        className="fill-white dark:fill-black"
      />
      <path
        d="M11.6812 7.75079V16.6226H10.0997L8.24817 11.891V16.6226H6.66667V7.75079H8.24817L10.0997 12.6881V7.75079H11.6812Z"
        className="fill-white dark:fill-black"
      />
      <circle
        opacity="0.3"
        cx="12"
        cy="12"
        r="12"
        fill="url(#paint0_radial_249_637)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_249_637"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(12 9.33333) rotate(90) scale(14.6667)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),
};
