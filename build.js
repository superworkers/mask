#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const config = {
  buildDir: './build',
  layoutFile: './src/layout.html',
  pagesFile: './src/pages.json',
  srcDir: './src',
}

const build = () => {
  const layout = fs.readFileSync(config.layoutFile, 'utf8')
  const pages = fs.existsSync(config.pagesFile)
    ? JSON.parse(fs.readFileSync(config.pagesFile, 'utf8'))
    : {}

  if (!fs.existsSync(config.buildDir))
    fs.mkdirSync(config.buildDir, { recursive: true })

  // Process source files
  if (fs.existsSync(config.srcDir)) {
    fs.readdirSync(config.srcDir).forEach(file => {
      const srcPath = path.join(config.srcDir, file)
      const buildPath = path.join(config.buildDir, file)
      const stat = fs.statSync(srcPath)

      if (stat.isDirectory()) {
        fs.cpSync(srcPath, buildPath, { recursive: true })
        console.log(`📁 ${file}`)
      } else if (file.endsWith('.html') && file !== 'layout.html') {
        const content = fs.readFileSync(srcPath, 'utf8')
        const pageName = file.replace('.html', '')
        const pageConfig = pages[pageName] || {}

        const replacements = {
          ...pageConfig,
          content,
          moreStyles: fs.existsSync(path.join(config.srcDir, `${pageName}.css`))
            ? `<link rel="stylesheet" href="${pageName}.css" />`
            : '',
          moreScripts: fs.existsSync(path.join(config.srcDir, `${pageName}.js`))
            ? `<script defer src="${pageName}.js"></script>`
            : '',
        }

        // Add active class to current page nav link
        const navPages = ['way', 'investors']
        navPages.forEach(page => {
          const isActive = page === pageName
          replacements[`${page}-active`] = isActive ? ' class="active"' : ''
        })

        let html = layout
        Object.keys(replacements).forEach(key => {
          html = html.replace(new RegExp(`{${key}}`, 'g'), replacements[key])
        })

        fs.writeFileSync(buildPath, html)
        console.log(`📄 ${file}`)
      } else if (file !== 'layout.html' && file !== 'pages.json') {
        fs.copyFileSync(srcPath, buildPath)
        console.log(`📄 ${file}`)
      }
    })
  }

  console.log('\n🎉 Build complete!')
}

build()

if (process.argv.includes('--watch')) {
  fs.watch(config.srcDir, () => build())
  console.log('Watching for changes')
}
