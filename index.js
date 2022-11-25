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

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Invader {
  constructor({ position }) {
    //velocity of the player
    this.velocity = {
      x: 0,
      y: 0,
    }

    // how much player should rotate

    // creating the spaceship
    const image = new Image()
    image.src = './image/invader.png'
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y,
      }
    }
  }

  // to draw the image of the spaceship
  draw() {
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      )
    }
  }

  // updating the canvas for every frame
  update({ velocity }) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    }
    this.velocity = {
      x: 3,
      y: 0,
    }
    this.invaders = []
    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          }),
        )
      }
    }
  }
  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

const player = new Player()
const grids = [new Grid()]
const projectiles = []

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

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius / 2 <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0) // to remove the projectile if it moves out of the screen
    } else {
      projectile.update()
    }
  })
  grids.forEach((grid) => {
    grid.update()

    grid.invaders.forEach((invader) => {
      invader.update({
        velocity: {
          x: 1,
          y: 0,
        },
      })
    })
  })
}
animate()

// for every keydown event
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
      // console.log('left')

      keys.a.pressed = true
      break
    case 'd':
      // console.log('right')
      player.velocity.x = 5
      keys.d.pressed = true
      break
    case ' ':
      // console.log('space')
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -5,
          },
        }),
      )
      console.log(projectiles)
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
