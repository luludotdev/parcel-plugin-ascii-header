import { readFileSync, writeFileSync } from 'fs'
import ParcelBundler, { ParcelBundle } from 'parcel-bundler'

const plugin = (bundler: ParcelBundler) => {
  bundler.on('bundled', bundle => {
    if (bundle.type === 'html') inject(bundle)

    if (bundle.childBundles && bundle.childBundles.size) {
      for (const child of bundle.childBundles) {
        if (child.type === 'html') inject(child)
      }
    }
  })
}

const inject = (bundle: ParcelBundle) => {
  const filePath = bundle.name
  const data = readFileSync(filePath, 'utf8')

  const injected = ''

  const newData = `${injected}\n${data}`
  writeFileSync(filePath, newData)
}

export = plugin
