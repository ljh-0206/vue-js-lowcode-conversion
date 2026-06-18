export interface ParsedComponent {
  name: string
  template: string
  style: string
  options: Record<string, string>
  moduleSymbols: string[]
  importsRemoved: number
}
