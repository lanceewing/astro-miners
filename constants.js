// Holds various constants that can be tweaked to change various aspects of the game.
$.Constants = {};
$.Constants.CELL_WIDTH = 31; //21;
$.Constants.BLOCK_SIZE = ~~(($.Constants.CELL_WIDTH - 2) / 2);
//$.Constants.FALL_SIZE = $.Constants.BLOCK_SIZE;
$.Constants.ROOM_X_PIXELS = ($.Constants.CELL_WIDTH * 152);
$.Constants.ROOM_Y_PIXELS = ($.Constants.CELL_WIDTH * 104);
//$.Constants.MAX_VERT_VELOCITY = 4.0;
//$.Constants.MAX_HORIZ_VELOCITY = 2.0;
//$.Constants.MAX_JUMP_HEIGHT = $.Constants.CELL_WIDTH * 1.5;
$.Constants.ROTATE_INTERVAL = 500;
$.Constants.SCREEN_WIDTH = 1000;
$.Constants.SCREEN_HEIGHT = 1000;
$.Constants.WRAP_WIDTH = 700;
$.Constants.WRAP_HEIGHT = 740;
$.Constants.TAIL_LENGTH = 5;