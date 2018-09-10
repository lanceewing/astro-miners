/*
 * IDEAS:
 * 
 * - Mines have energy "crystals" that usually provide the energy to drive mining machines
 * - Alien parasites awoken from hibernation within the mined minerals
 * - Alien parasites start absorbing energy from crystals
 * - Some parasites absorb blue, some green, some red, leaving all crystals discharged
 * - Automated machines shut down due to lack of power
 * - Ego can store energy in discharged crystals to bring them back online. Needs to be white to work.
 * - When all crystals in an area are white, that area brought back online
 * - Lines around edges of area glow white when area online (grey when not online)
 * - Health is shown by amount of light around ego. It reduces as health goes down.
 * - Mining machines start up when area brough back online. They start digging.
 * - Doors?
 * 
 * 
 * NEW IDEAS:
 * 
 * - You are the miner
 * - All other miners are offline
 * - When you touch another miner, they come online
 * - Online miners reflect what you do, so move in opposite directions
 * - Perhaps it depends what angle you hit them in? Or is that too open/free?
 * - Hitting blocks will destroy them, and will release particles that are hazardous to aliens
 * - Other miners only reflect what you do when they're on the screen with you, otherwise they wait
 * 
 */

/**
 * Creates a new Ego. This is the main character whom the player controls. The
 * name originates with the old Sierra On-Line 3D animated adventure games. There
 * should be only one instance of this class.
 * 
 * @constructor
 */
$.Ego = function(minerNum) {
  this.minerNum = minerNum;
  this.reset();
  this.size = $.Constants.CELL_WIDTH - 9;
  this.texture = 0.95;
  this.canvas = this.buildCanvas();
};

/**
 */
$.Ego.prototype.activate = function() {
  this.active = true;
  this.online = true;
  this.button.classList.remove('offline');
  this.button.classList.add('active');
};

/**
 * Makes a particle of the flame trail behind the ship.
 */
$.Ego.prototype.makeFlame = function(pos) {
  this.speed = {x: -1.5+Math.random()*1.5, y: -1.5+Math.random()*1.5};
  if (pos) {
    this.location = {x: pos.x, y: pos.y};
  }
  else {
    this.location = {x: this.x, y: this.y};
  }
  this.radius = ((($.Constants.CELL_WIDTH - 9) * Math.random()) / 2) + 2;
  this.life = 20+Math.random()*10;
  this.remainingLife = this.life;
};

/**
 * Resets Ego's state back to the game start state.
 */
$.Ego.prototype.reset = function() {
  this.active = false;            // Is it being controlled by player?
  this.online = false;            // Is it currently online?
  this.heading = 0;
  this.step = 10;
  this.hit = false;
  this.digging = false;
  this.wallHit = false;
  this.flame = [];
};

$.Ego.prototype.setPosition = function(x, y) {
  this.lastX = this.x = x;
  this.lastY = this.y = y;
  for (var i = 0; i < 100; i++) {
    this.flame.push(new this.makeFlame());
  }
};

/**
 * Builds the background image canvas for the Ego.
 */
$.Ego.prototype.buildCanvas = function() {
  var ctx = $.Util.create2dContext(this.size, this.size);
  ctx.drawImage($.Util.renderSphere(this.size, 1, 'white', this.texture, 'black'), 0, 0);
  return ctx.canvas;
};

$.Ego.prototype.drawFlame = function() {
  $.sctx.globalCompositeOperation = "lighter";
  
  var newFlames = [];
  
  // Store flames that need to be recreated.
  for (var i = 0; i < this.flame.length; i++) {
    var p = this.flame[i];
    p.remainingLife -= $.Game.stepFactor;
    p.radius -= $.Game.stepFactor;

    // Store flames that need to be recreated.
    if ((p.remainingLife < 0) || (p.radius < 0)) {
      newFlames.push(i);
    }
  }
  
  // Calculate dist moved, then divide per flame.
  var flamePos = {x: this.lastX, y: this.lastY};
  var flameDist = Math.round($.Util.dist(this, flamePos)) / newFlames.length;
  for (var i=0; i < newFlames.length; i++) {
    flamePos.x += Math.cos(this.heading) * flameDist;
    flamePos.y += Math.sin(this.heading) * flameDist;
    this.flame[newFlames[i]] = new this.makeFlame(flamePos);
  }
  
  // Now render the updated flames.
  for (var i = 0; i < this.flame.length; i++) {
    var p = this.flame[i];
    p.opacity = Math.round(p.remainingLife/p.life*100)/100;
    var tempX = p.location.x + Math.cos(this.heading);
    var tempY = p.location.y + Math.sin(this.heading);
    
    $.Util.fillCircle(
        $.sctx, 
        Math.round(tempX - $.ego.x - p.radius - 1),
        Math.round(tempY - $.ego.y - p.radius - 1), 
        Math.round(p.radius * 2),  
        'rgba(226, 88, 34,' + p.opacity + ')');

    p.location.x -= p.speed.x;
    p.location.y -= p.speed.y;
  }

  $.sctx.globalCompositeOperation = "source-over";  
};

/**
 * Draws the main player.
 */
$.Ego.prototype.draw = function() {
  if (this.active) {
    this.drawFlame();
  }
  
  $.sctx.drawImage(this.canvas, 
      0, 0, this.size, this.size,
      -(this.size/2), -(this.size/2), this.size, this.size);
    
  if (this.active) {
    if ($.Game.dragNow) {
      var dragDist = $.Util.dist($.Game.dragNow, $.Game.dragStart);
      var dragDuration = $.Game.dragNow.t - $.Game.dragStart.t;
      if ((dragDist > 5) && (dragDuration > 200)) {
        $.sctx.save();
        $.sctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        $.sctx.lineWidth = 1;
        $.sctx.rotate((($.Game.rotateAngle) * Math.PI / 180));
        $.sctx.moveTo(
            $.Game.dragNow.x - (~~($.Constants.WRAP_WIDTH / 2)), 
            $.Game.dragNow.y - (~~($.Constants.WRAP_HEIGHT / 2)));
        $.sctx.lineTo(0, 0);
        $.sctx.stroke();
        $.sctx.restore();
      }
    }
  }
};

$.Ego.prototype.findNewPos = function() {
  var endStep = Math.round(this.step * $.Game.stepFactor);
  var currentStep = 1;
  var newXPos, newYPos;
  
  while (this.heading != null && (currentStep < endStep)) {
    // Attempt to move.
    var testX = this.x + Math.cos(this.heading) * Math.round(currentStep);
    var testY = this.y + Math.sin(this.heading) * Math.round(currentStep);
    var hitBlocks = $.Map.getCircleHitBlock(testX, testY, this.size/2);
    
    if (hitBlocks.length == 0) {
      newXPos = testX;
      newYPos = testY;
      currentStep+=2;
    } else {
      
      var hitWall = false;
      for (var i=0; i<hitBlocks.length; i++) {
        var hitBlock = hitBlocks[i];
        if (hitBlock.type == '#') {    // Mine-able Wall
          if (!this.wallHit) {
            if (this.digging) {
              $.Map.clearBlock(hitBlock);
            }
            hitWall = true;
          } else {
            this.hitWall = false;
            this.heading = null;
          }
        } else if (hitBlock.type == '*') {   // Enemy
          // Hit an enemy.
          $.Sound.play('kill');
          var enemy = $.Game.getEnemy(hitBlock.col, hitBlock.row);
          $.Game.removeEnemy(enemy);
          $.Map.clearBlock(hitBlock);

        } else {
          this.heading = null;
        }
      }
      this.wallHit = hitWall;
      this.digging = false;
      
    }
  }
  
  if (currentStep > 1) {
    return {newXPos: newXPos, newYPos: newYPos};
  } else {
    return null;
  }
};

/**
 * Updates Ego for the current frame. 
 */
$.Ego.prototype.update = function() {
  if (this.active) {
    // The player is the only active miner, so this must be the player.
    if ($.Game.dragEnd && $.Game.dragStart) {
      $.Game.mouseButton = 0;
  
      // The player is always in the middle of the window, so we calculate the heading from that point.
      var playerScreenX = (~~($.Constants.WRAP_WIDTH / 2));
      var playerScreenY = (~~($.Constants.WRAP_HEIGHT / 2));
      var clickHeading = Math.atan2(playerScreenY - $.Game.dragEnd.y, playerScreenX - $.Game.dragEnd.x) + ((($.Game.rotateAngle + 180) % 360) * Math.PI / 180);
      var dragDist = $.Util.dist($.Game.dragEnd, $.Game.dragStart);
      var dragDuration = $.Game.dragEnd.t - $.Game.dragStart.t;
      
      $.Game.dragEnd = $.Game.dragStart = $.Game.dragNow = null;
      
      if (this.heading == null) this.heading = clickHeading;
      
      if ((dragDist > 5) && (dragDuration > 200)) {
        // If the drag distance and duration are beyond a threshold indicating there 
        // was a drag (and not just a click in place), then ego will move.
        //if (this.heading == null) this.heading = clickHeading;
        
        this.digging = true;
        
      } else {
        // The player can only fire 5 bullets at once.
  //      for (var bulletNum = 0; bulletNum < 5; bulletNum++) {
  //        if ($.Game.bullets[bulletNum] == null) {
  //          $.Game.bullets[bulletNum] = new $.Bullet(this.x, this.y, clickHeading);
  //          $.Sound.play('bomb');
  //          break;
  //        }
  //      }
        // TODO: Change bullet firing to movement without mining.
        
        this.digging = false;
      }
    }
  } else {
    // Otherwise it is one of the miners not currently being controlled, i.e. not active (but 
    // could still be online). The only thing to check for is collision with the active player,
    // since that would bring this miner online.
    if (!this.online && $.Game.running && (this != $.ego)) {
      var distToEgo = $.Util.dist($.ego, this);
      if (distToEgo <= (this.size+2)) {
        this.online = true;
        this.button.classList.remove('offline');
        $.Sound.play('online');
        // TODO: Bug in here somewhere when ego is shot and it switches.
        $.Game.showText(1, 'Miner ' + (this.minerNum+1) + ' online', true, 2500);
      }
    }
  }

  this.lastX = this.x;
  this.lastY = this.y;
  
  if (this.heading != null) {
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
