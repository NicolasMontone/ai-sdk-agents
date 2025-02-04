'use client'

import { Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import GithubIcon from './github-icon'

export default function GithubButton({ count }: { count?: number }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 })
  const [starOpacity, setStarOpacity] = useState(1)
  const starRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (isAnimating) {
      const startTime = Date.now()
      let animationFrame: number

      const animate = () => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min(elapsedTime / 600, 1)

        const newX = Math.sin(progress * Math.PI * 2) * 20
        const newY = -progress * 50

        setStarPosition({ x: newX, y: newY })
        setStarOpacity(1 - progress)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          window.open(
            'https://github.com/nicolasmontone/ai-sdk-agents',
            '_blank'
          )
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isAnimating])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAnimating(true)
  }

  return (
    <a
      href="https://github.com/nicolasmontone/ai-sdk-agents"
      target="_blank"
      onClick={handleClick}
      rel="noreferrer"
    >
      <button
        type="button"
        className={`
          relative overflow-hidden group
          px-4 py-2 rounded-md backdrop-filter backdrop-blur-lg
          border border-white border-opacity-20
          transition-all duration-300 ease-out
          hover:shadow-lg
          text-white text-sm font-medium
        `}
      >
        <div className="relative z-10 flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <GithubIcon className="w-4 h-4 fill-white" />
            <span>Star on GitHub</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star
              ref={starRef}
              className="w-4 h-4 text-white group-hover:text-yellow-400 transition-all duration-300"
            />
            <div>
              {!count || Number.isNaN(count) ? '-' : count.toLocaleString()}
            </div>
          </div>
        </div>
        <div
          className={`
            absolute inset-0 
            bg-gradient-to-r from-transparent via-white to-transparent
            opacity-20 
            transform -translate-x-full group-hover:translate-x-full
            transition-transform duration-1000 ease-out
          `}
        />
      </button>
      {isAnimating && (
        <div
          className="absolute"
          style={{
            transform: `translate(${starPosition.x}px, ${starPosition.y}px)`,
            opacity: starOpacity,
            transition: 'opacity 0.3s ease-out',
            left: `${starRef.current?.getBoundingClientRect().x}px`,
            top: `${starRef.current?.getBoundingClientRect().y}px`,
          }}
        >
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
      )}
    </a>
  )
}
