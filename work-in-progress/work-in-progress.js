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
  
  if (web3.net.listening) { 
    balance = web3.eth.getBalance(String(web3.eth.coinbase));

    Template.ethereumClientInfo.helpers({
      ethereumClientInfo: { 
        ethereumClientVersion: String(web3.client),
        ethereumClientListenState: String(web3.net.listening),
        ethereumClientPeerCount: String(web3.net.peerCount),
        ethereumClientMiningState: String(web3.eth.mining),
      }
    });
    
    var time = 0;
    Template.ethereumCoinInfo.helpers({
      ethereumCoinInfo: {
        ethereumCoinBaseAddress: String(web3.eth.coinbase),
        ethereumCoinBalance: String(balance),
        ethereumTime: String(time)
      }
    });
    

    Template.ethereumCoinInfo.helpers({
      ethereumCoinInfo: {
        ethereumCoinBaseAddress: String(web3.eth.coinbase),
        ethereumCoinBalance: String(balance),
        ethereumTime: String(time)
      }
    });

  
  Template.ethereumCoinBalanceChart.rendered = function () {
  //The data for our line
  var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                   { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                   { "x": 80,  "y": 5},  { "x": 100, "y": 60}];

  //This is the accessor function we talked about above
  var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
                         .interpolate("linear");

  //The SVG Container
  var svgContainer = d3.select("#balance").append("svg")
                                    .attr("width", 200)
                                    .attr("height", 200);

var axisScale = d3.scale.linear()
                         .domain([0,200])
                         .range([0,200]);

var xAxis = d3.svg.axis()
                  .scale(axisScale);



    var balanceData = [];
    Meteor.setInterval(function () {
      time += 5;
      while ( balanceData.length >  17280 ) {
        balanceData.splice(0,1); // remove the first elt
      }
      //balanceData.push( { "x": time, "y": web3.eth.getBalance(String(web3.eth.coinbase)) } );
      var signe = 1;
      if ( Math.random() > 0.5 ) { signe = -1; } else { signe = 1; }
      data = Math.floor((Math.random() * 100) + 1);

      balanceData.push( { "x": time, "y": data } );
      console.log('Timer : ' + String(time) + ' -- Data : ' + data);
  //The line SVG Path we draw
  var lineGraph = svgContainer.append("path")
                            .attr("d", lineFunction(balanceData))
                            .attr("stroke", "blue")
                            .attr("stroke-width", 2)
                            .call(xAxis)
                            .attr("fill", "none");
    }, 5000); 

  };

  }
}

if (Meteor.isServer) {
  var time = 0;
  Meteor.startup(function () {
    console.log('');
    console.log('Connection to node "' + nodeSettings.host + '" on port "' + nodeSettings.port + '".');
  });

}
