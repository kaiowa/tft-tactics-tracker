

$(document).ready(function(){

    var socket = io.connect('http://localhost:3000', { 'forceNew': true });

    socket.emit('room',$('#account').val())
    socket.on('match', function(data) {
        console.log(data);
        drawMatch(data.matches);
        drawUser(data.info);
    });
    
   function drawUser(info){
        $('.division').html(info.tier+' '+info.rank);
        $('.leaguepoints').html('- '+info.leaguePoints+' LPs');
        $('.text-meter').html(info.wins+'W'+' / '+info.losses+'L');
        var total=info.wins+info.losses;
        var progress=(info.wins*100)/total;
        progress=Math.ceil(progress);
        console.log(progress);
        $('.meter span').css('width',progress+'%');

   }
    function drawMatch(data){
        

        let existe=$('#'+data.idMatch).length;
        if(!existe){
            var div=$('<div></div>').attr('id',data.idMatch);
            div.addClass('position');
            div.addClass('position-'+data.position);
            
            div.html(data.position);
            $('.stats').append(div);
        }
    }
    // function addMessage(mensaje) {
        
    //     socket.emit('new-message', mensaje);
    //     return false;
    //   }
});
