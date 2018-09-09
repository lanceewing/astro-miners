/**
 * Represents the game Map.
 */
$.Map = {

  /**
   * Array of the two canvases that we swap between when the Glitch grows.
   */
  canvases: [],
  
  /**
   * The currently active canvas.
   */
  canvasNum: 0,
  
  /**
   * The 2d contexts for the two canvases.
   */
  contexts: [],
  
  /**
   * Initialises the Map state for the start of a game.
   */
  init: function() {
    this.data = this.map.split('');
    this.canvases = [];
    this.canvasNum = 0;
    this.contexts = [];
    
    for (var i=0; i<2; i++) {
      this.canvases[i] = document.createElement('canvas');
      this.canvases[i].width = 152 * $.Constants.CELL_WIDTH * 2;
      this.canvases[i].height = 104 * $.Constants.CELL_WIDTH * 2;
      this.contexts[i] = this.canvases[i].getContext('2d');
    }
    
    // TODO: It seems that the visible canvas is slower to draw to??
    this.draw(0);
    setTimeout(function() {
      $.Map.draw(1);
    }, 1);
  },
  
  /**
   * The actual raw map data for the game. 
   * 
   * # = Wall
   * * = Glitch positions
   */
  map:  '########################################################################################################################################################'
      + '##########      ##   #################        ###########  ############     ##############  ########  #####     ################################ ### ###'
      + '##########0           ##############           #########     #########       ############    #######   ####     ##########        ###### # ###    ## ###'
      + '##########             ############      #      ######        ### ####          #########   ######### #####  #############        #####          #######'
      + '###########             ############    ####    ######        ###  ####          #########  ######### ####################        #####          #######'
      + '############    *        ############    ####   ######       ############        ###############      ###################         #####          #######'
      + '############    ###       ############# ###### #########     ############         ###   ####          #################    ####    ####           ######'
      + '#############   #####      ##############################   ##########                  ####         #################     ######  #####           #####'
      + '##############   #####      ####   ######################    ########                   #####        ############ ####    ########  ####    ##      ####'
      + '##############   #######    ###     ##### ###############          ##                    ####  ###   ######        ###    #########  ##    ####      ###'
      + '#############     ######    ##       ###   ######     ####         ###      ##            ########    #####       ####     ########       ######      ##'
      + '#3  #########     ####1     ##       ##     #####     ####          ##   #####             ######      ####    #######     #########     ##########    #'
      + '#    ########       ##      ###      ##     ####     ####               ######       #      ####         #     #######      #########   ############   #'
      + '##   ## ####       ###      ###      ###   ####      ####       ###    ####          ##            #           #######      ##########  ###########    #'
      + '##                 #####   5####     ###  ###       #####       ####  ####      ##                ###           #####       #########    ########      #'
      + '#        ###       ##############     ##   ##       ########     #########     ####       #      ####            ####       ######         ######     ##'
      + '##4 #######2      #################                ##########     ########     ####       #  #   ###             ###       #####           ######    ###'
      + '#########        ##################                ##########     #######      ####   #      #         #######   ###       ####           ########  ####'
      + '#######         ####################               ##########     #######      ###   ###              ########   ###        ####         ###############'
      + '######         #########################          #########       ####### ##  ###   ####             #########   ####     #########      ###    ########'
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
      + '#  ##                 #              ############    ########    #####################   ####      ###    ##   #           #####            ########   #'
      + '#  ### 9#####        ###               #########    #### #############################    ##       ####                    ####             #######    #'
      + '#  ##########    #  ##### ###           ####   ##   ##    ######### ##################              ####             #     ####        ##   #####      #'
      + '##  #########   ############                   ###        ########   ################                ####           ###     ###              ##        #'
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
   * Tests if the given x/y pixel position is blocked by a wall block.
   * 
   * @param {number} x The x position to test.
   * @param {number} y The y position to test.
   * 
   * @returns {Boolean}
   */
  isBlocked: function(x, y) {
    return (this.getBlockAt(x, y).type == '#');
  },
  
  /**
   * 
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
    if ((bottomRightBlock.type == '#') && (this.blockCircleColliding(x, y, r, bottomRightBlock))) {
      hitBlocks.push(bottomRightBlock);
    }
    if ((topRightBlock.type == '#') && (this.blockCircleColliding(x, y, r, topRightBlock))) {
      hitBlocks.push(topRightBlock);
    }
    if ((topLeftBlock.type == '#') && (this.blockCircleColliding(x, y, r, topLeftBlock))) {
      hitBlocks.push(topLeftBlock);
    }
    if ((bottomLeftBlock.type == '#') && (this.blockCircleColliding(x, y, r, bottomLeftBlock))) {
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
    return this.canvases[this.canvasNum];
  },
  
  /**
   * @returns The currently active 2d context for the active canvas.
   */
  getContext: function() {
    return this.contexts[this.canvasNum];
  },
  
  /**
   * Draws the given Enemy to the Map's canvases.
   * 
   * @param {$.Enemy} enemy The Enemy to draw.
   */
  drawEnemy: function(enemy) {
    enemy.draw(this.contexts[0], enemy.col, enemy.row);
    enemy.draw(this.contexts[0], enemy.col, enemy.row + 104);
    enemy.draw(this.contexts[0], enemy.col + 152, enemy.row);
    enemy.draw(this.contexts[0], enemy.col + 152, enemy.row + 104);
    enemy.draw(this.contexts[1], enemy.col, enemy.row);
    enemy.draw(this.contexts[1], enemy.col, enemy.row + 104);
    enemy.draw(this.contexts[1], enemy.col + 152, enemy.row);
    enemy.draw(this.contexts[1], enemy.col + 152, enemy.row + 104);
  },
  
  /**
   * Clears map grid position identified by the given Block.
   * 
   * @param {$.Block} block The Block that identifies the map position to clear.
   */
  clearBlock: function(block) {
    var ctx = this.contexts[0];
    ctx.clearRect(block.col * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect(block.col * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect((block.col + 152) * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect((block.col + 152) * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx = this.contexts[1];
    ctx.clearRect(block.col * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect(block.col * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect((block.col + 152) * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
    ctx.clearRect((block.col + 152) * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
  
//    ctx.fillStyle = 'black';
//    ctx.beginPath();
//    ctx.rect(block.col * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.rect(block.col * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.rect((block.col + 152) * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.rect((block.col + 152) * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    
//    ctx = this.contexts[1];
//    ctx.fillStyle = 'black';
//    ctx.beginPath();
//    ctx.rect(block.col * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.rect(block.col * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.rect((block.col + 152) * $.Constants.CELL_WIDTH, block.row * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
//    ctx.beginPath();
//    ctx.rect((block.col + 152) * $.Constants.CELL_WIDTH, (block.row + 104) * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
//    ctx.closePath();
//    ctx.fill();
    
    block.type = '.';
    this.putBlock(block);
    this.updateSideBlocks(block,false);
  },
  
  /**
   * Swaps the two canvases so that the one that is currently active becomes 
   * inactive and the other becomes active.
   */
  swap: function() {
    this.canvasNum = (this.canvasNum + 1) % 2;
  },
  
  updateSideBlocks: function(block, debug) {
    for (var c = 0; c<2; c++) {
      var ctx = this.contexts[c];
      for (var col = block.col; col <= (block.col + 152); col += 152) {
        for (var row = block.row; row <= (block.row + 104); row += 104) {
          this.drawBlock(ctx, (col == 0? 151 : col - 1), row, (debug? 'blue' : false));
          this.drawBlock(ctx, col, (row == 0? 103 : row - 1), (debug? 'green' : false));
          this.drawBlock(ctx, (col + 1) % 304, row, (debug? 'red' : false));
          this.drawBlock(ctx, col, ((row + 1) % 208), (debug? 'magenta' : false));
        }
      }
    }
  },
  
  drawBlock: function(ctx, xx, yy, debug) {
    var dataX = (xx % 152);
    var dataY = (yy % 104);
    var block = this.data[dataY * 152 + dataX];
    if (debug) {
      console.log('debug colour: ' + debug + ", block: " + block + ", yy: " + yy);
      ctx.strokeStyle = debug;
      ctx.beginPath();
      ctx.rect(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH - 1, $.Constants.CELL_WIDTH - 1);
      ctx.closePath();
      ctx.stroke();
    }
    if (block == '#') {
      ctx.fillStyle = '#22160B';
      ctx.strokeStyle = '#22160B';
      ctx.beginPath();
      ctx.rect(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH - 1, $.Constants.CELL_WIDTH - 1);
      ctx.closePath();
      ctx.fill();
      if (!debug) {
        ctx.stroke();
      }
      
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
        if (minerNum > 0) {
          // We do not reset the main player, as that makes it inactive.
          miner.reset();
        }
        miner.lastX = miner.x = (xx % 152) * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2);
        miner.lastY = miner.y = (yy % 104) * $.Constants.CELL_WIDTH + ($.Constants.CELL_WIDTH / 2);
        console.log("adding miner x: " + miner.x + ", y: " + miner.y);
      }
    }
  },
  
  /**
   * Uses the map data array to render the Map to the given canvas.
   * 
   * @param {number} canvasNum The number of the canvas to draw to.
   */
  draw: function(canvasNum) {
    var ctx = this.contexts[canvasNum];
    var xx, yy;
    for (xx = 0; xx < 304; xx++) {
      for (yy = 0; yy < 208; yy++) {
        this.drawBlock(ctx, xx, yy);
      }
    }
  }
};

