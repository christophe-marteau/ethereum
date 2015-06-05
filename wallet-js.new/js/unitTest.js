QUnit.module( "Global" );
QUnit.test( "genError", function( assert ) {
  assert.deepEqual( genError( undefined ), '<table><tr><td><img class="error" src="images/error.png" alt="Error icon"></td><td><p class=error>Undefined error</p></td></tr></table>', 'Check that an undefined error return "Undefined error"' );
  assert.deepEqual( genError( '' ), '<table><tr><td><img class="error" src="images/error.png" alt="Error icon"></td><td><p class=error>Undefined error</p></td></tr></table>', 'Check that a blanck error return "Undefined error"' );
  assert.deepEqual( genError( 'my error message' ), '<table><tr><td><img class="error" src="images/error.png" alt="Error icon"></td><td><p class=error>my error message</p></td></tr></table>', 'Check that a custom error return a well formated error message' );
} );

QUnit.module( "Ethereum missing features" );
QUnit.test( "isClientAlive", function( assert ) {
  assert.deepEqual( isClientAlive( '' ), undefined, 'Return undefined when the client URL is blank' );
  assert.deepEqual( isClientAlive( 'htp://localhost:8454' ), undefined, 'Return undefined when the client scheme URL is not well formated' );
  assert.deepEqual( isClientAlive( 'http://localho)*:8454' ), undefined, 'Return undefined when the client hosname URL is not well formated' );
  assert.deepEqual( isClientAlive( 'http://localhost:de54' ), undefined, 'Return undefined when the client port URL is not well formated' );
  assert.deepEqual( isClientAlive( 'not an url' ), undefined, 'Return undefined when the client URL is not well formated' );
} );

QUnit.module( "Storage" );
QUnit.test( "getLocalStorageData", function( assert ) {
  assert.deepEqual( getLocalStorageData( 'unSet' ), undefined, 'Check that an unset value return "undefined"' );
  setLocalStorageData( 'myTestData', 'myTestOk' ),  
  assert.deepEqual( getLocalStorageData( 'myTestData' ), 'myTestOk', "Check that a set value can be retrieve" );
} );

