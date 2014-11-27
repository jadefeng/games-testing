// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the game's assets  
        // Change the background color of the game
        game.stage.backgroundColor = '#71c5cf';

        // Load the cat sprite
        game.load.image('cat', 'assets/cat.png');

        // Load the bricks
        game.load.image('brick', 'assets/brick.png');

        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav');

    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  

        // Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display cat on the screen
        this.cat = this.game.add.sprite(100, 245, 'cat');

        // Adding gravity to the cat
        game.physics.arcade.enable(this.cat);
        this.cat.body.gravity.y = 1000;

        // Cat jumps when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        // Creating a group of 20 bricks
        this.bricks = game.add.group();     // Created a group
        this.bricks.enableBody = true;      // Physics applied
        this.bricks.createMultiple(20, 'brick');     // 20 bricks

        // Adding bricks to the game
        this.timer = game.time.events.loop(1500, this.addRowOfBricks, this);

        // Adding scores to the top left
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});

        // Make the animation better to look at
        this.cat.anchor.setTo(-0.2, 0.5);

        // Sound when there is a jump!
        this.jumpSound = game.add.audio('jump');
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
        // If the cat jumps too much, it restarts the game
        if (this.cat.inWorld == false) {
            // debugger;
            // this.restart();
            game.state.start('main');
        };

        game.physics.arcade.overlap(this.cat, this.bricks, this.hitBrick, null, this);

        // Restart game if the cat bumps into the brick
        // game.physics.arcade.overlap(this.cat, this.bricks, this.restartGame, null, this);

        // If cat falls, the angle moves a bit downwards until 20 degrees
        if (this.cat.angle < 20) {
            this.cat.angle += 1;
        }
    },

    jump: function() {
        // If the bird is dead, it should not be able to jump
        if (this.cat.alive == false) {
            return;
        }

        // Vertical velocity to the cat when it jumps
        this.cat.body.velocity.y = -350;

        // When the cat jumps, rotate it upwards
        var animation = game.add.tween(this.cat);

        // The animation changes the ngle of the sprite to -20 degrees in 100 miliseconds
        animation.to({angle: -20}, 100);

        // Start the animation!
        animation.start();

        // jump sound when there is a jump!
        this.jumpSound.play();
        
    },

    restartGame: function() {
        // Goes back to the main state to restart the game
        game.state.start('main');
    },

    addOneBrick: function(x, y) {
        // Get the first dead brick of our group
        var brick = this.bricks.getFirstDead();

        // Set the new position of the brick
        brick.reset(x, y);

        // Add veocity to the brick to make it move left
        brick.body.velocity.x = -200;

        // Kill the brick when it's no longer visible
        brick.checkWorldBounds = true;
        brick.outOfBoundsKill = true;

        // Score +1 when new pipes are created
        this.score += 1;
        this.labelScore.text = this.score / 6 ;
    },

    addRowOfBricks: function() {
        // Bick where the hole will be
        var hole = Math.floor(Math.random() * 5) + 1;   // Randomly generated

        // Add 6 bricks
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != (hole + 1)) {
                this.addOneBrick(400, i * 60 + 10);
            }
        }
    },

    hitBrick: function() {
        // If the cat haS hit a brick, we have nothing to do
        if (this.cat.alive == false) {
            return;
        }

        // the bird is no longer alive
        this.cat.alive = false;

        // No more bricks
        game.time.events.remove(this.timer);

        // Stop the bricks moving
        this.bricks.forEachAlive(function(b) {
            b.body.velocity.x = 0;
        }, this);

        game.state.start('main');
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main');