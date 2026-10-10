import type { ReactElement, SVGProps } from 'react'

const paths: Record<string, ReactElement> = {
  home: (
    <>
      <path d="M4 11.2 12 4l8 7.2" />
      <path d="M6 10v9.5h4.2v-5.2h3.6v5.2H18V10" />
    </>
  ),
  courses: (
    <>
      <path d="M5 4.5h10.5a2 2 0 0 1 2 2V19.5H7a2 2 0 0 1-2-2V4.5Z" />
      <path d="M5 17.5a2 2 0 0 1 2-2h10.5" />
      <path d="M9 8.5h5" />
    </>
  ),
  review: (
    <>
      <path d="M5 7h14M5 12h14M5 17h8" />
    </>
  ),
  settings: (
    <>
      <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
      <circle cx="15" cy="8" r="2" />
      <circle cx="9" cy="16" r="2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  archive: (
    <>
      <path d="M4.5 7.5h15v3h-15z" />
      <path d="M6 10.5V19h12v-8.5M10 14h4" />
    </>
  ),
  restore: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
      <path d="M4.5 4.5v3.8h3.8" />
    </>
  ),
  edit: <path d="m5 19 .8-3.6L16.6 4.6a1.8 1.8 0 0 1 2.5 0l.3.3a1.8 1.8 0 0 1 0 2.5L8.6 18.2 5 19ZM14.5 6.7l2.8 2.8" />,
  trash: (
    <>
      <path d="M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  back: <path d="M9 5l7 7-7 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
}

export type IconName = keyof typeof paths

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
