class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders) {
    this.#castRays();
    this.readings = [];
    for (let index = 0; index < this.rays.length; index++) {
      this.readings.push(
        this.#getReading(this.rays[index], roadBorders)
      );
    }
  }

  #getReading(ray, roadBorders) {
    let touches = [];

    for (let index = 0; index < roadBorders.length; index++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[index][0],
        roadBorders[index][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }
    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((ele) =>  ele.offset );
      const minOffset = Math.min(...offsets);
      return touches.find((ele) =>  ele.offset == minOffset );
    }
  }

  #castRays() {
    this.rays = [];
    for (let index = 0; index < this.rayCount; index++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount == 1 ? 0.5 : index / (this.rayCount - 1)
      ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let index = 0; index < this.rayCount; index++) {
      let end = this.rays[index][1];
      if (this.readings[index]) {
        end = this.readings[index];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(
        this.rays[index][0].x,
        this.rays[index][0].y
      );
      ctx.lineTo(
        end.x,
        end.y
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(
        this.rays[index][1].x,
        this.rays[index][1].y
      );
      ctx.lineTo(
        end.x,
        end.y
      );
      ctx.stroke();
    }
  }
}
