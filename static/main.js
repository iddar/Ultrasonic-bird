var game = new Phaser.Game(800, 490, Phaser.AUTO, 'gameDiv');
var socket = io();
var self;

var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#3498db';

        game.load.image('bird', 'assets/bird.png');  
        game.load.image('pipe', 'assets/pipe.png'); 
        game.load.image('hole', 'assets/hole.png'); 

        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav');     
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(40, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        this.holes = game.add.group();
        this.holes.enableBody = true;
        this.holes.createMultiple(6, 'hole');

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5); 
 
        //var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //spaceKey.onDown.add(this.jump, this); 
        var winBoard = document.querySelector('.win span');
        winBoard.innerText = localStorage.getItem("score");
        self = this;
        socket.on('sensor', function(value){
            self.jump();
        });

        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        // Add the jump sound
        this.jumpSound = this.game.add.audio('jump');
    },

    update: function() {
        if (this.bird.inWorld == false){
            var winBoard = document.querySelector('.win span');
            if (this.score > winBoard.innerText) {
                localStorage.setItem("score", this.score);
                winBoard.innerText = this.score;
            };
            this.restartGame(); 
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        game.physics.arcade.overlap(this.bird, this.holes, this.hitHole, null, this);

        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;

        if (this.bird.hit) {
            if (!this.bird.score) {
                this.bird.score = true;
                this.score += 1;
                this.labelScore.text = this.score;
            }
        } else {
            this.bird.score = false;
        }
        this.bird.hit = false;
    },

    jump: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play sound
        this.jumpSound.play();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;
            
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
        this.holes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    hitHole: function() {

        this.bird.hit = true;
    
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addOneHole: function(x, y) {
        var hole = this.holes.getFirstDead();

        hole.reset(x, y);
        hole.body.velocity.x = -200;  
        hole.checkWorldBounds = true;
        hole.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(790, i*60+10);   
            else if (i == hole)
                this.addOneHole(800, i*60-90);
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 