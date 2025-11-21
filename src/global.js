const qs = document.querySelector.bind(document)

const scrollConfig = {
  cleanup: true,
  distance: '20%',
  interval: 100,
  origin: 'bottom',
}
ScrollReveal().reveal('.mask-brand, nav a, .badge', scrollConfig)
ScrollReveal().reveal('h1, h2, p, section', {
  ...scrollConfig,
  viewOffset: { top: -500 },
})

/* Rainbow */
let rainbowActive = 0
let rainbowInterval
let rainbowDisabled = false

const rainbowItems = document.querySelectorAll('.rainbow-item')
const rainbowViews = document.querySelectorAll('.rainbow-view')

function setRainbowActive(index) {
  rainbowItems.forEach((item, i) => {
    item.classList.toggle('active', i === index)
  })
  rainbowViews.forEach((view, i) => {
    view.classList.toggle('active', i === index)
  })
}

function startRainbowCycle() {
  if (rainbowDisabled) return
  rainbowInterval = setInterval(() => {
    rainbowActive = (rainbowActive + 1) % rainbowItems.length
    setRainbowActive(rainbowActive)
  }, 1500)
}

if (rainbowItems.length) {
  setRainbowActive(0)
  startRainbowCycle()

  rainbowItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      clearInterval(rainbowInterval)
      rainbowActive = index
      setRainbowActive(rainbowActive)
      rainbowDisabled = true
      setTimeout(() => {
        rainbowDisabled = false
        startRainbowCycle()
      }, 60000)
    })
  })
}

/* Menu toggle */
qs('#menu-bars')?.addEventListener('click', () => qs('header nav')?.classList.toggle('open'))

/* Video unmute on click */
const video = qs('video')
let clicked = false
video?.addEventListener('click', () => {
  if (!clicked) {
    clicked = true
    video.muted = false
    video.currentTime = 0
    setTimeout(() => video.play(), 100)
  }
})
