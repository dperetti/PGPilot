Meteor.startup(function() { // #Cypuu#
    ReactDOM.render(<MainNavBar />, document.getElementById("navbar"));
    ReactDOM.render(<PGNodes />, document.getElementById("nodes"));

    // We don't use React for the console at the moment, still use Blaze.
    //ReactDOM.render(<Console />, document.getElementById("console"));

});
