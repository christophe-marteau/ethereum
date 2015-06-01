var DEBUG = 9;
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

/*
 This function generate a HTML output making clickable menu tab'
 [in] activeMenu : The active tab 
 [in] menuData : The array containing menu data ( id: "<menu Id>" display: "<Menu name displayed>" )
 [return] The HTML output for ethe menu
*/
function genMenu( activeMenu, menuData ) {
  debug( 9, 'BEGIN  genMenu()' );
  debug( 8, 'genMenu( ' + activeMenu + ', ' + JSON.stringify( menuData ) + ' )' );
  
  var menuHTMLOutput = '<div class="menu">';
  var state = '';

  for( var i = 0; i < menuData.length; i++ ) {
    if ( activeMenu == menuData[i].id ) {
      state = 'active';
    } else {
      state = 'inactive';
    }
    menuHTMLOutput += '<div class="cellMenu" id="' + state + '">' +
                      '  <p class="menu"  id="' + menuData[i].id + '" onclick=\'index( "' + menuData[i].id + '" )\'>' + 
                           menuData[i].display + 
                      '  </p>' +
                      '</div>';
    
  }
  menuHTMLOutput += '</div>';
 
  debug( 8, 'genMenu( ' + activeMenu + ', ' + JSON.stringify( menuData ) + ' ) = "' + menuHTMLOutput + '"' );
  debug( 9, 'END genMenu()' );
  return( menuHTMLOutput ) 
}
  
function index( menuId ) {
  debug( 9, 'BEGIN index' );
  debug( 8, 'index( ' + menuId + ' )' );

  var menuData = [];
  menuData.push( { id: 'home', display: 'Home' } );
  menuData.push( { id: 'accounts', display: 'Accounts' } );
  menuData.push( { id: 'send', display: 'Send' } );
  menuData.push( { id: 'about', display: 'About' } );

  var bodyHTMLOutput = '';
  var menuActive = 'home';
  
  bodyHTMLOutput += genMenu( menuId, menuData );

  switch( menuId ) {
    case 'home' :
        bodyHTMLOutput += 'HOME';
        break;
    case 'accounts':
        bodyHTMLOutput += 'ACCOUNTS';
        break;
    case 'send' :
        bodyHTMLOutput += 'SEND';
        break;
    case 'about':
        bodyHTMLOutput += 'ABOUT';
        break;
    default:
        bodyHTMLOutput += 'Menu default content. Should never happend ....';
  }

  document.getElementById( 'myApp' ).innerHTML = bodyHTMLOutput;
  debug( 9, 'END index' );
}



function oldindex() {
  debug( 9, 'BEGIN index()' );

  var web3 = require( 'web3' );
  var clientUrl = 'http://localhost:8546';
  
  web3.setProvider( new web3.providers.HttpProvider( clientUrl ) );

  if( isClientAlive( clientUrl ) ) {
    var bodyHTMLOutput = '';
    var accountsHTMLOutput = '<tr class="border"><td class="border"></td><td class="border"></td></tr>'
    for ( var a = 0; a < web3.eth.accounts.length; a++ ) {
      var balance = web3.eth.getBalance( web3.eth.accounts[a] );
      accountsHTMLOutput += '<tr><td class="msgBody"><strong>Address</strong></td><td><strong> : </strong>' + web3.eth.accounts[a] + '</td></tr>' +
                            '<tr><td class="msgBody"><strong>Balance (wei)</strong></td><td><strong> : </strong>' + web3.toBigNumber( balance ).toString( 10 ) + '</td></tr>' +
                            '<tr><td class="msgBody"><strong>Balance (ether)</strong></td><td><strong> : </strong>' + web3.toBigNumber( balance ).dividedBy(1000000000000000000).toString( 10 ) + '</td></tr>' +
                            '<tr><td class="msgBody"><strong>balance (BTC)*</strong></td><td><strong> : </strong>' + web3.toBigNumber( balance ).dividedBy(1000000000000000000).times(0.0005).toString( 10 ) + '</td></tr>' +
                            '<tr><td class="msgBody"><strong>Balance (USD$)**</strong></td><td><strong> : </strong>' + web3.toBigNumber( balance ).dividedBy(1000000000000000000).times(0.12156).toString( 10 ) + '</td></tr>' +
                            '<tr class="border"><td class="border"></td><td class="border"></td></tr>';
    }
    
    bodyHTMLOutput = '<p class="msgTitle"><strong>Ethereum</strong></p>' +
                     '<table>' +
                     '  <tr><td class="msgBody"><strong>Default address</strong></td><td><strong> : </strong>' + web3.eth.coinbase + '</td></tr>' +
                     '  <tr><td class="msgBody"><strong>Fee (wei)</strong></td><td><strong> : </strong>' + web3.eth.gasPrice + '</td></tr>' +
                     accountsHTMLOutput +
                     '  <tr><td class="msgBody"><strong>Default Block</strong></td><td><strong> : </strong>' + web3.eth.defaultBlock + '</td></tr>' +
                     '  <tr><td class="msgBody"><strong>Current Block</strong></td><td><strong> : </strong>' + web3.eth.blockNumber + '</td></tr>' +
                     '  <tr><td class="msgBody"><strong>Pending Block</strong></td><td><strong> : </strong>' + web3.eth.getBlock('pending').number + '</td></tr>' +
                     '</table>';
                        
  } else {
    bodyHTMLOutput = '<p class="msgTitle"><strong>Ethereum</strong></p>' +
                     '<table>' +
                     '  <tr><td class="msgBody"><strong>Wallet is offline</strong></td></tr>' +
                     '</table>';
  }
  document.getElementById( 'ethereumEthInfo' ).innerHTML = bodyHTMLOutput;

  senderHTMLOutput = '<datalist id="senderAddressList">';
  for ( var sal = 0; sal < web3.eth.accounts.length; sal++ ) {
    senderHTMLOutput += '<option value="' + web3.eth.accounts[sal]+ '">';
  }
  senderHTMLOutput += '</datalist>';

  recipientHTMLOutput = '<datalist id="recipientAddressList">' +
                        '  <option value="0x01a186954e7c28e43b0c5b3e23627cfd735e6125"' +
                        '</datalist>';

  if ( ! web3.eth.defaultAccount ) {
    web3.eth.defaultAccount = web3.eth.coinbase;
  }

  var sendFormHTMLOutput = '<p class="msgTitle"><strong>Ethereum Send Transaction</strong></p>' +
                           '<form method="POST" id="sendEtherForm" onsubmit="sendEther()">' +
                           '  <table>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Sender address</strong></td>' +
                           '      <td>' +
                           '        <input size="45" list="senderAddressList" id="from" value="' + web3.eth.defaultAccount + '" required>' +
                           senderHTMLOutput +
                           '      </td>' +
                           '    </tr>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Recipient address</strong></td>' +
                           '      <td>' +
                           '        <input size="45" list="recipientAddressList" id="to" value="0x01a186954e7c28e43b0c5b3e23627cfd735e6125" required>' +
                           recipientHTMLOutput +
                           '      </td>' +
                           '    </tr>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Cost (wei)</strong></td>' +
                           '      <td>' +
                           '        <input size="45" id="cost" type="text" value="2000000000000000000" required>' +
                           '      </td>' +
                           '    </tr>' +
                           '    <tr>' + 
                           '      <td class="header"><strong>Fee (wei)</strong></td>' +
                           '      <td>' +
                           '        <input size="45" id="fee" type="text" value="1000000000000000000" required>' +
                           '      </td>' +
                           '    </tr>' +
                           '  </table>' +
                           '  <input id="Send" type="submit" value="Send">' +
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

  web3.eth.sendTransaction( tData, function( transactionError, transactionAddress ) {
    if ( transactionError ) {
      window.alert( transactionError );
    } else {
      window.alert( transactionAddress );
    }
  });

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
