export function Logo({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_765_32)">
        <path
          d="M231 131L151 211"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M235 76L99 212"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M117.953 85.58L48.8759 154.657C45.5938 157.939 41.1424 159.783 36.5009 159.783C31.8594 159.783 27.4079 157.939 24.1259 154.657C20.8438 151.375 19 146.924 19 142.282C19 137.641 20.8438 133.189 24.1259 129.907L93.2031 60.83"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M142.703 110.33L175.703 77.33"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M171.578 81.455L155.788 65.6645C152.693 62.5709 150.954 58.3747 150.953 53.999V44.33L132.308 25.685C123.106 16.4878 110.652 11.2835 97.6416 11.198L68.4531 11L76.0431 17.765C81.4341 22.545 85.7508 28.4133 88.7087 34.9831C91.6665 41.5529 93.1983 48.675 93.2031 55.88V69.08L109.703 85.58H119.372C123.748 85.5809 127.944 87.3199 131.038 90.4145L146.828 106.205"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_765_32">
          <rect width="256" height="256" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  )
}
