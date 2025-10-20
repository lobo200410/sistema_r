"use client"

import { useState } from "react"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings, UserCog, BookOpen, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { User as UserType } from "@/lib/auth"

interface DashboardHeaderProps {
  user: UserType
  isSuperAdmin?: boolean
}

export function DashboardHeader({ user, isSuperAdmin }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className="border-b border-gray-200 shadow-sm"
      style={{ backgroundColor: "#5D0A28" }}
    >
      <div className="py-4 px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* 🔹 Logo alineado a la izquierda */}
          <div className="flex items-center">
            <Image
              src="/logo-sistema.png"
              alt="Logo Universidad Tecnológica de El Salvador"
              width={210}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          {/* 🔹 Navegación de escritorio */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Botón Recursos */}
            <Link href="/dashboard/recursos">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Recursos
              </Button>
            </Link>

            {/* Solo visible para Superadmin */}
            {isSuperAdmin && (
              <>
                <Link href="/users">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Usuarios
                  </Button>
                </Link>

                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Administración
                  </Button>
                </Link>
              </>
            )}

            {/* Nombre del usuario */}
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-white/80" />
              <span className="text-white font-medium">{user.name}</span>
            </div>

            {/* Botón de Cerrar Sesión */}
            <form action={logout}>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="bg-white text-[#5D0A28] border-white hover:bg-white/90 hover:text-[#5D0A28] transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </form>
          </div>

          {/* 🔹 Botón menú móvil */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* 🔹 Navegación móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/20 space-y-3 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 text-sm text-white mb-3 pb-3 border-b border-white/20">
              <User className="w-4 h-4 text-white/80" />
              <span className="font-medium">{user.name}</span>
            </div>

            {/* Recursos */}
            <Link href="/dashboard/recursos" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Recursos
              </Button>
            </Link>

            {/* Botones Superadmin */}
            {isSuperAdmin && (
              <>
                <Link href="/users" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Usuarios
                  </Button>
                </Link>

                <Link href="/admin" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Administración
                  </Button>
                </Link>
              </>
            )}

            {/* Cerrar sesión */}
            <form action={logout} className="pt-3 border-t border-white/20">
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="w-full justify-start bg-white text-[#5D0A28] border-white hover:bg-white/90 hover:text-[#5D0A28]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
