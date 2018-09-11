/**
 * Represents the game Map.
 */
$.Map = {

  /**
   * Canvas for the Map.
   */
  canvas: null,
  
  /**
   * 2D context for the Map canvas.
   */
  context: null,

  /**
   * Initialises the Map state for the start of a game.
   */
  init: function() {
    this.data = this.map.split('');
    this.canvas = document.createElement('canvas');
    this.canvas.width = 152 * $.Constants.CELL_WIDTH * 2;
    this.canvas.height = 104 * $.Constants.CELL_WIDTH * 2;
    this.context = this.canvas.getContext('2d');
    this.draw();
  },
  
  /**
   * The actual raw map data for the game. 
   * 
   * #   = Wall
   * *   = Enemy positions
   * 0-9 = Miner positions
   */
  map:  '########################################################################################################################################################'
      + '##########     0##   #################        ###########  ############     ##############  ########  #####     ################################ ### ###'
      + '##########            ##############           #########     #########       ############    #######   ####     ##########        ###### # ###    ## ###'
      + '##########             ############      #      ######        ### ####          #########   ######### #####  #############        #####          #######'
      + '###########             ############    ####    ######        ###  ####          #########  ######### ####################        #####          #######'
      + '############             ############    ####   ######       ############        ###############      ###################         #####          #######'
      + '############    ###       ############# ###### #########     ############         ###   ####          #################    ####    ####           ######'
      + '#############   #####      ##############################   ##########                  ####         #################     ######  #####           #####'
      + '##############   #####      ####   ######################    ########                   #####        ############ ####    ########  ####    ##      ####'
      + '##############   #######   *###     ##### ###############          ##                    ####  ###   ######        ###    #########  ##    ####      ###'
      + '#############     ######    ##       ###   ######     ####         ###      ##            ########    #####       ####     ########       ######      ##'
      + '#3  #########     ####1     ##       ##     #####     ####          ##   #####             ######      ####    #######     #########     ##########    #'
      + '#    ########       ##      ###      ##     ####     ####               ######       #      ####         #     #######      #########   ############   #'
      + '##   ## ####       ###      ###      ###   ####      ####       ###    ####          ##            #           #######      ##########  ###########    #'
      + '##                 #####   5####     ###  ###       #####       ####  ####      ##                ###           #####       #########    ########      #'
      + '#        ###       ##############     ##   ##       ########     #########     ####       #      ####            ####       ######         ######     ##'
      + '##4 #######2      #################                ##########     ########     ####       #  #   ###             ###       #####           ######    ###'
      + '#########        ##################                ##########     #######      ####   #      #         #######   ###       ####           ########  ####'
      + '#######         ####################               ##########     #######      ###   ###              ########   ###        ####         ###############'
      + '######         #########################*         #########       ####### ##  ###   ####             #########   ####     #########      ###    ########'
      + '#####         ##########################          ########        ##############    ####         #########  ##  ######    ##########     ##      ###   #'
      + '####    7     ####  ##################             #######   #   ##############     ####        ##########      ####### ############     ##            #'
      + '###    ##      ##    ############  ###       #      ######  ###  ############       #####      ####### ###     ######     ###########   ####           #'
      + '##     ###     ##     ###########  ####      ##     ######  ###   ####  ####         ######    ######   ##    ######      ##################       ## ##'
      + '##      ###   6##      ###################   ###   #######  #### #####  ####         #######    #####    #    #####       #######   ########    ########'
      + '##       ########      ###################    ##   ######    #########   ###         ########      #          #####      #######    ######### ##########'
      + '##   #    #######      ###   #############     ####  ####    #########   ###         #########               ###################    ####################'
      + '##  ###    ######     ###     ############     ####  ####    ########## #####       #############            ###################   #####################'
      + '#  ####     ####     ####     ###########   ##############   ###############      ################           ###     ####  #####  ### ##########  ######'
      + '#8 ####      ###    #####     ########    ####################### ##########     ##################          ##             ##### ##   ########    #####'
      + '#######      ###    #####    #######     #######################   ########     ###################                         ########    ########  ######'
      + '#######       ###  #####     ####       #################### ##     ######      ###################                        ########      ###############'
      + '######        ##    #                  ####################         ######   #####################        #                #######        ##############'
      + '#####                                 ######################        ######  #################  ###       ###   #           ######          #############'
      + '#####                                #############   ########      ####### ##################   #   #     ##  ###           ####            ######### ##'
      + '#  ##       *         #              ############    ########    #####################   ####      ###    ##   #           #####            ########   #'
      + '#  ### 9#####        ###               #########    #### #############################    ##       ####                    ####             #######    #'
      + '#  ##########    #  ##### ###           ####   ##   ##    ######### ##################              ####             #     ####        ##   #####      #'
      + '##  #########   ############       *           ###        ########   ################                ####           ###     ###              ##        #'
      + '##     ####### #############       ##         ####     ###  ######    ##############                  ###           ###        #####                   #'
      + '##      #############   #####     #####       ##     #####  #####         ######              #####   ###   ####     #         ######                  #'
      + '###     ###########      #####   #########           ####    ##           #####     ##       ######   ###########        ##    #######     #######     #'
      + '###   #  ##########       #################           #                   ####     ####     ######    #############     ####   ########    ########   ##'
      + '###  #########      #       ######   ########                            #####    ###### #########     #####   #####    ####    ########    ############'
      + '#############      ###      #####     ########    ##               ##    ####     ################      ###     #############   #######      ###########'
      + '##############     ###     #####      ########    ###             ###    ####     ###############       ##     ###############  ######       ###########'
      + '##############     ####    ##### ########  ###    ####          #####     ##     #####  #####  ##             ###  ############ #####        ####  #####'
      + '##############      ####    ############          ####    ##########     ###      ###    #### ###             ##    #####   ########         ###    ####'
      + '##############      ######   ###########          ###     #########   ######              ##  ####           ###    #####    ######          ###    ####'
      + '#############        ######   ##########         ####      #######    ######                   ####        ######    ###     #####            ##     ###'
      + '######   ####        #######   #########         ####      #######    ######                     ###   ##  ######      ##    #####      ###   ###     ##'
      + '#####   #####        #######   ###   ####       #####     ########    ########               #    ######## ######      ###   ####      ####   ###     ##'
      + '#####   ####     ###########  ###     ###    ########     ########## ##########             ###   #######   #####     #####   ###    ####### #####   ###'
      + '###### #####     ############ ####     ##   #########     #######  ############        ##   ####  ########  #####    #######   #    ############### ####'
      + '############     #################     ###   ##  #####   #######   ###########        ###  #####  #########  ####    ########       ####################'
      + '##############  ###########  ####      ###        ##############  ############       ####  #####   ########   ##     #########       ###################'
      + '############################ ###       ###         ##################    #####      #####  ####    ########         #####  ###       ############   ####'
      + '##  ##########################          ###             ############     #####  #########  ####   ########          ####    #    ###############     ###'
      + '#    #########################    ###    #               ###########      ####################   #########           ##          ################    ###'
      + '#   #########################   ######                   ##########      #####################  #######              ##          #################    ##'
      + '#############################  ########    ##            ##########      ############  ##############                ##          ###################   #'
      + '######################  ####    ##  ####  ####            #######       ############      ##########    #    ###     ##           ################### ##'
      + '#####################    ###         #########             #####       ###      ####       #########   ###  ####     ##           ######################'
      + '##   #################               #########              ###       ###        ###        #######   ####  ####     #     ##     ########## ###########'
      + '#     ################                #########              #    #######         ##         ######  ######  ##    ##     ####     ########   ##########'
      + '#      ##  #######  ##                ##########                ########             ###             ######       ###     #####       ###    ###########'
      + '#      ##   ###########          ### ###########               ########               ###           ########     #####   #########           ###########'
      + '#            ##########         ################               ########    ###        #####        ########      #####   ##########          ###########'
      + '#  ##           #######       #################        ####    ########    ######      ######      #######      ####################     ##    #### ####'
      + '#  ###           ######       ######  #######          ###### #########      #####     #######     ###       ########################    ###    ##    ##'
      + '#  ###            ######       #####   #####           ################        ##      ########    ###      ##################### ####   ####         ##'
      + '#                ########        ###    ###            ################                 #######    ###      ####################   ###   #####        ##'
      + '#         ##    #########         ###                   ###############                  #######  ####       ###################          #####     ####'
      + '##     #        #########         ###                    ##############              ##   ############       ###################           ###     #####'
      + '##   #####        ######      #######                     ############              ####       ######   ###  ####################                  #####'
      + '##   #####          ##        ##########   ##  #          #######                    ##         ####    ###  ####################   #              #####'
      + '### #########                ####################         ######        ########                ###     ###   ###################  ###             #####'
      + '##############                ##################        ########       ##########               ##      #########################  ###             #####'
      + '##############     #          ##################    #    #######     #############             ####     ###################  ##########            #####'
      + '##############    ##          #############   ###   ###    ####     ##############     ###    ######   ####################   #########  ##       ######'
      + '########   ##    ###   ###    ### #########    #     ####           #####   #####     ####    #############################    ##############     ######'
      + '#######         ####  ####   ###   #######           #####           ####    ###     #####   #############        #   #####    #######   #####    ######'
      + '######          #########   ###    ######           ########         ####    ###     ####    #############            ##  ##    #####     ####   #######'
      + '#####           #########   ###   ########  ##     ##### ####        ####    ###      ##    ##############           ###   #     #######   ##   ########'
      + '####            ########     #   ##############     ###   ####      ######   ####          ################     ###### # #####    #######       ####  ##'
      + '########         ######         ################          ####     #######   #### #       ##################    ###### ###   #    ######       #####   #'
      + '#########         ###          ########### #####           ###     #######    ######      ###################   #####        ### ######       ####### ##'
      + '##########        ###  ####   ######  #### ######          ####    ######      ######      ############  ###    #####        #######         ###########'
      + '###### ##        ##################    ##########          ####    ####       #######        ####  ###         ######        ######          ###   #####'
      + '#####            #################    ############        ######  ####       #########        #    ###        ######        ######           ###     ###'
      + '######           #####       ####    ################    #############      ##########          # ###        ###            ######             #     ###'
      + '##########        ##                 ######### ######   ###############     #########          ######     #####         #   ######       #######     ###'
      + '############                        #########   ####    ################     #######           #####     ######        ############     ########    ####'
      + '#############         ###          ###########   ###     ##################   ##### ##          ##        #####       #############     #### ####  #####'
      + '########  ####        ######       ############ #####    ###################  ####  ##                    #####      #############      ###   ##########'
      + '#######              #########     ####################   ###   ############ ####   ##                    #####     ##############            ##########'
      + '#######              ##########    ###  ################          ######## #####                         ######     ###  ##### ####            #########'
      + '########            ############   ##    #  #############          ######   ###             ####      ##########     #    ###   ####           #########'
      + '#########          ##################   ###   ###########           #####   ###            #####      #########          ####  ######            #######'
      + '##########         #########  #######   ###    ##########            ###    ##           #######      ####  ### #       ##### ########            ######'
      + '## #######          #######     ######   ##    ##########    ###     ##    ####      #######          ###              #################          ######'
      + '#   #####            #####        ####         ###  #####   ####    ###   ####       #######        ####              ##################         #######'
      + '#            ####           ###                 #    ############  ###   #####       ########      ####               ##################         #######'
      + '########################################################################################################################################################',
      
  /**
   * An array of the raw map data. Populated initially from the string above.
   */
  data: [],
  
  /**
   * Gets the Block at the given x and y pixel position (i.e. not column and row). The 
   * x/y pixel position will value within a block in the map grid.
   * 
   * @param {number} x The x pixel position to get the Block for.
   * @param {number} y The y pixel position to get the Block for.
   * 
   * @returns {$.Block}
   */
  getBlockAt: function(x, y) {
    var col = (~~(((x + $.Constants.ROOM_X_PIXELS) % $.Constants.ROOM_X_PIXELS) / $.Constants.CELL_WIDTH));
    var row = (~~(((y + $.Constants.ROOM_Y_PIXELS) % $.Constants.ROOM_Y_PIXELS) / $.Constants.CELL_WIDTH));
    var type = this.data[row * 152 + col];
    return new $.Block(col, row, type);
  },
  
  /**
   * Is the circle at position x,y of radius r blocked by a wall block? 
   */
  circleIsBlocked: function(x, y, r) {
    var bottomRightBlock = $.Map.getBlockAt(x + r, y + r);
    var topRightBlock = $.Map.getBlockAt(x + r, y - r);
    var topLeftBlock = $.Map.getBlockAt(x - r, y - r);
    var bottomLeftBlock = $.Map.getBlockAt(x - r, y + r);
    if ((bottomRightBlock.type == '#') && (this.blockCircleColliding(x, y, r, bottomRightBlock))) {
      return true;
    } else if ((topRightBlock.type == '#') && (this.blockCircleColliding(x, y, r, topRightBlock))) {
      return true;
    } else if ((topLeftBlock.type == '#') && (this.blockCircleColliding(x, y, r, topLeftBlock))) {
      return true;
    } else if ((bottomLeftBlock.type == '#') && (this.blockCircleColliding(x, y, r, bottomLeftBlock))) {
      return true;
    } else {
      return false;
    }
  },
  
  /**
   * 
   */
  getCircleHitBlock: function(x, y, r) {
    var hitBlocks = [];
    var bottomRightBlock = $.Map.getBlockAt(x + r, y + r);
    var topRightBlock = $.Map.getBlockAt(x + r, y - r);
    var topLeftBlock = $.Map.getBlockAt(x - r, y - r);
    var bottomLeftBlock = $.Map.getBlockAt(x - r, y + r);
    if ((bottomRightBlock.type != ' ') && (this.blockCircleColliding(x, y, r, bottomRightBlock))) {
      hitBlocks.push(bottomRightBlock);
    }
    if ((topRightBlock.type != ' ') && (this.blockCircleColliding(x, y, r, topRightBlock))) {
      hitBlocks.push(topRightBlock);
    }
    if ((topLeftBlock.type != ' ') && (this.blockCircleColliding(x, y, r, topLeftBlock))) {
      hitBlocks.push(topLeftBlock);
    }
    if ((bottomLeftBlock.type != ' ') && (this.blockCircleColliding(x, y, r, bottomLeftBlock))) {
      hitBlocks.push(bottomLeftBlock);
    }
    return hitBlocks;
  },
  
  /**
   * 
   */
  blockCircleColliding: function(circleX, circleY, radius, block) {
    var rectW = $.Constants.CELL_WIDTH;
    var rectH = $.Constants.CELL_WIDTH;
    var rectX = block.col * $.Constants.CELL_WIDTH;
    var rectY = block.row * $.Constants.CELL_WIDTH;
    
    var distX = Math.abs(circleX - rectX-rectW/2);
    var distY = Math.abs(circleY - rectY-rectH/2);

    if (distX > (rectW/2 + radius)) { return false; }
    if (distY > (rectH/2 + radius)) { return false; }
    
    if (distX <= (rectW/2)) { return true; } 
    if (distY <= (rectH/2)) { return true; }

    var dx = distX-rectW/2;
    var dy = distY-rectH/2;
    return (dx*dx + dy*dy <= (radius * radius));
  },
  
  /**
   * Updates the map array using the information in the given Block. It contains the
   * column and row to update, and the block type to set that position to.
   * 
   * @param {$.Block} block The Block to get the details from to use in the update. 
   */
  putBlock: function(block) {
    this.data[block.row * 152 + block.col] = block.type;
  },
  
  /**
   * @returns The currently active canvas.
   */
  getCanvas: function() {
    return this.canvas;
  },
  
  /**
   * Clears map grid position identified by the given Block.
   * 
   * @param {$.Block} block The Block that identifies the map position to clear.
   */
  clearBlock: function(block) {
    var ctx = this.context;
    ctx.clearRect(block.col * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect(block.col * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect((block.col + 152) * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect((block.col + 152) * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    block.type = ' ';
    this.putBlock(block);
    this.updateSideBlocks(block);
  },
  
  updateSideBlocks: function(block) {
    var ctx = this.context;
    for (var col = block.col; col <= (block.col + 152); col += 152) {
      for (var row = block.row; row <= (block.row + 104); row += 104) {
        this.drawBlock(ctx, (col == 0? 151 : col - 1), row);
        this.drawBlock(ctx, col, (row == 0? 103 : row - 1));
        this.drawBlock(ctx, (col + 1) % 304, row);
        this.drawBlock(ctx, col, ((row + 1) % 208));
      }
    }
  },
  
  drawBlock: function(ctx, xx, yy) {
    var dataX = (xx % 152);
    var dataY = (yy % 104);
    var block = this.data[dataY * 152 + dataX];
    if (block == '#') {
      ctx.fillStyle = '#22160B';
      ctx.strokeStyle = '#22160B';
      ctx.beginPath();
      ctx.rect(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH - 1, $.Constants.CELL_WIDTH - 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(100, 100, 100, 1)';

      if (this.data[(((dataY + 104) - 1) % 104) * 152 + dataX] != '#') {
        ctx.beginPath();
        ctx.moveTo(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH + 1);
        ctx.lineTo((xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH), yy * $.Constants.CELL_WIDTH + 1);
        ctx.closePath();
        ctx.stroke();
      }
      if (this.data[dataY * 152 + ((dataX + 1) % 152)] != '#') {
        ctx.beginPath();
        ctx.moveTo((xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH) - 1, yy * $.Constants.CELL_WIDTH);
        ctx.lineTo((xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH) - 1, (yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH) - 1);
        ctx.closePath();
        ctx.stroke();
      }
      if (this.data[((dataY + 1) % 104) * 152 + dataX] != '#') {
        ctx.beginPath();
        ctx.moveTo((xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH) - 1, (yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH) - 1);
        ctx.lineTo(xx * $.Constants.CELL_WIDTH, (yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH) - 1);
        ctx.closePath();
        ctx.stroke();
      }
      if (this.data[dataY * 152 + (((dataX + 152) - 1) % 152)] != '#') {
        ctx.beginPath();
        ctx.moveTo(xx * $.Constants.CELL_WIDTH + 1, (yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH));
        ctx.lineTo(xx * $.Constants.CELL_WIDTH + 1, yy * $.Constants.CELL_WIDTH);
        ctx.closePath();
        ctx.stroke();
      }
    } else if (block == '*') {
      var enemy = $.Game.getEnemy(dataX, dataY);
      if (!enemy) {
        enemy = new $.Enemy(dataX, dataY);
        $.Game.addEnemy(enemy);
      }
      enemy.draw(ctx, xx, yy);
    } else if ((block >= '0') && (block <= '9')) {
      var minerNum = parseInt(block);
      if ((xx < 152) && (yy < 104)) {
        // Reset the miner's initial position.
        miner = $.Game.miners[minerNum];
        miner.reset();
        miner.setPosition(
          (xx % 152) * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2),
          (yy % 104) * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2)
        );
        this.data[dataY * 152 + dataX] = ' ';
      }
    }
  },
  
  /**
   * Uses the map data array to render the Map to the given canvas.
   */
  draw: function() {
    var xx, yy;
    for (xx = 0; xx < 304; xx++) {
      for (yy = 0; yy < 208; yy++) {
        this.drawBlock(this.context, xx, yy);
      }
    }
  }
};