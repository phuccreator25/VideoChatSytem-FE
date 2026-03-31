// src/config/fingerprint.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fpPromise = FingerprintJS.load({
  monitoring: false,
})

export async function getVisitorId(): Promise<string> {
  const fp = await fpPromise
  const result = await fp.get()
  return result.visitorId
}