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
  canvasNum: 1,
  
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
    this.canvasNum = 1;
    this.contexts = [];
    
    for (var i=0; i<2; i++) {
      this.canvases[i] = document.createElement('canvas');
      this.canvases[i].width = 152 * $.Constants.CELL_WIDTH * 2;
      this.canvases[i].height = 104 * $.Constants.CELL_WIDTH * 2;
      this.contexts[i] = this.canvases[i].getContext('2d');
    }
    
    this.draw(0);
    this.draw(1);
  },
  
  /**
   * The actual raw map data for the game. 
   * 
   * # = Wall
   * * = Glitch positions
   */
  map:  '########################################################################################################################################################'
      + '##########      ##   #################        ###########  ############     ##############  ########  #####     ################################ ### ###'
      + '##########            ##############           #########     #########       ############    #######   ####     ##########        ###### # ###    ## ###'
      + '##########             ############      #      ######        ### ####          #########   ######### #####  #############        #####          #######'
      + '###########             ############    ####    ######        ###  ####          #########  ######### ####################        #####          #######'
      + '############             ############    ####   ######       ############        ###############      ###################         #####          #######'
      + '############    ###       ############# ###### #########     ############         ###   ####          #################    ####    ####           ######'
      + '#############   #####      ##############################   ##########                  ####         #################     ######  #####           #####'
      + '##############   #####      ####   ######################    ########                   #####        ############ ####    ########  ####    ##      ####'
      + '##############   #######    ###     ##### ###############          ##                    ####  ###   ######        ###    #########  ##    ####      ###'
      + '#############     ######    ##       ###   ######     ####         ###      ##            ########    #####       ####     ########       ######      ##'
      + '#*  #########     ####      ##       ##     #####     ####          ##   #####             ######      ####    #######     #########     ##########    #'
      + '#    ########       ##      ###      ##     ####     ####               ######       #      ####         #     #######      #########   ############   #'
      + '##   ## ####       ###      ###      ###   ####      ####       ###    ####          ##            #           #######      ##########  ###########    #'
      + '##                 #####    ####     ###  ###       #####       ####  ####      ##                ###           #####       #########    ########      #'
      + '#        ###       ##############     ##   ##       ########     #########     ####       #      ####            ####       ######         ######     ##'
      + '##  #######       #################                ##########     ########     ####       #  #   ###             ###       #####           ######    ###'
      + '#########        ##################                ##########     #######      ####   #      #         #######   ###       ####           ########  ####'
      + '#######         ####################               ##########     #######      ###   ###              ########   ###        ####         ###############'
      + '######         #########################          #########       ####### ##  ###   ####             #########   ####     #########      ###    ########'
      + '#####         ##########################          ########        ##############    ####         #########  ##  ######    ##########     ##      ###   #'
      + '####          ####  ##################             #######   #   ##############     ####        ##########      ####### ############     ##            #'
      + '###    ##      ##    ############  ###       #      ######  ###  ############       #####      ####### ###     ######     ###########   ####           #'
      + '##     ###     ##     ###########  ####      ##     ######  ###   ####  ####         ######    ######   ##    ######      ##################       ## ##'
      + '##      ###    ##      ###################   ###   #######  #### #####  ####         #######    #####    #    #####       #######   ########    ########'
      + '##       ########      ###################    ##   ######    #########   ###         ########      #          #####      #######    ######### ##########'
      + '##   #    #######      ###   #############     ####  ####    #########   ###         #########               ###################    ####################'
      + '##  ###    ######     ###     ############     ####  ####    ########## #####       #############            ###################   #####################'
      + '#  ####     ####     ####     ###########   ##############   ###############      ################           ###     ####  #####  ### ##########  ######'
      + '#  ####      ###    #####     ########    ####################### ##########     ##################          ##             ##### ##   ########    #####'
      + '#######      ###    #####    #######     #######################   ########     ###################                         ########    ########  ######'
      + '#######       ###  #####     ####       #################### ##     ######      ###################                        ########      ###############'
      + '######        ##    #                  ####################         ######   #####################        #                #######        ##############'
      + '#####                                 ######################        ######  #################  ###       ###   #           ######          #############'
      + '#####                                #############   ########      ####### ##################   #   #     ##  ###           ####            ######### ##'
      + '#  ##                 #              ############    ########    #####################   ####      ###    ##   #           #####            ########   #'
      + '#  ###  #####        ###               #########    #### #############################    ##       ####                    ####             #######    #'
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
    block.type = '.';
    this.putBlock(block);
  },
  
  /**
   * Swaps the two canvases so that the one that is currently active becomes 
   * inactive and the other becomes active.
   */
  swap: function() {
    this.canvasNum = (this.canvasNum + 1) % 2;
  },
  
  /**
   * Uses the map data array to render the Map to the given canvas.
   * 
   * @param {number} canvasNum The number of the canvas to draw to.
   */
  draw: function(canvasNum) {
    var ctx = this.contexts[canvasNum];
    var colour = (canvasNum == 0? '#000000' : 'rgba(0,0,0,0.9)');
    var xx, yy;
    //ctx.lineJoin = 'round';
    for (xx = 0; xx < 304; xx++) {
      for (yy = 0; yy < 208; yy++) {
        var dataX = (xx % 152);
        var dataY = (yy % 104);
        var block = this.data[dataY * 152 + dataX];

        if (block == '#') {
          ctx.fillStyle = '#22160B';
          ctx.strokeStyle = '#22160B';
          ctx.beginPath();
          ctx.rect(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH, $.Constants.CELL_WIDTH);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
//          var lingrad = ctx.createLinearGradient(0,0,15,15);
//          lingrad.addColorStop(0.5, '#00FF00');
//          lingrad.addColorStop(1, '#fff');
          
          ctx.strokeStyle = 'rgba(100, 100, 100, 1)';
//          ctx.shadowColor   = 'rgba(255, 255, 255, 1)';
//          ctx.shadowOffsetX = 0;
//          ctx.shadowOffsetY = 0;
//          ctx.shadowBlur    = 20;
          //ctx.lineWidth = 15;
          
          if (this.data[(((dataY + 104) - 1) % 104) * 152 + dataX] != '#') {
            ctx.beginPath();
            ctx.moveTo(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH);
            ctx.lineTo(xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH);
            ctx.closePath();
            ctx.stroke();
          }
          if (this.data[dataY * 152 + ((dataX + 1) % 152)] != '#') {
            ctx.beginPath();
            ctx.moveTo(xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH);
            ctx.lineTo(xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH);
            ctx.closePath();
            ctx.stroke();
          }
          if (this.data[((dataY + 1) % 104) * 152 + dataX] != '#') {
            ctx.beginPath();
            ctx.moveTo(xx * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH);
            ctx.lineTo(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH);
            ctx.closePath();
            ctx.stroke();
          }
          if (this.data[dataY * 152 + (((dataX + 152) - 1) % 152)] != '#') {
            ctx.beginPath();
            ctx.moveTo(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH + $.Constants.CELL_WIDTH);
            ctx.lineTo(xx * $.Constants.CELL_WIDTH, yy * $.Constants.CELL_WIDTH);
            ctx.closePath();
            ctx.stroke();
          }
          
//         ctx.shadowColor = 'rgba(0,0,0,0)';
//         ctx.shadowBlur = 0;
//         ctx.shadowOffsetX = 0;
//         ctx.shadowOffsetY = 0;
          
        } else if (block == '*') {
          var enemy = $.Game.getEnemy(dataX, dataY);
          if (!enemy) {
            enemy = new $.Enemy(dataX, dataY);
            $.Game.addEnemy(enemy);
          }
          enemy.draw(ctx, xx, yy);
        }
      }
    }
  }
};

