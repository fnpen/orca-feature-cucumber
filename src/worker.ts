// Formats Gherkin files on explicit save (editor.save.before). Orca transpiles this file: no build step.
import type { OrcaWorkerApi } from 'orca/worker'
import { clearText, format, type FormatConf } from './format'

const GHERKIN_FILE = /\.(feature|testcase)$/i

export default function activate(orca: OrcaWorkerApi): void {
  const overrides = (raw: unknown): FormatConf => {
    try {
      const parsed = JSON.parse(String(raw).trim() || '{}')
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // reported below
    }
    orca.log('formatConfOverride is not a JSON object; ignored')
    return {}
  }

  orca.hooks.on('editor.save.before', async (event, next) => {
    if (!GHERKIN_FILE.test(event.path)) {
      return undefined
    }
    const {
      formatOnSave = true,
      indentSize = 2,
      skipDocStringsFormat = true,
      formatConfOverride = ''
    } = await orca.settings.get()
    if (formatOnSave === false) {
      return undefined
    }
    const indent = Number(indentSize) > 0 ? ' '.repeat(Number(indentSize)) : '\t'
    const formatted = clearText(
      format(indent, event.text, {
        skipDocStringsFormat: skipDocStringsFormat !== false,
        formatConfOverride: overrides(formatConfOverride)
      })
    )
    // format() joins lines with CRLF; keep the file's own line ending.
    const text = event.text.includes('\r\n') ? formatted : formatted.replace(/\r\n/g, '\n')
    return text === event.text ? undefined : next({ ...event, text })
  })
}
