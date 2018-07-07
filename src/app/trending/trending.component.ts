import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery/dist/jquery.min.js';

@Component({
  selector: 'trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css'],
  // might break css in future
  encapsulation: ViewEncapsulation.None
})
export class TrendingComponent implements OnInit {
  private title: string = 'Trending';
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private radius: number;
  private dx: number;
  private dy: number;
  private collisionBoxesArray = [];
  private currentFrameCount: number = 0;
  private fps: number = 0;
  private canvasWidth: number;
  private canvasHeight: number;

  private collisionBoxLifeLimit = 3 * 60;
  constructor() {
  }

  ngOnInit() {
    var canvas = document.createElement('canvas');
    this.canvasWidth = 1000;
    this.canvasHeight = 500;
    // this.canvasHeight = window.innerHeight;
    this.canvasWidth = window.innerWidth;
    canvas.height = this.canvasHeight;
    canvas.width = this.canvasWidth;

    var bodyElement = document.getElementsByClassName("main")[0];
    bodyElement.appendChild(canvas);
    this.ctx = canvas.getContext('2d');

    this.x = 300;
    this.y = 300;
    this.radius = 50;
    
    this.dx = 3;
    this.dy = 5;
    this.drawCircle();
    setInterval(this.logFps.bind(this), 1000);
  }

  drawCircle() {
    this.currentFrameCount++;

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.ctx.fillStyle = '#231123';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    this.ctx.fill();

    if (this.x + this.radius > this.canvasWidth ||
      this.x - this.radius < 0) {
      this.dx = -this.dx;
      if (this.x + this.radius > this.canvasWidth)
        this.collisionBoxesArray.push({
          x: this.x + this.radius,
          y: this.y,
          lifeCount: 0
        });
      else
        this.collisionBoxesArray.push({
          x: this.x - this.radius,
          y: this.y,
          lifeCount: 0
        });
    }

    if (this.y + this.radius > this.canvasHeight ||
      this.y - this.radius < 0) {
      this.dy = -this.dy;
      if (this.y + this.radius > this.canvasHeight)
        this.collisionBoxesArray.push({
          x: this.x,
          y: this.y + this.radius,
          lifeCount: 0
        });
      else
      this.collisionBoxesArray.push({
        x: this.x,
        y: this.y - this.radius,
        lifeCount: 0
      });
    }

    this.x += this.dx;
    this.y += this.dy;
    this.drawCollisionBoxes.bind(this)();
    this.drawString.bind(this)();

    window.requestAnimationFrame(this.drawCircle.bind(this));
    // setTimeout(
    //   function() {
    //     this.drawCircle.bind(this)();
    //   }.bind(this)
    // , 10);
  }

  drawCollisionBoxes() {
    var count = 0;
    for (count = 0; count < this.collisionBoxesArray.length; count++) {
      var box = this.collisionBoxesArray[count];
      if (!box)
        continue;
      if (box.lifeCount < this.collisionBoxLifeLimit) {
        box.lifeCount++;
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(225, 0, 0, ' + 0.7 * (1 - (box.lifeCount / this.collisionBoxLifeLimit)) + ')';
        this.ctx.arc(box.x, box.y, 500 * (box.lifeCount / this.collisionBoxLifeLimit)/2 + 20, 0, 2*Math.PI);
        this.ctx.fill();
      } else {
         delete this.collisionBoxesArray[count];
      }
    }
  }

  drawString() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.quadraticCurveTo(300, 200, this.x, this.y);
    this.ctx.stroke();
  }

  logFps() {
    this.fps = this.currentFrameCount;
    this.currentFrameCount = 0;
  }
}
