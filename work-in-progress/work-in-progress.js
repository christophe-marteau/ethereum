var Circles = new Meteor.Collection('circles');

if (Meteor.isClient) {
  var data = Circles.findOne().data;
  console.log(data)

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Circles.insert({data: [5, 8, 11, 14, 17, 20]});

}

