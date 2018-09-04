/**
 * Creates a new Bullet.
 * 
 * @constructor
 * @param {number} x The x position of the Bullet.
 * @param {number} y The y position of the Bullet (height above the ground).
 * @param {number} heading The heading that the Bullet is moving in.
 */
$.Bullet = function(x, y, heading) {
  this.x = x;
  this.y = y;
  this.heading = heading;
  this.step = 10;
  this.hit = false;
  this.size = 4;
};

// TODO: Move this into a common base class. Ego has it as well.
$.Bullet.prototype.findNewPos = function() {
  var startStep = this.step * $.Game.stepFactor;
  var currentStep = startStep;
  var foundNewPos = false;
  
  while (!foundNewPos && (currentStep > 0)) {
    console.log("currentStep: " + currentStep);
    
    // Attempt to move.
    var newXPos = this.x + Math.cos(this.heading) * Math.round(currentStep);
    var newYPos = this.y + Math.sin(this.heading) * Math.round(currentStep);
    
    var blocked = $.Map.circleIsBlocked(newXPos, newYPos, this.size/2);
    if (blocked) {
      currentStep--;
    } else {
      foundNewPos = true;
    }
  }
  
  if (currentStep != startStep) {
    this.hit = true;
  }
  
  if (foundNewPos) {
    return {newXPos: newXPos, newYPos: newYPos};
  } else {
    return null;
  }
};

/**
 *         this.bullets[bulletNum].move();Moves this Bullet based on its current heading and step size.
 */
$.Bullet.prototype.move = function() {
  if (this.heading != null && !this.hit) {
    var newPos = this.findNewPos();
    if (newPos) {
      // Apply the new position.
      this.y = newPos.newYPos;
      this.x = newPos.newXPos;
    
      // Check the map bounds for wrap around.
      if (this.x < 0) {
        // Increment by width of room in pixels.
        this.x += $.Constants.ROOM_X_PIXELS;
      }
      if (this.y < 0) {
        // Increment by height of room in pixels.
        this.y += $.Constants.ROOM_Y_PIXELS;
      }
      if (this.x >= $.Constants.ROOM_X_PIXELS) {
        // Decrement by width of room in pixels.
        this.x -= $.Constants.ROOM_X_PIXELS;
      }
      if (this.y >= $.Constants.ROOM_Y_PIXELS) {
        // Decrement by height of room in pixels.
        this.y -= $.Constants.ROOM_Y_PIXELS;
      }
    }
  }
};

/**
 * Draws the bullet.
 */
$.Bullet.prototype.draw = function(ctx, offsetX, offsetY) {
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor   = 'rgba(226,88,34, 1)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur    = 10;
  var bulletLength = this.step*5;
  for (var i=0; i<bulletLength; i+=2) {
    var tempX = this.x - Math.cos(this.heading) * i;
    var tempY = this.y - Math.sin(this.heading) * i;
    $.Util.fillCircle(ctx, 
        Math.round(tempX - offsetX - (this.size/2)), 
        Math.round(tempY - offsetY - (this.size/2)), 
        Math.round(this.size * (bulletLength-i)/bulletLength),  
        'rgba(226,88,34,' + (0.2 + Math.random() * 0.6) + ')');
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};
