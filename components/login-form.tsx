"use client"

import { useActionState } from "react"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock } from "lucide-react"
import Image from "next/image"

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-2xl rounded-2xl">
      {/* 🔹 Header con logo un 20% más grande */}
      <CardHeader className="space-y-2 pb-2 pt-4 px-4 sm:px-6">
        <div className="flex justify-center">
          {/* 🔹 Aumentamos tamaño y escala un poco */}
          <div className="relative w-32 h-24 sm:w-40 sm:h-28 md:w-48 md:h-32">
            <Image
              src="/logo-sistema.png"
              alt="Logo Sistema de Recursos Educativos"
              fill
              className="object-contain scale-125 md:scale-135 drop-shadow-lg transition-transform duration-300"
              priority
            />
          </div>
        </div>

         <h1 className="text-lg sm:text-xl font-bold text-center text-white px-2">Registro de Recursos Educativos</h1>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-3 pb-4 px-4 sm:px-6">
          {state?.error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
              <AlertDescription className="text-sm">{state.error}</AlertDescription>
            </Alert>
          )}

          {/* Campo usuario */}
          <div className="space-y-1">
            <Label htmlFor="username" className="text-white font-medium flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              Nombre de Usuario
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="nombre.apellido"
              required
              disabled={pending}
              className="bg-white border-0 h-9 text-gray-900 placeholder:text-gray-500 text-sm sm:text-base"
            />
          </div>

          {/* Campo contraseña */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-white font-medium flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              disabled={pending}
              className="bg-white border-0 h-9 text-gray-900 text-sm sm:text-base"
            />
          </div>

          {/* Botón */}
          <Button
            type="submit"
            className="w-full h-9 mt-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold shadow-lg transition-all duration-200 text-sm sm:text-base"
            disabled={pending}
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </Button>

          {/* Pie de página */}
          <p className="text-center text-white/80 text-xs mt-3">
            © UTEC 2025 - Sistema de Recursos Educativos
          </p>
        </CardContent>
      </form>
    </Card>
  )
}
