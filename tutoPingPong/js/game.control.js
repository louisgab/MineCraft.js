// Gerer les touches du clavier

game.control = {
  onKeyDown : function(event) {
    if ( event.keyCode == game.keycode.KEYDOWN && game.joueur.playerOne.posY < game.groundHeight - game.joueur.playerOne.height) {
        game.joueur.playerOne.goDown = true;
    } else if ( event.keyCode == game.keycode.KEYUP && game.joueur.playerOne.posY > 0 ) {
      game.joueur.playerOne.goUp = true;
    }
 },
 onKeyUp : function(event) {
   if ( event.keyCode == game.keycode.KEYDOWN ) {
           game.joueur.playerOne.goDown = false;
   } else if ( event.keyCode == game.keycode.KEYUP ) {
           game.joueur.playerOne.goUp = false;
   }
 }
}
