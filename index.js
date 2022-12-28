const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const start = document.querySelector('.start')
const specialElement = document.querySelector('.specialElement')
const overImage = new Image()
overImage.src =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png'
// overImage.width = ' 400'
// overImage.height = '400'

const c = canvas.getContext('2d')
console.log(scoreEl)
canvas.width = 1024
canvas.height = 576

// player class
class Player {
  constructor() {
    //velocity of the player
    this.velocity = {
      x: 0,
      y: 0,
    }
    this.opacity = 1
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
    c.globalAlpha = this.opacity
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
class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }
  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.fades) {
      this.opacity -= 0.01
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 4
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
class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
  }
  draw() {
    c.fillStyle = 'white'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
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
  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      }),
    )
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    }
    this.velocity = {
      x: 1,
      y: 0,
    }
    this.invaders = []
    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)

    this.width = columns * 30
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

    this.velocity.y = 0
    if (this.position.x + this.width >= canvas.width) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
    if (this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}

let game = {
  over: false,
  active: false,
}
const player = new Player()
let grids = []
let projectiles = []
let invaderProjectiles = []
let particles = []
let score = 0
specialElement.addEventListener('click', () => {
  console.log('excellent work')
  start.blur()
})
start.addEventListener('click', (e) => {
  specialElement.click()

  game.active = !game.active
  if (start.textContent === 'Start') {
    game.over = false
    player.opacity = 1
    frames = 0
    scoreEl.textContent = 0
  }

  console.log(start.textContent)
  if (start.textContent === 'Start') {
    start.textContent = 'Pause'
  } else if (start.textContent === 'Pause') start.textContent = 'Resume'
  else if (start.textContent === 'Resume') start.textContent = 'Pause'
})
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
let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
for (let i = 0; i < 80; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
      },
      velocity: {
        x: 0,
        y: 0.3,
      },
      radius: Math.random() * 3,
      color: 'white',
      fades: false,
    }),
  )
}

function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: color || '#BAA0DE',
        fades: fades,
      }),
    )
  }
}

class Score {
  constructor(score) {
    this.score = score
  }
  draw() {
    c.font = '20px Georgia'
    c.fillText(`${this.score}`, 10, 50)
  }
  update() {
    this.draw()
  }
}
function animate() {
  requestAnimationFrame(animate)
  if (game.over) {
    grids = []
    projectiles = []
    invaderProjectiles = []
    particles = []
    // c.fillStyle = 'green'
    // c.fillRect(0, 0, canvas.width, canvas.height)
    // c.drawImage(overImage, canvas.width / 2, canvas.height / 2, 400, 300)
    c.font = '200px Arial'
    c.fillStyle = 'white'
    c.fillText(`${score}`, canvas.width / 2 - 100, canvas.height / 2 + 50)
  }

  //creating the canvas
  if (!game.active) {
    return
  }
  c.fillStyle = 'black'
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

  particles.forEach((particle, index) => {
    if (particle.position.y + particle.radius >= canvas.height) {
      particle.position.x = Math.floor(Math.random() * canvas.width)
      particle.position.y = 0
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(index, 1)
      }, 0)
    } else {
      particle.update()
    }
  })
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
      }, 0)
    } else {
      invaderProjectile.update()
    }
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      console.log('game ended')
      setTimeout(() => {
        console.log('game ended inside')
        invaderProjectiles.splice(index, 1)
        player.opacity = 0
        game.over = true
        start.textContent = 'Start'
      }, 0)
      setTimeout(() => {
        game.active = false
      }, 2000)
      createParticles({ object: player, fades: true })
    }
  })
  // console.log(invaderProjectiles)

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius / 2 <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0) // to remove the projectile if it moves out of the screen
    } else {
      projectile.update()
    }
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()

    // spawn projectiles
    if (frames % 500 == 0 && grid) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles,
      )
    }
    grid.invaders.forEach((invader, i) => {
      invader.update({
        velocity: {
          x: grid.velocity.x,
          y: grid.velocity.y,
        },
      })
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          // console.log('collide')
          setTimeout(() => {
            const invaderFound = grid.invaders.find((invader2) => {
              return invader2 === invader
            })
            const projectTileFound = projectiles.find(
              (projectile2) => projectile2 === projectile,
            )
            /* it is important to set the if conditions because there can be a case when element is not removed right away but after sometime when that projectile matches with some other invader in the same foreach and set the setTememout , and first setTimeout removes the invader 
            and again tries to remove the invader that matches second time in the foreach , it will cause problem that is why we added if condition
             */
            // remove invader and projectile here
            if (invaderFound && projectTileFound) {
              score += 100
              scoreEl.textContent = score
              createParticles({ object: invader, fades: true })

              grid.invaders.splice(i, 1)
              projectiles.splice(j, 1)
              console.log('inside the setTimeout')
            }
            if (grid.invaders.length > 0) {
              const firstInvader = grid.invaders[0]
              const lastInvader = grid.invaders[grid.invaders.length - 1]
              grid.position.x = firstInvader.position.x
              grid.width =
                lastInvader.position.x -
                firstInvader.position.x +
                lastInvader.width
            } else {
              grids.splice(gridIndex, 1)
            }
          }, 0)
        }
        // my way of doing
        // if (
        //   projectile.position.y <= invader.position.y + invader.height &&
        //   projectile.position.x + 2 * projectile.radius >= invader.position.x &&
        //   projectile.position.x - projectile.radius <= invader.position.x &&
        //   projectile.position.y >= invader.position.y
        // ) {
        //   // console.log('collide')
        //   setTimeout(() => {
        //     grid.invaders.splice(i, 1)
        //     projectiles.splice(j, 1)
        //   }, 0)
        // }
        //----------------------------------
      })
    })
  })
  if (frames % randomInterval === 0) {
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500 + 500)
    frames = 0
  }

  frames++
}
animate()

// for every keydown event
addEventListener('keydown', ({ key }) => {
  if (game.over) return
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
