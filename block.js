/**
 * Creates a new Block.
 * 
 * @constructor
 * @param {number} col Map column. 
 * @param {number} row Map row.
 * @param {String} type Type of Map block.
 */
$.Block = function(col, row, type) {
  this.col = col;
  this.row = row;
  this.type = type;
};
