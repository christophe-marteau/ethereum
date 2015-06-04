var DEBUG = 0;

/* This function display a debug message in the console
   [in] level : The debug level
   [in] debugMessage : The message to display in the console
*/
function debug( level, debugMessage ) {
  if( DEBUG >= level ) {
    console.log( '[' + level + '](' + debug.caller.name + '): ' + debugMessage );
  }
}

/* This function generate HTML output for an error
   [in] errorMessage : The message to display
*/
function genError( errorMessage ) {
  return( '<table>' +
          '  <tr>' +
          '    <td><img class="error" src="images/error.png" alt="Error icon"></td>' +
          '    <td><p class=error>' + errorMessage + '</p></td>' +
          '  </tr>' +
          '</table>' );
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
 This function generate a HTML output making a form with elements'
 [in] formId : The form Id
 [in] formTitle : The title for the form
 [in] formData : The array containing elements
 [in] formSubmitFunction : The function call after the form is submitted
 [return] The HTML output for the table
*/
function genForm( formId, formTitle, formData, formSubmitFunction ) {
  debug( 9, 'BEGIN genForm()' );
  debug( 8, 'genForm( ' + formId + ', ' + formTitle + ', ' + JSON.stringify( formData ) + ', ' + formSubmitFunction + ' )' );
 
  var formHTMLOutput = '<div class="row">' +
                        '  <div class="cell">' +
                        '    <p class="formTitle"><strong>' + formTitle + '</strong></p>' +
                        '    <form method="POST" id="' + formId + '" onsubmit=\'' + formSubmitFunction + '\' >' +
                        '      <table>';

  for( var i = 0; i < formData.length; i++ ) {  
    switch( formData[i].type ) {
      case 'submit' :
        formHTMLOutput += '<tr><td class="submit" colspan="2"><input id="' + formData[i].id + '" type="submit" value="' + formData[i].value + '"></tr></td>';
        break;

      case 'select' :
        var selectHTMLOutput = '<select id="' + formData[i].id + '">' ;
        debug( 7, 'Found "' + formData[i].value.length + '" option(s) to add.' );
        for ( var o = 0; o < formData[i].value.length; o++ ) {
          debug( 7, 'Add <option> [' + formData[i].value[o].name + '] = "' + formData[i].value[o].value + '" to <select> "' + formData[i].id + '"' );
          var optionDisplayText = '';
          switch ( formData[i].display ) {
            case 'nameAndValue' :
              optionDisplayText = ' ( ' + formData[i].value[o].name + ' ) ' + formData[i].value[o].value;
              break;
            default :
              optionDisplayText = formData[i].value[o].value;
          }
          selectHTMLOutput += '<option value="' + formData[i].value[o].value + '">' +
                                optionDisplayText +
                              '</option>';
        }
        selectHTMLOutput += '</select>';

        formHTMLOutput += '<tr>' +
                          '  <td class="formDataHeader"><strong>' + formData[i].name + '</strong></td>' + 
                          '  <td class="formDataContent"><strong>: </strong> ' + selectHTMLOutput + '  </td>' + 
                          '</tr>';
        break;
      case 'text' :
        break;

      default:
        formHTMLOutput += genError( 'Form element default content. Should never happend ....' );
    }
  }
  
  formHTMLOutput += '      </table>' +
                    '    </form>' + 
                    '  </div>' +
                    '</div>' + 
                    '<div class="space"></div>'; 
  
  debug( 8, 'genForm( ' + formId + ', ' + formTitle + ', ' + JSON.stringify( formData ) + ', ' + formSubmitFunction + ' ) = "' + formHTMLOutput + '"');
  debug( 9, 'END genForm()' );
  return( formHTMLOutput );
}

/* 
  This function reset a form, preventing data to be resent
  [in] formId : The form Id ro reset
*/
function resetForm( formId ) {
  debug( 1, 'BEGIN resetForm()' );
  debug( 1, 'BEGIN resetForm()' );
  document.getElementById( formId ).reset();
  document.getElementById( formId ).method = 'GET';
  debug( 1, 'END resetForm()' );
}

/* 
  This function set the default account address choose by user in the select field
  [in] formId : The form Id from which this function is called
  [in] elementId : The id of the select field 
*/
function setDefaultAccountAdress( formId, elementId ) {
  debug( 1, 'BEGIN setDefaultAccountAddress()' );
  debug( 1, 'BEGIN setDefaultAccountAddress( ' + elementId + ' )' );
  setLocalStorageData( 'defaultAccountAddress', document.getElementById( elementId ).value );
  resetForm( formId );
  debug( 1, 'END setDefaultAccountAddress()' );
}

/* 
  This function erase all local storage variable (localStorage)
  [in] formId : The form Id from which this function is called
*/
function resetSettings( formId ) {
  debug( 1, 'BEGIN resetSettings()' );
  resetForm( formId );
  if ( window.confirm( 'Are you sure to reset all Settings ?' ) == true ) {
    localStorage.clear();
  }
  debug( 1, 'END resetSettings()' );
}

/*
 This function generate a HTML output making a table of elements'
 [in] tableTitle : The title for the table
 [in] tableData : The array containing elements (name: <name to display> value: <value to display>)
 [return] The HTML output for the table
*/
function genTable( tableTitle, tableData ) {
  debug( 9, 'BEGIN genTable()' );
  debug( 8, 'genTable( ' + tableTitle + ', ' + JSON.stringify( tableData ) + ' )' );
 
  var tableHTMLOutput = '<div class="row">' +
                        '  <div class="cell">' +
                        '    <p class="tableTitle"><strong>' + tableTitle + '</strong></p>' +
                        '    <table>';

  for( var i = 0; i < tableData.length; i++ ) {  
    tableHTMLOutput += '<tr>' +
                       '  <td class="tableDataHeader"><strong>' + tableData[i].name + '</strong></td>' + 
                       '  <td class="tableDataContent"><strong>:</strong> ' + tableData[i].value + '</td>' +
                       '</tr>';
  }
  
  tableHTMLOutput += '    </table>' + 
                     '  </div>' +
                     '</div>' +
                     '<div class="space"></div>'; 
  
  debug( 8, 'genTable( ' + tableTitle + ', ' + JSON.stringify( tableData ) + ' ) = "' + tableHTMLOutput + '"');
  debug( 9, 'END genTable()' );
  return( tableHTMLOutput );
}

/*
 This function generate a HTML output making clickable menu tab'
 [in] activeMenu : The active tab 
 [in] menuData : The array containing menu data ( id: "<menu Id>" display: "<Menu name displayed>" )
 [return] The HTML output for the menu
*/
function genMenu( menuData ) {
  debug( 9, 'BEGIN  genMenu()' );
  debug( 8, 'genMenu( ' + JSON.stringify( menuData ) + ' )' );
  
  var menuHTMLOutput = '<div class="menu">';
  var state = '';
  
  for( var i = 0; i < menuData.length; i++ ) {
    if ( getLocalStorageData( 'activeMenu' ) == menuData[i].id ) {
      state = 'active';
    } else {
      state = 'inactive';
    }
    menuHTMLOutput += '<div class="cellMenu" id="' + state + '">' +
                      '  <p class="menu"  id="' + menuData[i].id + '" onclick=\'main( "' + menuData[i].id + '" )\'>' + 
                           menuData[i].display + 
                      '  </p>' +
                      '</div>';
    
  }
  menuHTMLOutput += '</div>';
 
  debug( 8, 'genMenu( ' + JSON.stringify( menuData ) + ' ) = "' + menuHTMLOutput + '"' );
  debug( 9, 'END genMenu()' );
  return( menuHTMLOutput ) 
}

/* 
  This function store any kind of value in local storage
  [in] key : The local storage key
  [in] value : The value to store
*/
function setLocalStorageData( key, value ) {
  debug( 9, 'BEGIN setLocalStorageData()' );
  debug( 8, 'setLocalStorageData( ' + key + ', ' + JSON.stringify( value ) + ' )' );
  localStorage.setItem( key, JSON.stringify( value ) );
  debug( 7, 'localStorage[ "' + key + '" ] = "' + JSON.stringify( value ) + '"' );
  debug( 9, 'END setLocalStorageData()' );
}

/* 
  This function get any kind of value from local storage
  [in] key : The local storage key
  [return] The value from local storage address by key
*/
function getLocalStorageData( key ) {
  debug( 9, 'BEGIN getLocalStorageData()' );
  debug( 8, 'getLocalStorageData( ' + key + ' )' );

  debug( 7, 'localStorage[' + key + '] = "' + localStorage.getItem( key ) + '"' );
 
  var storageValue = undefined;
  if ( localStorage.getItem( key ) !== null ) {
    storageValue =  JSON.parse( localStorage.getItem( key ) );
  }

  debug( 8, 'getLocalStorageData( ' + key + ' ) = "' + storageValue + '"' );
  debug( 9, 'END getLocalStorageData()' );
  return( storageValue );
}
  
function main( menuId ) {
  debug( 9, 'BEGIN main()' );
  debug( 8, 'main( ' + menuId + ' )' );

  var bodyHTMLOutput = '<h1>Wallet App</h1>';
  if ( typeof( Storage ) === 'undefined' ) {
    bodyHTMLOutput += genError( 'Local storage object not supported ...' );
  } else {
    debug( 1, 'Local storage object : [OK]' );
  
    if ( getLocalStorageData( 'activeMenu' ) === undefined ) {
      setLocalStorageData( 'activeMenu', "home" );
    } else {
      if ( menuId !== undefined ) {
        setLocalStorageData( 'activeMenu', menuId );
      }
    }
    debug( 1, 'Active menu : "' + getLocalStorageData( 'activeMenu' ) + '"' );
  
    var menuData = [];
    menuData.push( { id: 'home', display: 'Home' } );
    menuData.push( { id: 'accounts', display: 'Accounts' } );
    menuData.push( { id: 'send', display: 'Send' } );
    menuData.push( { id: 'about', display: 'About' } );
  
    bodyHTMLOutput += genMenu( menuData );
  
    bodyHTMLOutput += '<div class="app">'; 
    
    var web3 = require( 'web3' );
    var clientUrl = 'http://localhost:8545';
 
    web3.setProvider( new web3.providers.HttpProvider( clientUrl ) );
    
    var ethereumClientInfo = [];
   
    debug( 7, 'web3.eth.accounts.indexOf( ' + getLocalStorageData( 'defaultAccountAddress' ) + ' ) : ' + web3.eth.accounts.indexOf( getLocalStorageData( 'defaultAccountAddress' ) ) );
  
    if ( ( getLocalStorageData( 'defaultAccountAddress' ) ) === undefined || ( web3.eth.accounts.indexOf( getLocalStorageData( 'defaultAccountAddress' ) ) < 0 ) ) {
      setLocalStorageData( 'defaultAccountAddress', web3.eth.coinbase );
      debug( 1, 'Initializing default account address to : "' + getLocalStorageData( 'defaultAccountAddress' ) + '"' );
    }
    
    if( isClientAlive( clientUrl ) ) {
      
      switch( getLocalStorageData( 'activeMenu' ) ) {
        case 'home' :
          var defaultAccountInfo = [];
          defaultAccountInfo.push( { name: 'Account address', value: getLocalStorageData( 'defaultAccountAddress' ) } );
          
          var balance = web3.eth.getBalance( getLocalStorageData( 'defaultAccountAddress' ) );
          var defaultAccountWeiBalance = web3.toBigNumber( balance ).toString( 10 );
          defaultAccountInfo.push( { name: 'Balance (wei)', value: defaultAccountWeiBalance } );
  
          var defaultAccountEtherBalance = web3.toBigNumber( balance ).dividedBy(1000000000000000000).toString( 10 );
          defaultAccountInfo.push( { name: 'Balance (ETH)', value: defaultAccountEtherBalance } );
          
          bodyHTMLOutput += genTable( 'Default account informations', defaultAccountInfo );
  
          var defaultAccountAdditionnalInfo = [];
          var defaultAccountBTCBalance = web3.toBigNumber( balance ).dividedBy(1000000000000000000).times(0.0005).toString( 10 );
          defaultAccountAdditionnalInfo.push( { name: 'Balance (BTC)', value: defaultAccountBTCBalance } );
  
          var defaultAccountUSDBalance = web3.toBigNumber( balance ).dividedBy(1000000000000000000).times(0.12156).toString( 10 );
          defaultAccountAdditionnalInfo.push( { name: 'Balance (USD)', value: defaultAccountUSDBalance } );
          
          bodyHTMLOutput += genTable( 'Additionnal informations', defaultAccountAdditionnalInfo );
          break;

        case 'accounts' :
          var defaultAccountInfo = [];
          defaultAccountInfo.push( { name: 'Default account', value: getLocalStorageData( 'defaultAccountAddress' ) } );
  
          bodyHTMLOutput += genTable( 'Default account informations', defaultAccountInfo );
          
          var otherAccountInfo = [];
          for ( var a = 0; a < web3.eth.accounts.length; a++ ) {
            otherAccountInfo.push( { name: '[' + a + '] account', value: web3.eth.accounts[a] } );
          }
          
          // bodyHTMLOutput += genTable( 'Other accounts informations', otherAccountInfo );
  
          var defaultAccountFormData = [];
          defaultAccountFormData.push( { id: 'accountSelection', name: 'Choose an account', type: 'select', value: otherAccountInfo } );
          defaultAccountFormData.push( { id: 'setDefaultAccount', type: 'submit', value: 'Set default account' } );
          bodyHTMLOutput += genForm( 'setDefaultAccountForm', 'Set default Account', defaultAccountFormData, 'setDefaultAccountAdress( "setDefaultAccountForm", "accountSelection" )' );

          var recipientAccountFormData = [];
          //recipientAccountFormData.push( { id: 'addrecipientAccountAddress', type: 'text', value: 'Add account' } );
          //recipientAccountFormData.push( { id: 'addRecipientAccountAddressSubmit', type: 'submit', value: 'Add account' } );

          localStorage.removeItem('recipientAccountAddressList');
          if ( getLocalStorageData( 'recipientAccountAddressList' ) === undefined ) {
            setLocalStorageData( 'recipientAccountAddressList', [{ name: 'None', value: '' }] );
            debug( 7, 'Initializing  recipientAccountAddressList : "' + getLocalStorageData( 'recipientAccountAddressList' ) + '"' );
          }

          recipientAccountFormData.push( { id: 'recipientAccountSelection', name: 'Choose an account', type: 'select', value: getLocalStorageData( 'recipientAccountAddressList' ), display: 'nameAndValue'  } );
          recipientAccountFormData.push( { id: 'delRecipientAccountAddressSubmit', type: 'submit', value: 'Remove account' } );
          bodyHTMLOutput += genForm( 'addRecipientAccountAddressForm', 'Recipients accounts address', recipientAccountFormData, 'addRecipientAccountAddress( "recipientAccountAddress" )' );
  
          break;

        case 'send' :
            bodyHTMLOutput += 'SEND';
            break;

        case 'about':
          ethereumClientInfo.push( { name: 'url', value: clientUrl } );
          ethereumClientInfo.push( { name: 'state', value: 'alive' } );
          ethereumClientInfo.push( { name: 'version', value: web3.version.client } );
      
          var ethereumClientAPI = [ { name: 'version', value: web3.version.api } ];
     
          var ethereumNetworkInfo = [];
          ethereumNetworkInfo.push( { name: 'version', value: web3.version.network } );
          ethereumNetworkInfo.push( { name: 'listen', value: web3.net.listening } );
          ethereumNetworkInfo.push( { name: 'peer(s)', value: web3.net.peerCount } );
  
          bodyHTMLOutput += genTable( "Ethereum API", ethereumClientAPI );
          bodyHTMLOutput += genTable( "Ethereum Client", ethereumClientInfo );
          bodyHTMLOutput += genTable( "Ethereum Network", ethereumNetworkInfo );

          var resetSettingsFormData = [];
          resetSettingsFormData.push( { id: 'resetSettingsSubmit', type: 'submit', value: 'Reset all settings' } );
          bodyHTMLOutput += genForm( 'resetSettingsForm', 'Reset all settings', resetSettingsFormData, 'resetSettings( "resetSettingsForm" )' );
          if ( DEBUG > 0 ) {
            var ethereumUnitTestData = [];
            ethereumUnitTestData.push( { name: 'Unit test', value: '<a href="unitTest.html">Q-Unit</a>' } );
 
            bodyHTMLOutput += genTable( "Unit Test", ethereumUnitTestData );
          }
          break;
        default:
          bodyHTMLOutput += genError( 'Menu default content. Should never happend ....' );
      }
  
    } else {
      ethereumClientInfo.push( {name: 'State', value: 'offline' } );
      bodyHTMLOutput += genTable( "Ethereum Client", ethereumClientInfo );
    }
    
    bodyHTMLOutput += '</div>'; 
  }
  document.getElementById( 'myApp' ).innerHTML = bodyHTMLOutput;
  debug( 9, 'END main()' );
}



function oldindex() {
  debug( 9, 'BEGIN index()' );

  var web3 = require( 'web3' );
  var clientUrl = 'http://localhost:8545';
  
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
