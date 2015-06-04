QUnit.test("Storage", function( assert ) {
  assert.equal(getLocalStorageData( 'unSet' ), undefined );
  setLocalStorageData( 'myTestData', 'myTestOk' ),  
  assert.equal(getLocalStorageData( 'myTestData' ), 'myTestOk' );
});

