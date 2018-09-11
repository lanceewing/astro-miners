/**
 * The is the core Game object that manages the starting of the game loop and the
 * core functions of the game that don't relate directly to an individual game
 * object, such as Ego or an Enemy.
 */
$.Game = {

  // The current input state.
  keys: {},
  oldkeys: {},
  xMouse: 0,
  yMouse: 0,
  mouseButton: 0,
  dragStart: null,
  dragNow: null,
  dragEnd: null,
    
  /**
   * The time of the last animation frame. 
   */ 
  lastTime: 0,
  
  /**
   * The time difference between the last animation frame and the current animaton frame.
   */  
  delta: 0,
  
  /**
   * Says whether the game currently has focus or not. Is updated by focus/blur listeners.
   */
  hasFocus: true,
  
  /**
   * Says whether the game is currently paused or not.
   */
  paused: true,
  
  /**
   * Says whether the game loop is currently counting down or not.
   */
  counting: false,
  
  /**
   * Says whether there is a game currently in progress or not.
   */
  running: false,
  
  /**
   * Says whether the start up sequence is currently in progress or not.
   */
  starting: false,
  
  /**
   * The countdown time for when the game unpauses.
   */
  countdown: 0,
  
  /**
   * Current angle of rotation of the screen.
   */
  rotateAngle: 0,
  
  /**
   * Holds a reference to all Bullet's on the screen.
   */
  bullets: [],
  
  /**
   * The current number of Enemies on the screen (AKA the "Glitch").
   */
  enemyCount: 0,
  
  /**
   * An key-value map holding all enemies.
   */
  enemyMap: {},
  
  /**
   * The time in milliseconds since the current game started.
   */
  time: 0,
  
  /**
   * Array of miner objects.
   */
  miners: [],
  
  /**
   * Adds the given Enemy to the enemy Map in which we hold all enemies in 
   * the game.
   * 
   * @param {$.Enemy} enemy The Enemy to add to the Game's enemy map.
   */
  addEnemy: function(enemy) {
    if (!this.enemyMap[enemy.key]) {
      this.enemyMap[enemy.key] = enemy;
      this.enemyCount++;
    }
  },
  
  /**
   * Gets the Enemy at the given column and row.
   * 
   * @param {number} col The column to get the Enemy from.
   * @param {number} row The row to get the Enemy from.
   * 
   * @returns {$.Enemy} The Enemy at the given position.
   */
  getEnemy: function(col, row) {
    return this.enemyMap['e_' + (col % 152) + '_' + (row % 104)];
  },
  
  /**
   * Removes the given Enemy from the Game's enemy map.
   * 
   * @param {$.Enemy} enemy The Enemy to remove from the Game's enemy map.
   */
  removeEnemy: function(enemy) {
    if (enemy && enemy.key && this.enemyMap[enemy.key]) {
      delete this.enemyMap[enemy.key]; 
      this.enemyCount--;
    }
  },
  
  /**
   * Starts the game. 
   */
  start: function() {
    // Get a reference to each of the elements in the DOM that we'll need to update.
    $.msg1 = document.getElementById('msg1');
    $.msg2 = document.getElementById('msg2');
    $.msg3 = document.getElementById('msg3');
    $.enemies = document.getElementById('enemies');
    $.time = document.getElementById('time');
    $.wrapper = document.getElementById('wrap');
    $.miners = document.getElementById('miners');
    $.mcnt = document.getElementById('mcnt');
    
    this.addMiners();
    
    $.Game.fadeIn($.wrapper);
    
    // Set up the graphics objects we'll need
    $.input = document.getElementById('screen');
    $.screen = document.getElementById('s');
    $.sctx = $.screen.getContext('2d');

    // Register the event listeners for handling auto pause when the game loses focus.
    window.addEventListener('blur', function(e) {
      $.Game.hasFocus = false;
    });
    window.addEventListener('focus', function(e) {
      $.Game.hasFocus = true;
    });

    this.renderFavicon();
    
    // The sound generation might be a bit time consuming on slower machines.
    setTimeout(function() {
      $.Sound.init();
    }, 1000);

    $.Game.disableInput();

    setTimeout(function() {
      // Show the title screen.
      $.Game.showText(1, "Astro Miners");
      $.Game.showText(3, "OFFLINE");
      
      // Initialise and then start the game loop.
      $.Game.init(false);
      requestAnimationFrame($.Game._loop);
      
      $.Game.fadeOut($.msg2);
      setTimeout(function() {
        if ($.Game.starting && !$.Game.counting) {
          $.Game.showText(2, 'Click to start');
          $.Game.enableInput();
        }
      }, 5000);
      
    }, 1);
  },
  
  addMiners: function() {
    for (var i=0; i<10; i++) {
      var sprite = document.createElement('span');
      sprite.classList.add('miner');
      sprite.classList.add('offline');
      var minerCtx = $.Util.create2dContext(50, 50);
      minerCtx.drawImage($.Util.renderSphere(50, 1, 'white', 0.95, 'black'), 0, 0);
      sprite.style.backgroundImage = 'url(' + minerCtx.canvas.toDataURL("image/png") + ')';
      $.miners.appendChild(sprite);
      sprite.addEventListener('click', (function(miner) {
        return function() {
          var minerObj = $.Game.miners[miner];
          if (minerObj.online && !$.Game.paused) {
            var currentActive = document.getElementsByClassName('active');
            if (currentActive && currentActive.length > 0) {
              currentActive[0].classList.remove('active');
            }
            $.ego.active = false;
            $.ego = minerObj;
            $.ego.active = true;
            this.classList.add('active');
          }
        };
      })(i));
      // Create the miner object and store reference to the miner button.
      $.Game.miners[i] = new $.Ego(i);
      $.Game.miners[i].button = sprite;
    }
  },
  
  /**
   * Initialises the Game.
   * 
   * @param {Boolean} running Whether or not we should say that the Game is now running.
   */
  init: function(running) {
    $.Game.time = 0;
    $.Game.rotateAngle = 0;
    $.Game.bullets = [];
    
    // Clear the enemies
    $.Game.enemyCount = 0;
    $.Game.enemyMap = {};
    
    $.Map.init();
    
    if (!running) {
      $.ego = $.Game.miners[0];
      
      // Clean up miner switch buttons for start of game.
      var minerButtons = document.getElementsByClassName('miner');
      for (var buttonNum=0; buttonNum<minerButtons.length; buttonNum++) {
        var minerButton = minerButtons[buttonNum];
        minerButton.classList.remove('active');
        minerButton.classList.add('offline');
      }
    }
    
    // Tells the game loop that the game is now running. During the game over state,
    // this flag is false.
    $.Game.running = false;
    $.Game.starting = true;
  },
  
  enableInput: function() {
    // Set up the keyboard & mouse event handlers (size reduced way)
    $.input.onmousedown = function(e) {
      if ($.Game.running) {
        $.Game.dragStart = { 
            x: e.pageX - $.wrapper.offsetLeft, 
            y: e.pageY - $.wrapper.offsetTop,
            t: (new Date()).getTime()
        };
        $.Game.dragEnd = $.Game.dragNow = null;
      }
      $.Game.mouseButton = 1;
      e.preventDefault();
    };
    $.input.onmouseup = function(e) {
      if ($.Game.running) {
        $.Game.dragEnd = { 
            x: e.pageX - $.wrapper.offsetLeft, 
            y: e.pageY - $.wrapper.offsetTop,
            t: (new Date()).getTime()
        };
      }
      $.Game.mouseButton = 0;
      e.preventDefault();
    };
    $.input.onmousemove = function(e) {
      $.Game.xMouse = e.pageX - $.wrapper.offsetLeft;
      $.Game.yMouse = e.pageY - $.wrapper.offsetTop;
      if (($.Game.mouseButton == 1) && ($.Game.running)) {
        $.Game.dragNow = { 
            x: e.pageX - $.wrapper.offsetLeft, 
            y: e.pageY - $.wrapper.offsetTop,
            t: (new Date()).getTime()
        };
      }
    };
    $.input.ontouchend = function(e) {
      if ($.Game.running) {
        $.Game.dragEnd = { 
            x: e.changedTouches[0].pageX - $.wrapper.offsetLeft, 
            y: e.changedTouches[0].pageY - $.wrapper.offsetTop,
            t: (new Date()).getTime()
        };
      }
      $.Game.xMouse = e.changedTouches[0].pageX - $.wrapper.offsetLeft;
      $.Game.yMouse = e.changedTouches[0].pageY - $.wrapper.offsetTop;
      $.Game.mouseButton = 1;
      if (e.cancelable) e.preventDefault();
    };
    $.input.ontouchstart = function(e) {
      if ($.Game.running) {
        $.Game.dragStart = { 
            x: e.changedTouches[0].pageX - $.wrapper.offsetLeft, 
            y: e.changedTouches[0].pageY - $.wrapper.offsetTop,
            t: (new Date()).getTime()
        };
        $.Game.dragEnd = $.Game.dragNow = null;
      }
    };
    $.input.ontouchmove = function(e) {
      if ($.Game.running) {
        $.Game.dragNow = { 
            x: e.changedTouches[0].pageX - $.wrapper.offsetLeft, 
            y: e.changedTouches[0].pageY - $.wrapper.offsetTop,
            t: (new Date()).getTime()
        };
      }
    };
    this.enableKeys();
  },
  
  disableInput: function() {
    $.input.onmousedown = null;
    $.input.onmouseup = null;
    $.input.onmousemove = null;
    $.input.ontouchend = null;
    $.input.ontouchstart = null;
    $.input.ontouchmove = null;
    this.disableKeys();
  },
  
  /**
   * Enables keyboard input. 
   */
  enableKeys: function() {
    document.addEventListener('keydown', this.keydown, false);
    document.addEventListener('keyup', this.keyup, false);
    $.screen.focus();
  },
  
  /**
   * Disables keyboard input. 
   */
  disableKeys: function() {
    $.Game.oldkeys = $.Game.keys = {};
    document.removeEventListener('keydown', this.keydown, false);
    document.removeEventListener('keyup', this.keyup, false);
  },
  
  /**
   * Invoked when a key is pressed down.
   *  
   * @param {Object} e The key down event containing the key code.
   */
  keydown: function(e) {
    $.Game.keys[e.keyCode] = 1;
  },
  
  /**
   * Invoked when a key is released.
   *  
   * @param {Object} e The key up event containing the key code.
   */
  keyup: function(e) {
    $.Game.keys[e.keyCode] = 0;
  },
  
  /**
   * This is a wrapper around the main game loop whose primary purpose is to make
   * the this reference point to the Game object within the main game loop. This 
   * is the method invoked by requestAnimationFrame and it quickly delegates to 
   * the main game loop.
   *  
   * @param {number} now Time in milliseconds.
   */
  _loop: function(now) {
    $.Game.loop(now);
  },
  
  /**
   * This is the main game loop, in theory executed on every animation frame.
   * 
   * @param {number} now Time. The delta of this value is used to calculate the movements of Sprites.
   */
  loop: function(now) {
    // Immediately request another invocation on the next
    requestAnimationFrame(this._loop);
    // Create a single canvas to render the sprite sheet for the four directions.
    
    // Calculates the time since the last invocation of the game loop.
    this.updateDelta(now);
    
    if (!this.paused) {
      if ($.Game.keys[80] || !this.hasFocus) {
        // Pause the game if the player has pressed the pause key, or if the game
        // has lost focus. This includes pausing the music.
        $.Sound.pause('music');
        this.paused = true;
        this.showText(1, 'Paused');
        this.showText(2, 'Click to continue');
      } else {
        // Game has focus and is not paused, so execute normal game loop, which is
        // to update all objects on the screen.
        this.updateObjects();
      }
    } else if (this.hasFocus) {
      // We're paused, and have focus.
      if (this.countdown) {
        // If we're in countdown mode, update the countdown based on elapsed time.
        this.countdown = Math.max(this.countdown - 1000, Math.max(this.countdown - this.delta, 0));
        
        // Calculate count value (i.e. countdown / 1000) then compare with currently displayed count.
        var count = Math.ceil(this.countdown / 1000);
        if (count != $.msg1.innerHTML) {
          if (count > 0) {
            // If count is above zero, we simply display it.
            $.Sound.play('count');
            this.showText(1, count, true);
          } else {
            // Otherwise countdown has completed, so we un-pause the game.
            $.Sound.play('count');
            this.showText(1, 'Go', true);
            
            // Unpause the game after "Go" has faded.
            setTimeout(function() {
              $.Game.paused = false;
              $.Game.counting = false;
              if ($.Game.starting) {
                $.Game.time = 0;
                $.Game.lastTime = 0;
                $.Game.starting = false;
                $.Game.running = true;
              }
            }, 500);
          }
        }
      } else if (!this.counting) {
        // We're paused and have focus, but haven't started countdown yet. Check for space key.
        if ($.Game.keys[32] || $.Game.mouseButton) {
          $.Game.mouseButton = 0;
          
          // The space key was pressed, so we start the countdown process. This gives the player
          // some time to get ready.
          this.fadeOut($.msg1);
          this.fadeOut($.msg2);
          this.fadeOut($.msg3);

          // Create a single canvas to render the sprite sheet for the four directions.
          // This says countdown is about to start (in 1 second).
          this.counting = true;
          
          setTimeout(function() {
            if (!$.Game.running) $.Game.init(false);
          
            // Start the countdown in 1 second. Gives the previous messages time to fade.
            setTimeout(function() {
              $.ego.activate();
              $.Game.countdown = 3000;
              $.Game.showText(2, 'Ready Miner ' + ($.ego.minerNum+1), true, 2500);
            }, 1000);
          
          }, 500);

          $.Sound.play('music');
        }
      }
    
      if ($.Game.starting) {
        this.updateObjects();
      }
      
    } else {
      // In paused state and does not have focus.
      this.countdown = 0;
      this.counting = false;
    }
    
    // Keep track of what the previous state of each key was.
    $.oldkeys = {};
    for ( var k in $.keys) {
      $.oldkeys[k] = $.keys[k];
    }
  },
  
  /**
   * Invoked when the player has killed all of the enemies (Yay!!).
   */
  won: function() {
    // Remove the keyboard input temporarily, just in case the player was rapid
    // firing when they died. We don't want them to immediately trigger a game
    // restart if they didn't want to.
    this.disableInput();
    
    // This tells the game loop that the game needs to be re-initialised the next 
    // time the player unpauses the game.
    this.running = false;
    
    // Pause the game and tell the player it is all over.
    this.paused = true;
    this.showText(1, "You've Won!!");
    
    // After 5 seconds, enable keyboard input again and ask the player to press 
    // SPACE to restart.
    setTimeout(function() {
      $.Game.showText(2, 'Click to restart');
      $.Game.enableInput();
    }, 3000);
  },
  
  /**
   * Invoked when the player dies.  
   */
  gameover: function() {
    // Remove the keyboard input temporarily, just in case the player was rapid
    // firing when they died. We don't want them to immediately trigger a game
    // restart if they didn't want to.
    this.disableInput();
    
    // This tells the game loop that the game needs to be re-initialised the next 
    // time the player unpauses the game.
    this.running = false;
    
    // Pause the game and tell the player it is all over.
    this.paused = true;
    
    this.showText(1, "Astro Miners");
    // Create a single canvas to render the sprite sheet for the four directions.
    this.showText(3, "OFFLINE");
    
    // Play the explosion sound and trigger the explode transition on Ego.
    $.Sound.play('explosion');
    
    // After 5 seconds, enable keyboard input again and ask the player to press 
    // SPACE to restart.
    setTimeout(function() {
      $.Game.showText(2, 'Click to restart');
      $.Game.enableInput();
    }, 3000);
  },
  
  /**
   * Displays the given text in the given message area. T
  // Create a single canvas to render the sprite sheet for the four directions.here are two message areas, msg1 and msg2. One
   * is much larger than the other.
   * 
   * @param {number} num Either 1 or 2, identifying either msg1 or msg2 as the place where the text should be displayed.
   * @param {string} text The text to display in the given message area.
   * @param {boolean} fade Set to true if the text should fade after being displayed.
   * @param {number} duration If set then the duration after which the text will either fade, or be removed instantly (depending on the value of fade).
   */
  showText: function(num, text, fade, duration) {
    // TODO: var msgElem = $['msg'+num];   // Advanced opts doesn't like this
    var msgElem = document.getElementById('msg'+num);
    
    // Updates the text of the identified message area.
    msgElem.innerHTML = text;
    
    // Fades the text in. The text is always faded in.
    this.fadeIn(msgElem);
    
    if (fade) {
      // If fade was true, then the message will be faded out.
      if (duration) {
        // If a duration was provided, then we will fade out after the specified duration.
        setTimeout(function(e) {
          if (msgElem.innerHTML == text) { 
            $.Game.fadeOut(msgElem);
          }
        }, duration);
      } else {
        // Otherwise fade out immediately after the fade in finishes.
        this.fadeOut(msgElem);
      }
    } else if (duration) {
      // If a duration was provided but fade was false, then we will remove the message 
      // immediately after the specified duration.
      // Create a single canvas to render the sprite sheet for the four directions.
      setTimeout(function(e) {
        if (msgElem.innerHTML == text) { 
          msgElem.style.display = 'none';
        }
      }, duration);
    }
  },
  
  /**
   * Fades in the given DOM Element.
   * 
   * @param {Object} elem The DOM Element to fade in.
   */
  fadeIn: function(elem) {
    // Remove any previous transition.
    elem.removeAttribute('style');
    elem.style.display = 'block';
    // Create a single canvas to render the sprite sheet for the four directions.
    
    // We need to change the opacity in a setTimeout to give the display change time to take effect first.
    setTimeout(function() {
      // Setting the transition inline so that we can cancel it with the removeAttribute.
      elem.style.transition = 'opacity 0.5s';
      elem.style.opacity = 1.0;
    }, 50);
  },
  
  /**
   * Fades out the given DOM Element.
   * 
   * @param {Object} elem The DOM Element to fade out.
   */
  fadeOut: function(elem) {
    elem.style.opacity = 0.0;
    
    // We need to change the display after the opacity transition has reached 0.0, which is in 0.5 seconds.
    setTimeout(function() {
      elem.style.display = 'none';
    }, 500);  // 500ms needs to match the opacity tra
    // Create a single canvas to render the sprite sheet for the four directions.nsition duration.
  },
  
  /**
   * Updates the value displayed in one of the status line fields. All values are 
   * zero padded.
   * 
   * @param {Object} field The DOM Element identifying the status line field to update.
   * @param {Object} value The value to update the st
  // Create a single canvas to render the sprite sheet for the four directions.atus line field text to be (will be zero padded).
   */
  setStatus: function(field, value) {
    field.innerHTML = ('000000000' + value).substr(-field.innerHTML.length);
  },
  
  /**
   * Updates the delta, which is the difference between the last time and now. Both values
   * are provided by the requestAnimationFrame call to the game loop. The last time is the
   * value from the previous frame, and now is the value for the current frame. The difference
   * between them is the delta, which is the time between the two frames.
   * 
   * @param {Object} now The current time provided in the invocation of the game loop.
   */
  updateDelta: function(now) {
    if (now) {
      this.delta = now - (this.lastTime? this.lastTime : (now - 16));
      this.stepFactor = this.delta * 0.06;
      this.lastTime = now;
      this.time += this.delta;
    }
  },
  
  /**
   * The main method invoked on every animation frame.
   */
  updateObjects: function() {
    var enemy, bullet, block;

    // Create a single canvas to render the sprite sheet for the four directions.
    // Update ego (the player).
    if ($.Game.running) {
      $.ego.update();
    }
    
    // Updates the other miners not being controlled by the player.
    for (var minerNum = 0; minerNum < 10; minerNum++) {
      var miner = this.miners[minerNum];
      if (miner != $.ego) {
        miner.update();
      }
    }
      
    // Updates position of bullets and checks to see if they have hit anything.
    for (var bulletNum = 0; bulletNum < 20; bulletNum++) {
      bullet = this.bullets[bulletNum];
          
      // Is the bullet active? i.e. moving. null means the bullet isn't being used.
      if (bullet) {
        this.bullets[bulletNum].move();
        
        block = $.Map.getBlockAt(bullet.x, bullet.y);
        if ((block.type == '#') || (block.type == '+')) {
          // TODO: + to be rock?
          bullet.hit = true;
        } else {
          // Check for miner collision
          for (var minerNum = 0; minerNum < 10; minerNum++) {
            var miner = this.miners[minerNum];
            if (miner.online) {
              var distToMiner =  $.Util.dist(miner, bullet);
              if (distToMiner < (miner.size/2)) {
                // Miner hit. Set to offline.
                var foundOnlineMiner = false;
                bullet.hit = true;
                miner.online = false;
                miner.button.classList.add('offline');
                $.Sound.play('offline');
                if (miner.active) {
                  // This miner is the current ego. Switch to another online miner.
                  miner.active = false;
                  miner.button.classList.remove('active');
                  for (var newMinerNum = 0; newMinerNum < 10; newMinerNum++) {
                    var newMiner = this.miners[newMinerNum];
                    if (newMiner.online) {
                      foundOnlineMiner = true;
                      break;
                    }
                  }

                  if (foundOnlineMiner) {
                    this.disableInput();
                    $.Game.dragEnd = $.Game.dragStart = $.Game.dragNow = null;
                    $.Game.showText(3, "MINER " + (miner.minerNum + 1) + " OFFLINE", true, 2500);
                    $.Game.showText(2, 'Ready Miner ' + (newMiner.minerNum+1), true, 2500);
                    setTimeout(function() {
                      $.ego = newMiner;
                      $.ego.active = true;
                      $.ego.button.classList.add('active');
                      $.Game.enableInput();
                    }, 2000);
                  }
                  else {
                    // If we didn't find a new ego, its game over.
                    $.Game.gameover();
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
      
    // Updates the enemies. 
    for (var key in this.enemyMap) {
      if (this.enemyMap.hasOwnProperty(key)) {
        enemy = this.enemyMap[key];
        enemy.update();
      }
    }
    
    // Update status line.
    this.onlineMinerCount = 10 - document.getElementsByClassName('offline').length;
    $.time.innerHTML = this.buildTimeString(this.time);
    this.setStatus($.enemies, this.enemyCount);
    this.setStatus($.mcnt, this.onlineMinerCount);
      
    // Draw all.
    this.draw();
    
    // Check for game won. All miners online, all enemies dead.
    if ((this.onlineMinerCount == 10) && (this.enemyCount == 0)) {
      $.Game.won();
    }
  },
  
  /**
   * For the given number of milliseconds, returns a string representation that includes
   * the minutes and seconds in the format mm:ss
   * 
   * @param numOfMillis The millisecond value to convert to a time in minutes and seconds.
   * 
   * @returns {String} The time as mm:ss
   */
  buildTimeString: function(numOfMillis) {
    var totalSeconds = Math.floor(numOfMillis / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    if (minutes > 99) {
      minutes = 99;
      seconds = 59;
    }
    //if ((seconds != this.lastSeconds) && !this.paused) {
    if (!this.paused) {
      this.rotateAngle = ((this.rotateAngle + .05) % 360);
    }
    //}
    this.lastSeconds = seconds;
    return (('00' + minutes).substr(-2) + ':' + ('00' + seconds).substr(-2));
  },
  
  lastSeconds: 0,
  
  /**
   * Renders the favicon. It does this by rendering Ego facing forward and then resizes this
   * to fit within the favicon size and then updates the href of the favicon with the 
   * data url of the generate canvas.
   */
  renderFavicon: function() {
    var favicon = document.getElementById('favicon');
    var ctx = $.Util.create2dContext(16, 16);
    ctx.drawImage($.Util.renderSphere(50, 4, 'white', 1, 'black', 'white'), 0, 0, 16, 16);
    favicon.href = ctx.canvas.toDataURL();
  },
  
  /**
   * Draws everything in the Game that needs to be drawn for the current frame.
   */
  draw: function() {
    // Start by clearing the whole screen canvas.
    $.sctx.fillStyle = 'rgba(0,0,0,0.0)';
    $.sctx.clearRect(0, 0, 1000, 1000);

    $.sctx.save();
    $.sctx.transform(1, 0, 0, 1, 0, 0);

    // Translating to the middle of the window allows it to rotate around the middle.
    $.sctx.translate(~~($.Constants.SCREEN_WIDTH / 2), ~~($.Constants.SCREEN_HEIGHT / 2));

    $.sctx.rotate(-((this.rotateAngle % 360) * Math.PI / 180));
    
    $.sctx.save();

    // Calculates the diagonal of the square formed by using the longest of the inner window
    // sizes. This allows us to then use this diagonal as the width of the rendered portion
    // of the background, which is the minimum size we need to support a clean rotation (i.e.
    // with no white bits showing).
    var diag = 1000;
    
    // Movement in different directions is controlled solely through a translation on this drawImage call.
    $.sctx.drawImage($.Map.getCanvas(),
        // The checks on xPos & yPos are what enables the wrap around of the map and the smooth transitions between wrap edges.
        ($.ego.x > ($.Constants.ROOM_X_PIXELS/2) ? $.ego.x : $.ego.x + $.Constants.ROOM_X_PIXELS) - (diag / 2), 
        ($.ego.y > ($.Constants.ROOM_Y_PIXELS/2) ? $.ego.y : $.ego.y + $.Constants.ROOM_Y_PIXELS) - (diag / 2), 
        diag, diag,
        // Destination.
        -(diag / 2), -(diag / 2), diag, diag);

    $.sctx.restore();

    // Now draw the player.
    $.sctx.save();

    if ($.Game.running) {
      $.sctx.save();
      $.ego.draw();
      $.sctx.restore();
    }
    
    // Updates and then renders the bullets.
    for (var bulletNum = 0; bulletNum < 20; bulletNum++) {
      var bullet = this.bullets[bulletNum];
      
      // Is the bullet active? i.e. moving. 
      if (bullet) {
        bullet.draw($.sctx, $.ego.x, $.ego.y);
        if (bullet.hit) {
          this.bullets[bulletNum] = null;
        }
      }
    }
    
    // Renders the miners, all except for Ego
    for (var minerNum = 0; minerNum < 10; minerNum++) {
      var miner = this.miners[minerNum];
      if (miner != $.ego) {
        if (!miner.online) {
          // Offline miners are rendered darker, to indicate no power.
          $.sctx.globalAlpha=0.3;
        } else {
          miner.drawFlame();
        }
        
        $.sctx.drawImage(miner.canvas, 
            0, 0, miner.size, miner.size,
            miner.x - $.ego.x - (miner.size/2), miner.y - $.ego.y - (miner.size/2), miner.size, miner.size);
        
      }
      $.sctx.globalAlpha=1.0;
    }
    
    $.sctx.restore();
    
    $.sctx.restore();
  }
};

//// The recommended requestAnimationFrame shim
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
 
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// On load, the game will start.
window.onload = function() { 
  $.Game.start();
};