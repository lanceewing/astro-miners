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
};

/**
 * Updates the Enemy for the current frame. 
 */
$.Enemy.prototype.update = function() {
//  this.grow($.Map.getBlockAt(this.x - $.Constants.CELL_WIDTH, this.y));
//  this.grow($.Map.getBlockAt(this.x + $.Constants.CELL_WIDTH, this.y));
//  this.grow($.Map.getBlockAt(this.x, this.y - $.Constants.CELL_WIDTH));
//  this.grow($.Map.getBlockAt(this.x, this.y + $.Constants.CELL_WIDTH));
//  this.grow($.Map.getBlockAt(this.x - $.Constants.CELL_WIDTH, this.y - $.Constants.CELL_WIDTH));
//  this.grow($.Map.getBlockAt(this.x + $.Constants.CELL_WIDTH, this.y - $.Constants.CELL_WIDTH));
//  this.grow($.Map.getBlockAt(this.x - $.Constants.CELL_WIDTH, this.y + $.Constants.CELL_WIDTH));
//  this.grow($.Map.getBlockAt(this.x + $.Constants.CELL_WIDTH, this.y + $.Constants.CELL_WIDTH));
};

/**
 * Grows randomly in to the given block.
 * 
 * @param {$.Block} block The block that we may grow in to.
 */
$.Enemy.prototype.grow = function(block) {
  if (block.type == ' ') {
    if ($.Util.random(2000) == 0) {
      var enemy = new $.Enemy(block.col, block.row);
      $.Game.addEnemy(enemy);
      $.Map.drawEnemy(enemy);
      block.type = '*';
      $.Map.putBlock(block);
    }
  }
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
  // The Glitch is drawn in a horrible orange and green mixture (mixed randomly).
  ctx.fillStyle = 'rgba(255, 102, 0,' + (0.4 + (0.6 * Math.random())) + ')';
//  ctx.shadowColor   = 'rgba(0, 255, 0, 1)';
//  ctx.shadowOffsetX = 0;
//  ctx.shadowOffsetY = 0;
//  ctx.shadowBlur    = 20;
  ctx.beginPath();
  ctx.rect(col * $.Constants.CELL_WIDTH + 1, row * $.Constants.CELL_WIDTH + 1, $.Constants.CELL_WIDTH - 2, $.Constants.CELL_WIDTH - 2);
  ctx.closePath();
  ctx.fill();
//  ctx.shadowColor = 'rgba(0,0,0,0)';
//  ctx.shadowBlur = 0;
//  ctx.shadowOffsetX = 0;
//  ctx.shadowOffsetY = 0;
};
