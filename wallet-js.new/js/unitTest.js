QUnit.module( 'Global' );
QUnit.test( 'genError', function( assert ) {
  assert.deepEqual( genError( undefined ), '<table><tr><td><img class="error" src="images/error.png" alt="Error icon"></td><td><p class=error>Undefined error</p></td></tr></table>', 'Check that an undefined error return "Undefined error"' );
  assert.deepEqual( genError( '' ), '<table><tr><td><img class="error" src="images/error.png" alt="Error icon"></td><td><p class=error>Undefined error</p></td></tr></table>', 'Check that a blank error return "Undefined error"' );
  assert.deepEqual( genError( 'my error message' ), '<table><tr><td><img class="error" src="images/error.png" alt="Error icon"></td><td><p class=error>my error message</p></td></tr></table>', 'Check that a custom error return a well formated error message' );
} );

QUnit.module( 'Ethereum missing features' );
QUnit.test( 'isClientAlive', function( assert ) {
  assert.deepEqual( isClientAlive( '' ), undefined, 'Return undefined when the client URL is blank' );
  assert.deepEqual( isClientAlive( undefined ), undefined, 'Return undefined when the client URL is undefined' );
  assert.deepEqual( isClientAlive( 'htp://localhost:8454' ), undefined, 'Return undefined when the client scheme URL is not well formated' );
  assert.deepEqual( isClientAlive( 'http://localho)*:8454' ), undefined, 'Return undefined when the client hosname URL is not well formated' );
  assert.deepEqual( isClientAlive( 'http://localhost:de54' ), undefined, 'Return undefined when the client port URL is not well formated' );
  assert.deepEqual( isClientAlive( 'not an url' ), undefined, 'Return undefined when the client URL is not well formated' );
  assert.deepEqual( isClientAlive( 'http://ethereumNodeValidURLSyntax.but.dead:1234' ), false, 'Return false when the client URL is valid but node not alive' );
} );

QUnit.module( 'Storage' );
QUnit.test( 'setLocalStorageData', function( assert ) {
  setLocalStorageData( 'myTestData', 'myTestOk' ),  
  assert.deepEqual( JSON.parse( localStorage.getItem( 'myTestData' ) ), 'myTestOk', "Check setting a value " );
} );
QUnit.test( 'getLocalStorageData', function( assert ) {
  assert.deepEqual( getLocalStorageData( 'unSet' ), undefined, 'Check that an unset value return "undefined"' );
  setLocalStorageData( 'myTestData', 'myTestOk' ),  
  assert.deepEqual( getLocalStorageData( 'myTestData' ), 'myTestOk', "Check that a set value can be retrieve" );
} );

QUnit.module( 'Framework' );
QUnit.test( 'genForm', function( assert ) {
  // formId
  assert.deepEqual( genForm( undefined, 'myFormTitle', [ { name: 'myInputId', value: 'myInputValue', type: 'submit' } ], 'submitMyForm()' ), genError( 'Undefined or blank form id' ), 'Return an error when formId is undefined' );
  assert.deepEqual( genForm( '', 'myFormTitle', [ { name: 'myInputId', value: 'myInputValue', type: 'submit' } ], 'submitMyForm()' ), genError( 'Undefined or blank form id' ), 'Return an error when formId is blank' );
  
  // formTitle
  assert.deepEqual( genForm( 'myFormId', undefined, [ { name: 'myInputId', value: 'myInputValue', type: 'submit' } ], 'submitMyForm()' ), genError( 'Undefined form title' ), 'Return an error when formTitle is undefined' );

  // formData
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', undefined, 'submitMyForm()' ), genError( 'Undefined or blank or empty form data' ), 'Return an error when formData is undefined' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', '', 'submitMyForm()' ), genError( 'Undefined or blank or empty form data' ), 'Return an error when formData is blank' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [] , 'submitMyForm()' ), genError( 'Undefined or blank or empty form data' ), 'Return an error when formData is blank' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ undefined ], 'submitMyForm()' ), genError( 'Undefined or blank or empty form data' ), 'Return an error when an element in formData is undefined' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: undefined, value: 'myInputValue', type: 'submit' } ], 'submitMyForm()' ), genError( 'Undefined or blank form data element id' ), 'Return an error when an element id in formData is undefined' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: '', value: 'myInputValue', type: 'submit' } ], 'submitMyForm()' ), genError( 'Undefined or blank form data element id' ), 'Return an error when an element id in formData is blank' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: 'myInputId', value: undefined, type: 'submit' } ], 'submitMyForm()' ), genError( 'Undefined form data element value' ), 'Return an error when an element value in formData is undefined' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: 'myInputId', value: 'myInputValue', type: undefined } ], 'submitMyForm()' ), genError( 'Undefined form data element type' ), 'Return an error when an element type in formData is undefined' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: 'myInputId', value: 'myInputValue', type: 'BadType' } ], 'submitMyForm()' ), genError( 'Bad form data element type' ), 'Return an error when an element type in formData is bad' );
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: 'myInputId', value: 'myInputValue', type: '' } ], 'submitMyForm()' ), genError( 'Bad form data element type' ), 'Return an error when an element type in formData is blank' );

  //formSubmitFunction
  assert.deepEqual( genForm( 'myFormId', 'myFormTitle', [ { id: 'myInputId', value: 'myInputValue', type: 'submit' } ], undefined ), genError( 'Undefined form submit function' ), 'Return an error when formSubmitFunction is undefined' );
} );

