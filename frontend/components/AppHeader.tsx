'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, useUser, SignOutButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function AppHeader() {
  const { user } = useUser()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 backdrop-blur-sm bg-opacity-95 shadow-lg">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logoDark.png"
                alt="Second Reader Logo"
                width={192}
                height={128}
                className="object-contain"
              />
            </Link>
          </div>

          {/* 右側功能區 */}
          <div className="flex items-center gap-4">
            {/* 購物車 */}
            <SignedOut>
              <Link
                href="/login"
                className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="購物車"
              >
                <svg
                  className="w-6 h-6 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
            </SignedOut>

            <SignedIn>
              <button
                className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="購物車"
              >
                <svg
                  className="w-6 h-6 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {/* 購物車數量徽章（可選） */}
                {/* <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span> */}
              </button>
            </SignedIn>

            {/* 使用者區塊 */}
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
                    登入
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    註冊
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div ref={userMenuRef} className="user-menu-container relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserMenu(!showUserMenu)
                  }}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800 transition-colors"
                  aria-label="使用者選單"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* 下拉選單 */}
                {showUserMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50 backdrop-blur-sm"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      個人資料
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      我的訂單
                    </Link>
                    <Link
                      href="/my-books"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      我的書籍
                    </Link>
                    <hr className="my-2 border-gray-700" />
                    <SignOutButton>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        登出
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}
