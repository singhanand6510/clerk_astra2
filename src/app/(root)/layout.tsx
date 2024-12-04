import Sidebar from "@/components/shared/Sidebar"
import React from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </main>
  )
}

export default Layout
