import cosmiconfig from 'cosmiconfig'
import { readFileSync, writeFileSync } from 'fs'
import ParcelBundler, { ParcelBundle } from 'parcel-bundler'
import readPkg from 'read-pkg'
import { figlet } from './figlet'

interface IOptions {
  text?: string
  footer?: string | null
}

const defaultOptions: IOptions = {}

const plugin = (bundler: ParcelBundler) => {
  bundler.on('bundled', async bundle => {
    const explorer = cosmiconfig('asciiheader')
    const conf = (await explorer.search()) || { config: defaultOptions }
    const opts: IOptions = conf.config

    const { defaultText, defaultFooter } = await defaultValues()
    const text = opts.text || defaultText
    const footer = opts.footer === null ? null : opts.footer || defaultFooter

    const injected = await buildString(text, footer)
    if (bundle.type === 'html') inject(bundle, injected)

    if (bundle.childBundles && bundle.childBundles.size) {
      for (const child of bundle.childBundles) {
        if (child.type === 'html') inject(child, injected)
      }
    }
  })
}

const defaultValues = async () => {
  const currentYear = new Date().getFullYear()

  const pkg = await readPkg()
  const authorName = (pkg.author && pkg.author.name) || pkg.name

  const defaultText = `${authorName} © ${currentYear}`
  const defaultFooter = `Copyright (c) ${authorName} ${currentYear}`

  return { defaultText, defaultFooter }
}

const buildString = async (text: string, footer: string | null) => {
  let str = '<!--\n'

  const figText = await figlet(text)
  str += figText

  if (footer) {
    str += `\n\n${footer}`
  }

  str += '\n-->'
  return str
}

const inject = (bundle: ParcelBundle, injected: string) => {
  const filePath = bundle.name
  const data = readFileSync(filePath, 'utf8')

  const newData = `${injected}\n${data}`
  writeFileSync(filePath, newData)
}

export = plugin
