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
  this.size = 10;
  this.move();
};

// TODO: Move this into a common base class. Ego has it as well.
$.Bullet.prototype.findNewPos = function() {
  var endStep = this.step;// Math.round(this.step * $.Game.stepFactor);
  var currentStep = 1;
  var newXPos, newYPos;
  
  while (!this.hit && (currentStep < endStep)) {
    // Attempt to move.
    var testX = this.x + Math.cos(this.heading) * Math.round(currentStep);
    var testY = this.y + Math.sin(this.heading) * Math.round(currentStep);
    var blocked  = $.Map.circleIsBlocked(testX, testY, 1);
    
    if (!blocked) {
      newXPos = testX;
      newYPos = testY;
      currentStep++;
    } else {
      this.hit = true;
//      block = $.Map.getBlockAt(testX, testY);
//      $.Map.clearBlock(block);
    }
  }
  
  if (currentStep > 1) {
    return {newXPos: newXPos, newYPos: newYPos};
  } else {
    return null;
  }
};

/**
 * Moves this Bullet based on its current heading and step size.
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
  ctx.shadowBlur    = 20;
  for (var i=1; i<20; i+=4) {
    var tempX = this.x - Math.cos(this.heading) * i;
    var tempY = this.y - Math.sin(this.heading) * i;
    $.Util.fillCircle(ctx, 
        Math.round(tempX - offsetX - (this.size/2)), 
        Math.round(tempY - offsetY - (this.size/2)), 
        Math.round(this.size),
        'rgba(226,88,34,' + (0.2 + Math.random() * 0.6) + ')');
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};
