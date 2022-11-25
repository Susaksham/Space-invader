const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// player class
class Player {
  constructor() {
    //velocity of the player
    this.velocity = {
      x: 0,
      y: 0,
    }

    // how much player should rotate
    this.rotation = 0

    // creating the spaceship
    const image = new Image()
    image.src = './image/spaceship.png'
    image.onload = () => {
      const scale = 0.15
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      }
    }
  }

  // to draw the image of the spaceship
  draw() {
    c.save()
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2,
    )
    c.rotate(this.rotation)
    c.translate(
      -(player.position.x + player.width / 2),
      -(player.position.y + player.height / 2),
    )
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      )
    }

    c.restore()
  }

  // updating the canvas for every frame
  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}
const player = new Player()

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
}
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'black'

  //creating the canvas
  c.fillRect(0, 0, canvas.width, canvas.height)

  // setting the velocity of the spaceship on every key stroke
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5
    player.rotation = -0.15
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5
    player.rotation = 0.15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  player.update()
}
animate()

// for every keydown event
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
      console.log('left')

      keys.a.pressed = true
      break
    case 'd':
      console.log('right')
      player.velocity.x = 5
      keys.d.pressed = true
      break
    case ' ':
      console.log('space')
      keys.space.pressed = true
      break
  }
})

// for every keyup event
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      console.log('left')

      keys.a.pressed = false
      break
    case 'd':
      console.log('right')
      player.velocity.x = 5
      keys.d.pressed = false
      break
    case ' ':
      console.log('space')
      keys.space.pressed = false
      break
  }
})
