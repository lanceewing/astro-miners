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
  this.positions = [];
  this.positions.push({x: this.x, y: this.y});
  this.hit = false;
};

/**
 * Moves this Bullet based on its current heading and step size.
 */
$.Bullet.prototype.move = function() {
  this.x += Math.cos(this.heading) * Math.round(this.step);
  this.y += Math.sin(this.heading) * Math.round(this.step);
  
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
};

/**
 * Draws the bullet using its previous positions to create a streaking comet effect.
 */
$.Bullet.prototype.draw = function(ctx, offsetX, offsetY) {
  for (var i=0; i<(this.step*5); i+=2) {
    var tempX = this.positions[0].x + Math.cos(this.heading) * Math.round(i);
    var tempY = this.positions[0].y + Math.sin(this.heading) * Math.round(i);
    $.Util.fillCircle(ctx, tempX - offsetX, tempY - offsetY, 5 * i/(this.step*5),  'rgba(255,255,200,' + (0.3 * (i/(this.step*5))) + ')');
  }
  
  // Remember the last 5 draw positions. May or may not need them :-)
  this.positions.push({x: this.x, y: this.y});
  if (this.positions.length > 5) {
    this.positions = this.positions.slice(-5);
  }
};
