// Runs the save hook as Orca would, with this worker as the only plugin in the chain.
import { assert, mockHost, mountWorker, test } from 'orca/testing'
import * as main from './worker'

const save = (path: string, text: string) => ({ workspaceId: null, path, text })

const messy = [
  'Feature: Cart',
  'Scenario: Add item',
  'Given the cart:',
  '|sku|price|',
  '|apple|$$5|',
  'Then it works   ',
  ''
].join('\n')
const tidy = [
  'Feature: Cart',
  '  Scenario: Add item',
  '    Given the cart:',
  '      | sku   | price |',
  '      | apple | $$5   |',
  '    Then it works',
  ''
].join('\n')

async function fire(path: string, text: string, settings: Record<string, string | number | boolean> = {}) {
  const worker = await mountWorker(main, { host: mockHost({ settings }) })
  const decision = await worker.hooks.fire('editor.save.before', save(path, text))
  const logs = [...worker.logs]
  await worker.deactivate()
  return { decision, logs }
}

test('formats a feature file on save and keeps its line endings', async () => {
  const formatted = (text: string) => ({ kind: 'continue', event: save('features/cart.feature', text) })
  assert.deepEqual((await fire('features/cart.feature', messy)).decision, formatted(tidy))
  assert.deepEqual(
    (await fire('features/cart.feature', messy.replace(/\n/g, '\r\n'))).decision,
    formatted(tidy.replace(/\n/g, '\r\n'))
  )
  assert.deepEqual((await fire('features/cart.feature', tidy)).decision, formatted(tidy))
})

test('leaves other files alone and follows the settings', async () => {
  const untouched = (path: string) => ({ kind: 'continue', event: save(path, messy) })
  assert.deepEqual((await fire('steps/cart.ts', messy)).decision, untouched('steps/cart.ts'))
  assert.deepEqual((await fire('a.feature', messy, { formatOnSave: false })).decision, untouched('a.feature'))

  const tabbed = tidy.replace(/^( {2})+/gm, (spaces) => '\t'.repeat(spaces.length / 2))
  assert.equal((await fire('a.feature', messy, { indentSize: 0 })).decision.event.text, tabbed)

  const spanish = await fire('a.feature', 'Característica: X\nEscenario: Y\nCuando Z\n', {
    formatConfOverride: '{"Característica": 0, "Escenario": 1, "Cuando": 2}'
  })
  assert.equal(spanish.decision.event.text, 'Característica: X\n  Escenario: Y\n    Cuando Z\n')

  // A bad override must not block formatting.
  const bad = await fire('a.feature', messy, { formatConfOverride: 'nope' })
  assert.equal(bad.decision.event.text, tidy)
  assert.deepEqual(bad.logs, ['formatConfOverride is not a JSON object; ignored'])
})
