let eyes = [];
let gravity = 0.5;
let damping = 0.7;
let maxEyes = Infinity; // Cambiar este valor según tus necesidades

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let i = 0; i < eyes.length; i++) {
    let eye = eyes[i];
    eye.applyGravity(gravity);
    eye.update();
    eye.checkBoundary();
    eye.display();
  }

  // Verificar si hay más de 15 ojos en pantalla
  if (eyes.length > maxEyes) {
    for (let i = 0; i < eyes.length; i++) {
      let eye = eyes[i];
      if (eye.y + eye.radius >= height) {
        eye.radius *= 0.95; // Reducir el tamaño de los ojos en la base
      }
    }
  }
}

function mouseClicked() {
  if (eyes.length < maxEyes) {
    let eyeRadius = random(20, 40); // Tamaño aleatorio para cada ojo
    let pupilRadius = eyeRadius * 0.5; // Tamaño de la pupila
    let x = mouseX;
    let y = mouseY; // Cambiar y a mouseY para que aparezca donde haces clic
    let eye = new Eye(x, y, eyeRadius, pupilRadius);
    eyes.push(eye);
  }
}

class Eye {
  constructor(x, y, eyeRadius, pupilRadius) {
    this.x = x;
    this.y = y;
    this.eyeRadius = eyeRadius;
    this.pupilRadius = pupilRadius;
    this.velocity = createVector(0, 0);
    this.bounceHeight = 0; // Altura de rebote inicial
  }

  applyGravity(force) {
    this.velocity.y += force;
  }

  update() {
    this.y += this.velocity.y;
    this.velocity.y *= damping;

    // Comprobar colisiones con otros ojos
    for (let i = 0; i < eyes.length; i++) {
      let other = eyes[i];
      if (other !== this) {
        let distance = dist(this.x, this.y, other.x, other.y);
        let minDistance = this.eyeRadius + other.eyeRadius;

        if (distance < minDistance) {
          // Hay colisión, ajustar posiciones
          let angle = atan2(other.y - this.y, other.x - this.x);
          let targetX = this.x + cos(angle) * (minDistance - distance) / 2;
          let targetY = this.y + sin(angle) * (minDistance - distance) / 2;
          this.x = lerp(this.x, targetX, 0.5);
          this.y = lerp(this.y, targetY, 0.5);
        }
      }
    }

    if (this.y + this.eyeRadius >= height) {
      this.y = height - this.eyeRadius;
      this.velocity.y *= -1;
      this.bounceHeight = (this.y - this.eyeRadius) - this.bounceHeight; // Actualizar la altura de rebote
    }
  }

  checkBoundary() {
    if (this.bounceHeight > 0 && abs(this.velocity.y) < 1) {
      this.velocity.y = 0; // Detener la caída después del rebote en la base
    }
  }

  display() {
    fill(255); // Color blanco para el ojo
    stroke(0); // Contorno negro para el ojo
    strokeWeight(2); // Grosor del contorno
    ellipse(this.x, this.y, this.eyeRadius * 2);

    fill(0); // Color negro para la pupila
    noStroke(); // Sin contorno para la pupila
    ellipse(this.x, this.y, this.pupilRadius * 2);
  }
}
