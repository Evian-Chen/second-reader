'use client'

import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { increment, decrement } from '@/features/counter/counterSlice';

export default function Home() {
  const { user, isLoaded } = useUser();
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        {/* Clerk 認證測試區塊 */}
        <div className="w-full mb-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
            Clerk 認證測試
          </h2>
          
          {!isLoaded ? (
            <p className="text-gray-600 dark:text-gray-400">載入中...</p>
          ) : (
            <>
              <SignedOut>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    目前未登入，請點擊下方按鈕登入：
                  </p>
                  <SignInButton mode="modal">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      登入 / 註冊
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              
              <SignedIn>
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                      ✓ 已成功登入！
                    </p>
                    {user && (
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p><strong>使用者 ID:</strong> {user.id}</p>
                        <p><strong>姓名:</strong> {user.firstName || user.fullName || '未設定'}</p>
                        <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress || '未設定'}</p>
                      </div>
                    )}
                  </div>
                  <SignOutButton>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      登出
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
            </>
          )}
        </div>

        {/* Redux 測試區塊 */}
        <div className="w-full mb-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
            Redux 測試
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            計數器來自 Redux store（counter slice）。點按鈕確認 state 會更新。
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => dispatch(decrement())}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-zinc-100 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
            >
              -1
            </button>
            <span className="text-xl font-mono font-semibold min-w-[2rem] text-center text-black dark:text-zinc-50">
              {count}
            </span>
            <button
              type="button"
              onClick={() => dispatch(increment())}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-zinc-100 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
            >
              +1
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
