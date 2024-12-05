"use client"

import React from "react"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

const Sidebar = () => {
  const pathname = usePathname()

  const navLinks = [
    { label: "Home", route: "/" },
    { label: "Profile", route: "/profile" },
  ]

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 shadow-lg">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          MyApp
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="space-y-4">
            <SignedIn>
              {/* Links when signed in */}
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link href={link.route} className={`block p-2 rounded-md ${pathname === link.route ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* User Button */}
              <li className="mt-6">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8",
                      userButtonOuter: "flex items-center gap-2",
                    },
                  }}
                />
              </li>
            </SignedIn>

            <SignedOut>
              {/* Sign In button when signed out */}
              <li>
                <Link href="/sign-in" className="block text-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                  Sign In
                </Link>
              </li>
            </SignedOut>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
