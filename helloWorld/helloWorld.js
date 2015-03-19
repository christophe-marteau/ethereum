if (Meteor.isClient) {
  web3.setProvider(new web3.providers.HttpProvider('http://' + nodeSettings.host + ':' + nodeSettings.port));

  Template.ethereumInfo.helpers({
    ethereumInfo: {
      ethereumVersion: String(web3.version),
      ethereumNetworkVersion: String(web3.network),
      ethereumAPIVersion: String(web3.api)
    }
  });
  
  Template.ethereumNode.helpers({
    ethereumNode: {
      ethereumNodeHost: String(nodeSettings.host),
      ethereumNodePort: String(nodeSettings.port)
    }
  });
 
  Template.ethereumClientBinded.helpers({
    isClientBinded: web3.net.listening
  });

  Template.ethereumClientInfo.helpers({
      ethereumClientInfo: { 
        ethereumClientVersion: String(web3.client),
        ethereumClientListenState: String(web3.net.listening),
        ethereumClientPeerCount: String(web3.net.peerCount),
        ethereumClientMiningState: String(web3.eth.mining),
        ethereumClientCoinbaseAddress: String(web3.eth.coinbase)
      }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log('')
    console.log('Connection to node "' + nodeSettings.host + '" on port "' + nodeSettings.port + '".')
  });
}
