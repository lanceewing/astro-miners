/**
 * Creates a new Enemy, AKA the Glitch.
 * 
 * @constructor
 * @param {number} col Map column. 
 * @param {number} row Map row.
 */
$.Enemy = function(col, row) {
  this.col = (col % 152);
  this.row = (row % 104);
  this.x = this.col * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2);
  this.y = this.row * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2);
  this.key = 'e_' + col + '_' + row;
  this.canvas = this.buildCanvas(1, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
};

/**
 * Updates the Enemy for the current frame. 
 */
$.Enemy.prototype.update = function() {

};

/**
 * Draws this Enemy on the given context using the given col and row. Note
 * that this may be different from the Enemy's internal col and row due to 
 * the way that the map is doubled in both directions.
 * 
 * @param {2dContext} ctx The 2D context to draw the Enemy on.
 * @param {number} col The column to draw the Enemy at.
 * @param {number} row The row to draw the Enemy at.
 */
$.Enemy.prototype.draw = function(ctx, col, row) {
  ctx.shadowColor   = 'rgba(255, 0, 0, 1)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur    = 10;
  
  ctx.drawImage(this.canvas, 
      0, 0, 
      $.Constants.CELL_WIDTH,
      $.Constants.CELL_WIDTH / 2 + 2,
      col * $.Constants.CELL_WIDTH, 
      row * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2) - 2,
      $.Constants.CELL_WIDTH,
      $.Constants.CELL_WIDTH / 2 + 2
      );
  
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

/**
 * 
 */
$.Enemy.prototype.buildCanvas = function(seed, iconWidth, iconHeight) {
  var hashRand = [];
  var random = new $.Util.random(seed);
  for (var i=0; i<20; i++) {
    hashRand[i] = random(2147483647);
  }
  
  var ctx = $.Util.create2dContext(iconWidth, iconHeight);

  ctx.save();
  var shadowRadius = (iconWidth / 2);
  //ctx.fillStyle = 'white';
  ctx.strokeStyle = 'rgba(100, 100, 100, 1)';//'white';
  ctx.lineWidth = 2;
//  ctx.shadowColor   = 'rgba(255, 128, 128, 1)';
//  ctx.shadowOffsetX = 0;
//  ctx.shadowOffsetY = 0;
//  ctx.shadowBlur    = 30;
  
//  var gradient = ctx.createRadialGradient(shadowRadius, shadowRadius, 0, shadowRadius, shadowRadius, shadowRadius); 
//  gradient.addColorStop(0.95, 'rgba(255, 128, 128, 0.5)');
//  gradient.addColorStop(0.96, 'rgba(255, 128, 128, 0.7)'); 
//  gradient.addColorStop(0.97, 'rgba(255, 128, 128, 1)'); 
//  gradient.addColorStop(0.98, 'rgba(255, 128, 128, 1)'); 
//  gradient.addColorStop(0.99, 'rgba(255, 128, 128, 0.7)'); 
//  gradient.addColorStop(1.00, 'rgba(255, 128, 128, 0.5)'); 
//  //ctx.fillStyle = gradient; 
//  ctx.strokeStyle = gradient;
  
  ctx.beginPath();
  ctx.arc(shadowRadius, shadowRadius, shadowRadius - 1, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(shadowRadius, shadowRadius, shadowRadius - 3, 0, 2 * Math.PI);
  ctx.clip();
  
  var blockDensityX = 13;//11;//5;//17;
  var blockDensityY = 13;//11;//5;//17;
  var blockWidth = iconWidth / blockDensityX;
  var blockHeight = iconHeight / blockDensityY;
  var blockMidX = ((blockDensityX + 1) / 2);
  var blockMidY = ((blockDensityY + 1) / 2);
  
  for (var x = 0; x < blockDensityX; x++) {
    var i = x < blockMidX ? x : (blockDensityX - 1) - x;
    for (var y = 0; y < blockDensityY; y++) {
      var j = y < blockMidY ? y : (blockDensityY - 1) - y;
      if ((hashRand[i] >> j & 1) == 1) {
        //ctx.fillStyle = 'rgba(' + 
        //    (~~(hashRand[0] & 0xFF)) + ',' +
        //    (~~(hashRand[1] & 0xFF)) + ',' +
        //    (~~(hashRand[2] & 0xFF)) + ',' +
        // '0.9)';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.0)';
      }
      ctx.beginPath();
      ctx.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
      ctx.fill();
    }
  }
  
  return ctx.canvas;
};
