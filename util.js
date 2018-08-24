/** 
 * @namespace Holds utility functions.
 */
$.Util = {};

//$.Util._random = 481731;

/**
 * Linear congruential generator algorithm with a fixed seed. Gives the appearance
 * of being random but always generates the numbers in the same sequence. This has
 * been done deliberately.
 */
$.Util.random = function(seed) {
  var _random = seed || 481731;
  return function(n) {
    _random = (_random * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (_random % n);
  }
};

/**
 * Draws a filled circle of the given diameter. 
 *
 * @param {Object} ctx The 2D canvas context to draw the filled circle on.
 * @param {number} x The x position of the filled circle.
 * @param {number} y The y position of the filled circle.
 * @param {number} d The diameter of the filled circle.
 */
$.Util.fillCircle = function(ctx, x, y, d, colour) {
  var r = d / 2;
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
};

/**
 * 
 */
$.Util.dist = function(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  return Math.sqrt((dx * dx) + (dy * dy));
};

/**
 * Utility function for obtaining a 2D canvas from a newly created canvas of the 
 * given width and height.
 *  
 * @param {number} w The width of the canvas.
 * @param {number} h The height of the canvas.
 */
$.Util.create2dContext = function(w, h) {
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h || w;
  return (canvas.getContext('2d'));
};

/**
 * Draws a person background sprite image. This includes the four different directions,
 * and three different cycles of moving in that direction. The parameters allow different
 * size persons to be drawn, of different clours, and with different features.
 */
$.Util.renderPerson = function(w, h, direction, c, face, clothes, hat, pack) {
  var ctx = $.Util.create2dContext(w, h + (w / 10));

  var ballSize = (w / 5);
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  
  // Hat ball on top
  if (hat) {
    ctx.fillStyle = hat;
    $.Util.fillCircle(ctx, (w / 2) - (ballSize / 2), 0, ballSize, 2, true);
  }
  
  // Head & hat
  var headSize = w - (w / 5);
  var headStart = ballSize - (ballSize / 5);
  ctx.fillStyle = hat;
  $.Util.fillCircle(ctx, 0 + ((w - headSize) / 2), headStart, headSize, 2, true);
  ctx.fillStyle = face;
  $.Util.fillCircle(ctx, 0 + ((w - headSize) / 2), headStart, headSize, hat? 1 : 2, true);
  
  // Neck
  var bodyStart = headStart + headSize;
  var packStart = bodyStart + (w / 10);
  
  // Backpack
  var packWidth = (w / 2.75);
  if (pack) {
    ctx.fillStyle = pack;
    ctx.beginPath();
    if (direction != 0) {
      ctx.rect(w / 2, packStart, -packWidth, headSize);
    }
    if (direction != 1) {
      ctx.rect(w / 2, packStart, packWidth, headSize);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  // Body
  var bodyBottom = bodyStart + w + (w / 1.5);
  var shoulderWidth = w / 6;
  ctx.fillStyle = clothes;
  ctx.beginPath();
  ctx.moveTo(w / 2, bodyStart);
  ctx.lineTo((w / 2) - shoulderWidth, bodyStart);
  if (direction != 1) {
    // Draw left point
    ctx.lineTo(3, bodyBottom);
  }
  ctx.lineTo((w / 2) - shoulderWidth, bodyBottom);
  ctx.lineTo((w / 2) + shoulderWidth, bodyBottom);
  if (direction != 0) {
    // Draw right point
    ctx.lineTo(w - 3, bodyBottom);
  }
  ctx.lineTo((w / 2) + shoulderWidth, bodyStart);
  ctx.lineTo(w / 2, bodyStart);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  if (pack) {
    if (direction == 2) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.rect((w / 2) - packWidth, packStart, packWidth * 2, headSize);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
  
  // Legs
  var legLength = h - bodyBottom;
  var legFactors = [1, 1, 0.5];
  var leftFactor = legFactors[c];
  var rightFactor = legFactors[(c + 1) % 3];
  
  ctx.beginPath();
  ctx.moveTo((w / 2) - shoulderWidth, bodyBottom);
  ctx.lineTo((w / 2) - shoulderWidth, bodyBottom + legLength * leftFactor);
  ctx.moveTo((w / 2) + shoulderWidth, bodyBottom);
  ctx.lineTo((w / 2) + shoulderWidth, bodyBottom + legLength * rightFactor);
  ctx.closePath();
  ctx.stroke();
  
  return ctx.canvas;
};

/**
 * Renders a sphere with eyes.
 * 
 * @param {number} size
 * @param {number} direction
 * @param {string} colour
 * @param {number} texture
 * @param {string} eye
 */
$.Util.renderSphere = function(size, direction, colour, texture, eye, sclera) {
  var ctx = $.Util.create2dContext(size, size);
  
  // Draw the sphere itself. The colour determines the base colour of the
  // sphere. It is filled with a radial gradient so as to appear spherical.
  var cx = size / 2;
  var cy = size / 10;
  var grd = ctx.createRadialGradient(cx, cy, size/10, cx, cy, size * 0.95);
  grd.addColorStop(0, colour);
  grd.addColorStop(1, '#000000');
  ctx.fillStyle = grd;
  $.Util.fillCircle(ctx, 0, 0, size);
  
  // If the texture parameter is defined, it is used randomly adjust ever
  // pixel in the drawn sphere. The texture value is either multiplied with
  // the rgb components, or it the rgb components are divided by it. This
  // adjusts the brightness of the colour and creates a textured or speckled
  // look.
  if (texture) {
    var imgData = ctx.getImageData(0, 0, size, size);
    for (var i=0; i<imgData.data.length; i+=4) {
      if (Math.random() < 0.5) {
        imgData.data[i]=Math.floor(imgData.data[i] * texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] * texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] * texture);
      } else {
        imgData.data[i]=Math.floor(imgData.data[i] / texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] / texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] / texture);
      }
    }
    ctx.putImageData(imgData,0,0);
  }
  
//  var eyeFactor = size / 50;
//  
//  // Draw left eye.
//  if ((direction == 4) || (direction == 1)) {
//    ctx.fillStyle=(sclera || "orange");
//    $.Util.fillCircle(ctx, 8 * eyeFactor, 12 * eyeFactor, 13 * eyeFactor);
//    ctx.fillStyle=(eye || colour);
//    $.Util.fillCircle(ctx, 10 * eyeFactor, 14 * eyeFactor, 9 * eyeFactor);
//  }
//  
//  // Draw right eye.
//  if ((direction == 4) || (direction == 2)) {
//    ctx.fillStyle=(sclera || "orange");
//    $.Util.fillCircle(ctx, 29 * eyeFactor, 12 * eyeFactor, 13 * eyeFactor);
//    ctx.fillStyle=(eye || colour);
//    $.Util.fillCircle(ctx, 31 * eyeFactor, 14 * eyeFactor, 9 * eyeFactor);
//  }
  
  return ctx.canvas;
};
