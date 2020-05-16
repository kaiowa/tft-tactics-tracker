require('dotenv').config();
const axios=require('axios');
const _=require('underscore');

async function getUserBase(username){

    let urlUser='https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/'+username+'?api_key='+process.env.api_key;
    let dataUser=await axios.get(urlUser);
    return dataUser;
}
async function getUserInfo(summonerId){

    let urlInfoUser='https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/'+summonerId+'?api_key='+process.env.api_key;
    let dataInfoUser=await axios.get(urlInfoUser);
    return dataInfoUser;
}
async function getPositions(puuid){

    let url='https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/'+puuid+'/ids?count=10&api_key='+process.env.api_key;
    let matches=await axios.get(url);
    let urlmatch='https://europe.api.riotgames.com/tft/match/v1/matches/'+matches.data[0]+'?api_key='+process.env.api_key;
    let match=await axios.get(urlmatch);
    let participantes=match.data.info.participants;
   
    let parti= _.filter(participantes,function(item){
       
        return item.puuid==puuid
    });
    let matchResult={
        'idMatch':matches.data[0],
        'position':parti[0].placement
    }
    return matchResult;
}
let Services={
    'getUserBase':getUserBase,
    'getPositions':getPositions,
    'getUserInfo':getUserInfo
}
module.exports=Services;