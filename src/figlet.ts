import figlet from 'figlet'

const figletPromise: (text: string) => Promise<string> = text =>
  new Promise((resolve, reject) => {
    figlet(text, (err, result) => {
      if (err) return reject(err)
      else return resolve(result)
    })
  })

export { figletPromise as figlet }
