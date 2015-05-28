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
  htmlOutput += '<table>';
  for( var i = 0; i < msgArray.length; i++ ) {  
    htmlOutput += '<tr><td class="msgBody"><strong>' + msgArray[i].name + ' </strong></td><td><strong> : </strong>' + msgArray[i].value + '</td></tr>';
  }
  htmlOutput += '</table>';
  debug( 8, 'displayMsg( ' + msgTitle + ', ' + tagId + ', ' + JSON.stringify( msgArray ) + ' ) = "' + htmlOutput + '"' );
  document.getElementById( tagId ).innerHTML = htmlOutput;
  debug( 9, 'END displayMsg()' );
}

function index() {
  debug( 9, 'BEGIN index()' );

  var web3 = require( 'web3' );
  var clientUrl = 'http://localhost:8545';
  
  web3.setProvider( new web3.providers.HttpProvider( clientUrl ) );

  var ethereumEthInfo = [];
  var ethereumSendTransaction = [];

  if( isClientAlive( clientUrl ) ) {
    ethereumEthInfo.push( { name: 'address', value: web3.eth.coinbase } );
  //  ethereumEthInfo.push( { name: 'account(s)', value: web3.eth.accounts } );
    ethereumEthInfo.push( { name: 'gas price', value: web3.toBigNumber( web3.eth.gasPrice ).toString( 10 ) } );
    var balance = web3.eth.getBalance( web3.eth.coinbase );
    ethereumEthInfo.push( { name: 'balance (wei)', value: web3.toBigNumber( balance ).toString( 10 ) } );
    ethereumEthInfo.push( { name: 'balance (ether)', value: web3.toBigNumber( balance ).dividedBy(1000000000000000000).toString( 10 ) } );
    ethereumEthInfo.push( { name: 'balance (BTC)*', value: web3.toBigNumber( balance ).dividedBy(1000000000000000000).times(0.0005).toString( 10 ) } );
    ethereumEthInfo.push( { name: 'balance (USD$)**', value: web3.toBigNumber( balance ).dividedBy(1000000000000000000).times(0.12156).toString( 10 ) } );
    ethereumEthInfo.push( { name: 'Block Number', value: web3.eth.blockNumber } );
    ethereumEthInfo.push( { name: 'Block (Default)', value: web3.eth.defaultBlock} );
    ethereumEthInfo.push( { name: 'Block (pending)', value: web3.eth.getBlock('pending').number} );
    ethereumEthInfo.push( { name: 'Storage At', value: web3.eth.getStorageAt( web3.eth.coinbase ) } );
  
                        
  } else {
    ethereumEthInfo.push( { name: 'Wallet', value: 'Offline' } );
  }
  displayMsg( 'Ethereum', 'ethereumEthInfo', ethereumEthInfo ); 
  
  ethereumSendTransaction.push( { id: 'from',  name: 'Sender address', type: 'text', value: web3.eth.accounts, list: 'yes' } ); // default
  ethereumSendTransaction.push( { id: 'to', name: 'Recipient address', type: 'text', value: '0xd825bd075a47d7febaff2dabce942b4aabedfef5' } );
  ethereumSendTransaction.push( { id: 'cost', name: 'Cost (wei)', type: 'text', value: '2000000000000000000' } ); // 2 ether
  ethereumSendTransaction.push( { id: 'fee', name: 'Fee (wei)', type: 'text', value: '1000000000000000000' } ); // 1 ether
  ethereumSendTransaction.push( { id: 'send', name: '', type: 'submit', value: 'Send' } ); // 1 ether

  senderHTMLOutput = '<datalist id="senderAddressList">';
  for ( var sal = 0; sal < web3.eth.accounts.length; sal++ ) {
    senderHTMLOutput += '<option value="' + web3.eth.accounts[sal]+ '">';
  }
  senderHTMLOutput += '</datalist>';

  if ( ! web3.eth.defaultAccount ) {
    web3.eth.defaultAccount = web3.eth.coinbase;
  }

  var sendFormHTMLOutput = '<p class="msgTitle"><strong>Ethereum Send Transaction</strong></p>' +
                           '<form method="POST" id="sendEtherForm" onsubmit="sendEther()">' +
                           '  <table>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Sender address</strong></td>' +
                           '      <td>' +
                           '        <input size="40" list="senderAddressList" id="from" value="' + web3.eth.defaultAccount + '">' +
                           senderHTMLOutput +
                           '      </td>' +
                           '    </tr>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Recipient address</strong></td>' +
                           '      <td>' +
                           '        <input size="40" id="to" type="text" value="0x01a186954e7c28e43b0c5b3e23627cfd735e6125">' +
                           '      </td>' +
                           '    </tr>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Cost (wei)</strong></td>' +
                           '      <td>' +
                           '        <input size="40" id="cost" type="text" value="2000000000000000000">' +
                           '      </td>' +
                           '    </tr>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Fee (wei)</strong></td>' +
                           '      <td>' +
                           '        <input size="40" id="fee" type="text" value="1000000000000000000">' +
                           '      </td>' +
                           '    </tr>' +
                           '  </table>' +
                           '  <input size="40" id="Send" type="submit" value="Send">' +
                           '</form>';

  document.getElementById( 'ethereumSendTransaction' ).innerHTML = sendFormHTMLOutput;
  debug( 9, 'END index()' );
}

function sendEther() {
  debug( 9, 'BEGIN sendEther()' );
  console.log(document.getElementById('from').value);
  console.log(document.getElementById('to').value);
  console.log(document.getElementById('cost').value);
  console.log(document.getElementById('fee').value);
  tData = { from: document.getElementById('from').value,
            to: document.getElementById('to').value,
            value: document.getElementById('cost').value };
  console.log( tData );
  web3.eth.sendTransaction( tData );
  debug( 9, 'END sendEther()' );
}

function about() {
  debug( 9, 'BEGIN about()' );

  var web3 = require( 'web3' );
  var clientUrl = 'http://localhost:8545';

  var ethereumAppInfo = [ { name: 'api', value: web3.version.api } ];
  var ethereumClientInfo = [ { name: 'url', value: clientUrl } ];
  var ethereumNetworkInfo = [];

  web3.setProvider( new web3.providers.HttpProvider( clientUrl ) );
 
  if( isClientAlive( clientUrl ) ) {
    ethereumClientInfo.push( { name: 'state', value: 'alive' } );
    ethereumClientInfo.push( { name: 'version', value: web3.version.client } );
    ethereumNetworkInfo.push( { name: 'version', value: web3.version.network } );
    ethereumNetworkInfo.push( { name: 'listen', value: web3.net.listening } );
    ethereumNetworkInfo.push( { name: 'peer(s)', value: web3.net.peerCount } );

  } else {
    ethereumClientInfo.push( {name: 'state', value: 'dead' } );
  }
  
  displayMsg( 'App', 'ethereumAppInfo', ethereumAppInfo );
  displayMsg( 'Client', 'ethereumClientInfo', ethereumClientInfo ); 
  displayMsg( 'Network', 'ethereumNetworkInfo', ethereumNetworkInfo ); 
  
  debug( 9, 'about','END about()' );
}
