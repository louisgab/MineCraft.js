var game = {
  groundWidth : 700,
  groundHeight : 400,
  groundColor: "#000000",
  netWidth : 6,
  netColor: "#FFFFFF",
  scorePosPlayer1 : 300,
  scorePosPlayer2 : 365,
  groundLayer : null,
  scoreLayer : null,
  playersBallLayer : null,
  ball : {
    speed : 7,
   width : 10,
   height : 10,
   color : "#FFFFFF",
   posX : 200,
   posY : 200,
   directionX : 1,
   directionY : 1,
   moveit : function() {
      this.posX += this.directionX * this.speed;
      this.posY += this.directionY * this.speed;
    },
  bounce : function() {
     if ( this.posX > game.groundWidth || this.posX < 0 )
       this.directionX = -this.directionX;
     if ( this.posY > game.groundHeight || this.posY < 0  )
       this.directionY = -this.directionY;
   }
 },
  // Principal fonction appelée pour lancer le jeux
  init : function() {
    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);
      game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);

      this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
      game.display.drawTextInLayer(this.scoreLayer , "SCORE", "10px Arial", "#FF0000", 10, 10);

      this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);
      game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);
  
  this.displayScore(0,0);
  this.displayBall(200,200);
  this.displayPlayers();

},
//Declaration d'autre fonction
displayScore : function(scorePlayer1, scorePlayer2) {
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
  },
  displayBall : function() {
  game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
},

displayPlayers : function() {
  game.display.drawRectangleInLayer(this.playersBallLayer, game.joueur.playerOne.width, game.joueur.playerOne.height, game.joueur.playerOne.color, game.joueur.playerOne.posX, game.joueur.playerOne.posY);
  game.display.drawRectangleInLayer(this.playersBallLayer, game.joueur.playerTwo.width, game.joueur.playerTwo.height, game.joueur.playerTwo.color,game.joueur.playerTwo.posX, game.joueur.playerTwo.posY);
},


moveBall : function() {
   this.ball.moveit();
   this.ball.bounce();
   this.displayBall();
 },
 clearLayer : function(targetLayer) {
   targetLayer.clear();
 }

};
