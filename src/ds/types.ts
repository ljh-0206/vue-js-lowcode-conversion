export interface ModuleSymbol {
  name: string
  raw: string
}

export interface ParsedComponent {
  name: string
  template: string
  style: string
  options: Record<string, string>
  moduleSymbols: string[]
  moduleDeclarations: ModuleSymbol[]
  importsRemoved: number
}
