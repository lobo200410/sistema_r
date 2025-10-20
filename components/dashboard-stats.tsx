"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Globe, GraduationCap, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import type { Resource } from "@/lib/resources"
import { useMemo } from "react"

interface DashboardStatsProps {
  resources: Resource[]
}

export function DashboardStats({ resources }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const total = resources.length
    const published = resources.filter((r) => r.publicado).length
    const unpublished = total - published

    // Recursos por plataforma
    const byPlatform = resources.reduce(
      (acc, r) => {
        acc[r.plataforma] = (acc[r.plataforma] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Recursos por facultad
    const byFaculty = resources.reduce(
      (acc, r) => {
        acc[r.facultad] = (acc[r.facultad] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Recursos por tipo
    const byType = resources.reduce(
      (acc, r) => {
        acc[r.tipo] = (acc[r.tipo] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Recursos recientes (últimos 5)
    const recent = [...resources]
      .sort((a, b) => {
        return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      })
      .slice(0, 5)

    return {
      total,
      published,
      unpublished,
      byPlatform,
      byFaculty,
      byType,
      recent,
    }
  }, [resources])

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500"
          style={{ borderTop: "4px solid #5D0A28" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Recursos</CardTitle>
            <BookOpen className="w-5 h-5 text-[#5D0A28] transition-transform duration-300 hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 hover:text-[#5D0A28]">
              {stats.total}
            </div>
            <p className="text-xs text-gray-500 mt-1">Recursos registrados</p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-100"
          style={{ borderTop: "4px solid #10B981" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Publicados</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-600 transition-transform duration-300 hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 hover:text-green-600">
              {stats.published}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-200"
          style={{ borderTop: "4px solid #F59E0B" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">No Publicados</CardTitle>
            <XCircle className="w-5 h-5 text-amber-600 transition-transform duration-300 hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 hover:text-amber-600">
              {stats.unpublished}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.unpublished / stats.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-300"
          style={{ borderTop: "4px solid #3B82F6" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Plataformas</CardTitle>
            <Globe className="w-5 h-5 text-blue-600 transition-transform duration-300 hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 hover:text-blue-600">
              {Object.keys(stats.byPlatform).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Plataformas activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recursos por plataforma y facultad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card
          className="border-0 shadow-md hover:shadow-xl transition-all duration-300 animate-in slide-in-from-left duration-700"
          style={{ borderTop: "4px solid #5D0A28" }}
        >
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Recursos por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byPlatform)
                .sort(([, a], [, b]) => b - a)
                .map(([platform, count]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-[#5D0A28] animate-pulse flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">{platform}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-20 md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5D0A28] transition-all duration-1000 ease-out"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-0 shadow-md hover:shadow-xl transition-all duration-300 animate-in slide-in-from-right duration-700"
          style={{ borderTop: "4px solid #5D0A28" }}
        >
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Recursos por Facultad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byFaculty)
                .sort(([, a], [, b]) => b - a)
                .map(([faculty, count]) => (
                  <div
                    key={faculty}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GraduationCap className="w-4 h-4 text-[#5D0A28] transition-transform duration-300 hover:scale-110 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">{faculty}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-20 md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5D0A28] transition-all duration-1000 ease-out"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recursos por tipo */}
      <Card
        className="border-0 shadow-md hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom duration-700"
        style={{ borderTop: "4px solid #5D0A28" }}
      >
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Recursos por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {Object.entries(stats.byType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-[#5D0A28] hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <span className="text-sm font-medium truncate mr-2">{type}</span>
                  <span className="text-lg font-bold flex-shrink-0">{count}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recursos recientes */}
      <Card
        className="border-0 shadow-md hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom duration-700 delay-200"
        style={{ borderTop: "4px solid #5D0A28" }}
      >
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
            Recursos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recent.map((resource) => (
              <div
                key={resource.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02] gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{resource.titulo}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{resource.descripcion}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{resource.plataforma}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{resource.tipo}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(resource.fecha_creacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {resource.publicado ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 transition-all duration-300 hover:bg-green-200">
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 transition-all duration-300 hover:bg-amber-200">
                      Borrador
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
