import { type NextRequest, NextResponse } from "next/server"
import ExcelJS from "exceljs"
import { getCurrentUser } from "@/app/actions/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Excel export API called")

    const user = await getCurrentUser()
    console.log("[v0] Current user:", user ? user.name : "No user found")

    if (!user) {
      console.error("[v0] No user authenticated")
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body received, resources count:", body.resources?.length)

    const { resources: allResources, filters } = body

    if (!allResources || !Array.isArray(allResources)) {
      console.error("[v0] Invalid resources data")
      return NextResponse.json({ error: "Datos de recursos inválidos" }, { status: 400 })
    }

    const resources = allResources.filter((resource: any) => {
      const matchesPlatform =
        !filters?.plataforma || filters.plataforma === "todos" || resource.plataforma === filters.plataforma
      const matchesFaculty =
        !filters?.facultad || filters.facultad === "todos" || resource.facultad === filters.facultad
      const matchesCycle = !filters?.ciclo || filters.ciclo === "todos" || resource.ciclo === filters.ciclo
      const matchesType = !filters?.tipo || filters.tipo === "todos" || resource.tipo === filters.tipo
      const matchesPublished =
        !filters?.publicado ||
        filters.publicado === "todos" ||
        (filters.publicado === "publicados" && resource.publicado) ||
        (filters.publicado === "no-publicados" && !resource.publicado)

      return matchesPlatform && matchesFaculty && matchesCycle && matchesType && matchesPublished
    })

    console.log("[v0] Filtered resources count:", resources.length)

    console.log("[v0] Creating Excel workbook...")
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Reporte Completo")

    worksheet.mergeCells("A1:J1")
    const titleCell = worksheet.getCell("A1")
    titleCell.value = "UNIVERSIDAD TECNOLÓGICA DE EL SALVADOR"
    titleCell.font = { name: "Arial", size: 16, bold: true, italic: true }
    titleCell.alignment = { horizontal: "center", vertical: "middle" }
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF5D0A28" },
    }
    titleCell.font = { ...titleCell.font, color: { argb: "FFFFFFFF" } }
    worksheet.getRow(1).height = 25

    worksheet.mergeCells("A2:J2")
    const subtitleCell = worksheet.getCell("A2")
    subtitleCell.value = "DIRECCIÓN DE EDUCACIÓN VIRTUAL"
    subtitleCell.font = { name: "Arial", size: 14, bold: true, italic: true }
    subtitleCell.alignment = { horizontal: "center", vertical: "middle" }
    subtitleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8B1538" },
    }
    subtitleCell.font = { ...subtitleCell.font, color: { argb: "FFFFFFFF" } }
    worksheet.getRow(2).height = 22

    worksheet.mergeCells("A3:J3")
    const reportTitleCell = worksheet.getCell("A3")
    reportTitleCell.value = "REPORTE DE RECURSOS EDUCATIVOS"
    reportTitleCell.font = { name: "Arial", size: 12, bold: true }
    reportTitleCell.alignment = { horizontal: "center", vertical: "middle" }
    worksheet.getRow(3).height = 20

    worksheet.mergeCells("A4:J4")
    const yearCell = worksheet.getCell("A4")
    yearCell.value = `Año ${new Date().getFullYear()}`
    yearCell.font = { name: "Arial", size: 11, italic: true }
    yearCell.alignment = { horizontal: "center", vertical: "middle" }

    worksheet.addRow([])

    const infoRow1 = worksheet.addRow(["Fecha de generación:", new Date().toLocaleDateString()])
    infoRow1.font = { name: "Arial", size: 10 }
    const infoRow2 = worksheet.addRow(["Hora de generación:", new Date().toLocaleTimeString()])
    infoRow2.font = { name: "Arial", size: 10 }
    const infoRow3 = worksheet.addRow(["Generado por:", user.name])
    infoRow3.font = { name: "Arial", size: 10 }

    if (filters) {
      worksheet.addRow([])
      const filtersHeaderRow = worksheet.addRow(["FILTROS APLICADOS:"])
      filtersHeaderRow.font = { name: "Arial", size: 10, bold: true }

      if (filters.plataforma && filters.plataforma !== "todos") {
        const filterRow = worksheet.addRow(["Plataforma:", filters.plataforma])
        filterRow.font = { name: "Arial", size: 10 }
      }
      if (filters.facultad && filters.facultad !== "todos") {
        const filterRow = worksheet.addRow(["Facultad:", filters.facultad])
        filterRow.font = { name: "Arial", size: 10 }
      }
      if (filters.ciclo && filters.ciclo !== "todos") {
        const filterRow = worksheet.addRow(["Ciclo:", filters.ciclo])
        filterRow.font = { name: "Arial", size: 10 }
      }
      if (filters.tipo && filters.tipo !== "todos") {
        const filterRow = worksheet.addRow(["Tipo:", filters.tipo])
        filterRow.font = { name: "Arial", size: 10 }
      }
      if (filters.publicado && filters.publicado !== "todos") {
        const filterRow = worksheet.addRow([
          "Estado:",
          filters.publicado === "publicados" ? "Publicados" : "No publicados",
        ])
        filterRow.font = { name: "Arial", size: 10 }
      }
    }

    worksheet.addRow([])

    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:J${worksheet.lastRow.number + 1}`)
    const statsHeaderCell = worksheet.getCell(`A${worksheet.lastRow.number + 1}`)
    statsHeaderCell.value = "RESUMEN ESTADÍSTICO"
    statsHeaderCell.font = { name: "Arial", size: 12, bold: true, italic: true }
    statsHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    statsHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    worksheet.addRow([])

    const statsHeaderRow = worksheet.addRow(["Métrica", "Valor", "Porcentaje"])
    statsHeaderRow.font = { name: "Arial", size: 11, bold: true, italic: true }
    statsHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD0D0D0" },
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })

    const totalPublicados = resources.filter((r: any) => r.publicado).length
    const porcentajePublicado = resources.length > 0 ? Math.round((totalPublicados / resources.length) * 100) : 0

    worksheet.addRow(["Total de Recursos", resources.length, "100%"])
    worksheet.addRow(["Recursos Publicados", totalPublicados, `${porcentajePublicado}%`])

    worksheet.addRow([])

    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:J${worksheet.lastRow.number + 1}`)
    const detailHeaderCell = worksheet.getCell(`A${worksheet.lastRow.number + 1}`)
    detailHeaderCell.value = "DETALLE DE RECURSOS"
    detailHeaderCell.font = { name: "Arial", size: 12, bold: true, italic: true }
    detailHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    detailHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    worksheet.addRow([])

    const detailHeaderRow = worksheet.addRow([
      "Nombre",
      "URL",
      "Tipo",
      "Plataforma",
      "Asignatura",
      "Ciclo",
      "Facultad",
      "Docente",
      "Publicado",
      "Fecha de Creación",
    ])
    detailHeaderRow.font = { name: "Arial", size: 11, bold: true, italic: true }
    detailHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD0D0D0" },
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })

    resources.forEach((r: any) => {
      worksheet.addRow([
        r.titulo,
        r.url,
        r.tipo,
        r.plataforma,
        r.asignatura,
        r.ciclo,
        r.facultad,
        r.docente,
        r.publicado ? "Sí" : "No",
        new Date(r.createdAt).toLocaleDateString(),
      ])
    })

    worksheet.addRow([])

    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:C${worksheet.lastRow.number + 1}`)
    const platformHeaderCell = worksheet.getCell(`A${worksheet.lastRow.number + 1}`)
    platformHeaderCell.value = "ESTADÍSTICAS POR PLATAFORMA"
    platformHeaderCell.font = { name: "Arial", size: 12, bold: true, italic: true }
    platformHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    platformHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    worksheet.addRow([])

    const platformStatsHeaderRow = worksheet.addRow(["Plataforma", "Cantidad", "Porcentaje"])
    platformStatsHeaderRow.font = { name: "Arial", size: 11, bold: true, italic: true }
    platformStatsHeaderRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD0D0D0" },
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      }
    })

    const plataformas = Array.from(new Set(resources.map((r: any) => r.plataforma)))
    plataformas.forEach((p: any) => {
      const count = resources.filter((r: any) => r.plataforma === p).length
      const percentage = resources.length > 0 ? Math.round((count / resources.length) * 100) : 0
      worksheet.addRow([p, count, `${percentage}%`])
    })

    worksheet.addRow([])

    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:C${worksheet.lastRow.number + 1}`)
    const facultyHeaderCell = worksheet.getCell(`A${worksheet.lastRow.number + 1}`)
    facultyHeaderCell.value = "ESTADÍSTICAS POR FACULTAD"
    facultyHeaderCell.font = { name: "Arial", size: 12, bold: true, italic: true }
    facultyHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    facultyHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    worksheet.addRow([])

    const facultyStatsHeaderRow = worksheet.addRow(["Facultad", "Cantidad", "Porcentaje"])
    facultyStatsHeaderRow.font = { name: "Arial", size: 11, bold: true, italic: true }
    facultyStatsHeaderRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD0D0D0" },
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      }
    })

    const facultades = Array.from(new Set(resources.map((r: any) => r.facultad)))
    facultades.forEach((f: any) => {
      const count = resources.filter((r: any) => r.facultad === f).length
      const percentage = resources.length > 0 ? Math.round((count / resources.length) * 100) : 0
      worksheet.addRow([f, count, `${percentage}%`])
    })

    worksheet.addRow([])

    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:C${worksheet.lastRow.number + 1}`)
    const typeHeaderCell = worksheet.getCell(`A${worksheet.lastRow.number + 1}`)
    typeHeaderCell.value = "ESTADÍSTICAS POR TIPO DE RECURSO"
    typeHeaderCell.font = { name: "Arial", size: 12, bold: true, italic: true }
    typeHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    typeHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    worksheet.addRow([])

    const typeStatsHeaderRow = worksheet.addRow(["Tipo", "Cantidad", "Porcentaje"])
    typeStatsHeaderRow.font = { name: "Arial", size: 11, bold: true, italic: true }
    typeStatsHeaderRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD0D0D0" },
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      }
    })

    const tipos = Array.from(new Set(resources.map((r: any) => r.tipo)))
    tipos.forEach((t: any) => {
      const count = resources.filter((r: any) => r.tipo === t).length
      const percentage = resources.length > 0 ? Math.round((count / resources.length) * 100) : 0
      worksheet.addRow([t, count, `${percentage}%`])
    })

    worksheet.addRow([])

    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:C${worksheet.lastRow.number + 1}`)
    const cycleHeaderCell = worksheet.getCell(`A${worksheet.lastRow.number + 1}`)
    cycleHeaderCell.value = "ESTADÍSTICAS POR CICLO ACADÉMICO"
    cycleHeaderCell.font = { name: "Arial", size: 12, bold: true, italic: true }
    cycleHeaderCell.alignment = { horizontal: "center", vertical: "middle" }
    cycleHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    worksheet.addRow([])

    const cycleStatsHeaderRow = worksheet.addRow(["Ciclo", "Cantidad", "Porcentaje"])
    cycleStatsHeaderRow.font = { name: "Arial", size: 11, bold: true, italic: true }
    cycleStatsHeaderRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD0D0D0" },
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      }
    })

    const ciclos = Array.from(new Set(resources.map((r: any) => r.ciclo)))
    ciclos.forEach((c: any) => {
      const count = resources.filter((r: any) => r.ciclo === c).length
      const percentage = resources.length > 0 ? Math.round((count / resources.length) * 100) : 0
      worksheet.addRow([c, count, `${percentage}%`])
    })

    worksheet.addRow([])

    console.log("[v0] Setting column widths...")
    worksheet.columns = [
      { width: 40 },
      { width: 50 },
      { width: 20 },
      { width: 20 },
      { width: 40 },
      { width: 15 },
      { width: 45 },
      { width: 30 },
      { width: 15 },
      { width: 20 },
    ]

    console.log("[v0] Generating Excel buffer...")
    const buffer = await workbook.xlsx.writeBuffer()
    console.log("[v0] Buffer size:", buffer.byteLength, "bytes")

    console.log("[v0] Sending Excel file response...")
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=reporte_recursos_${new Date().toISOString().split("T")[0]}.xlsx`,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating Excel:", error)
    return NextResponse.json(
      { error: "Error al generar el archivo Excel", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
