class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;           // initial speed
    this.acceleration = 0.2;  // the acceleration when the car move forward or backward
    this.maxSpeed = 3;        // the limit of speed
    this.friction = 0.05;     // the reduce of speed if no button is pressed
    this.angle = 0;           // Direction angle (in radians)

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  #move() {
    // Forward or backward movement
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    // Set maximum and minimum speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    // Friction which car face
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // The main rotation 
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    // Update the place using the corner
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.save();                    // Save the current position of the canvas
    ctx.translate(this.x, this.y); // Move the origin to the Car position
    ctx.rotate(-this.angle);       // Rotate the canvas to the Car angle

    ctx.beginPath();
    ctx.rect(
      - this.width / 2,
      - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();

    ctx.restore();               // We return the canvas to its normal position.

    this.sensor.draw(ctx);
  }
}