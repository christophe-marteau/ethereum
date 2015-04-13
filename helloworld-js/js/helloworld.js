var DEBUG = 0;
function debug( level, debugMessage ) {
  if( DEBUG >= level ) {
    console.log( '[' + level + '](' + debug.caller.name + '): ' + debugMessage );
  }
}

/*
 This function chech if a client is alive or not. It just check if we can post a 'null'
 request to an URL.
 Checked with : https://github.com/ethereum/cpp-ethereum/wiki/Building-on-Ubuntu#start-your-client
 [in] clientURL : The client URL to check
 [return] true if connected to the client else false
*/
function isClientAlive( clientURL ) {
  debug( 9, 'END isClientAlive()' );
  debug( 6, 'isClientAlive( ' + clientURL + ' )' );
  var request = new XMLHttpRequest();
  request.open( "POST", clientURL, false );
  try {
    request.send( {"jsonrpc": "2.0","method": "eth_coinbase","params": null,"id": 1} );
  } catch( errorMessage ) {
    console.log( errorMessage );
    debug( 6, 'isClientAlive( ' + clientURL + ' ) = false' );
    debug( 9, 'END isClientAlive()' );
    return( false );
  }
  debug( 6, 'isClientAlive( ' + clientURL + ' ) = true' );
  debug( 9, 'END isClientAlive()' );
  return( true );
}


/*
 This function print a list of element into an html tag'
 [in] msgTitle : The title for the element list 
 [in] tagId : The html tag id where to put text
 [in] msgArray : The array containing message (name: value:)
*/
function displayMsg( msgTitle, tagId, msgArray ) {
  debug( 9, 'BEGIN displayMsg()' );
  debug( 8, 'displayMsg( ' + msgTitle + ', ' + tagId + ', ' + JSON.stringify( msgArray ) + ' )' );
  var htmlOutput = '<p class="msgTitle"><strong>' + msgTitle + '</strong></p>';
  for( var i = 0; i < msgArray.length; i++ ) {  
    htmlOutput += '<p class="msgBody"><strong>' + msgArray[i].name + ' : </strong>' + msgArray[i].value + '</p>';
  }
  debug( 8, 'displayMsg( ' + msgTitle + ', ' + tagId + ', ' + JSON.stringify( msgArray ) + ' ) = "' + htmlOutput + '"' );
  document.getElementById( tagId ).innerHTML = htmlOutput;
  debug( 9, 'END displayMsg()' );
}

function main() {
  debug( 9, 'main()' );

  var web3 = require( 'ethereum.js' );
  var clientUrl = 'http://localhost:8080';

  var ethereumAppInfo = [ { name: 'api', value: web3.version.api } ];
  var ethereumClientInfo = [ { name: 'url', value: clientUrl } ];
  var ethereumNetworkInfo = [];
  var ethereumEthInfo = [];

  web3.setProvider( new web3.providers.HttpProvider( clientUrl ) );
 
  if( isClientAlive( clientUrl ) ) {
    ethereumClientInfo.push( { name: 'state', value: 'alive' } );
    ethereumClientInfo.push( { name: 'version', value: web3.version.client } );
    ethereumNetworkInfo.push( { name: 'version', value: web3.version.network } );
    ethereumNetworkInfo.push( { name: 'listen', value: web3.net.listening } );
    ethereumNetworkInfo.push( { name: 'peer(s)', value: web3.net.peerCount } );
//  ethereumEthInfo.push( { name: 'version', value: web3.version.ethereum } );
    ethereumEthInfo.push( { name: 'address', value: web3.eth.coinbase } );
    ethereumEthInfo.push( { name: 'gas price', value: web3.toBigNumber( web3.eth.gasPrice ).toString( 10 ) } );
    var balance = web3.eth.getBalance( web3.eth.coinbase );
    ethereumEthInfo.push( { name: 'balance', value: web3.toBigNumber( balance ).toString( 10 ) } );
    ethereumEthInfo.push( { name: 'mining', value: web3.eth.mining } );

  } else {
    ethereumClientInfo.push( {name: 'state', value: 'dead' } );
  }
  
  displayMsg( 'App', 'ethereumAppInfo', ethereumAppInfo );
  displayMsg( 'Client', 'ethereumClientInfo', ethereumClientInfo ); 
  displayMsg( 'Network', 'ethereumNetworkInfo', ethereumNetworkInfo ); 
  displayMsg( 'Ethereum', 'ethereumEthInfo', ethereumEthInfo ); 
/*
  //console.log('web3.version.whisper : ' + web3.version.whisper); 
  console.log('web3.eth.accounts : ' + web3.eth.accounts); 
*/
  debug(9,'main','END main()');
}
