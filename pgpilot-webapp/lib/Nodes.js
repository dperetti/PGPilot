/**
 * Nodes collection. Represent pgtoolbox server nodes.
 * @type {Mongo.Collection}
 */
Nodes = new Meteor.Collection('nodes');

/**
 * Create a node in the database
 * @param {string} ip
 * @param {string} hostname
 * @param {string} password
 * @param {bool} check_server
 * @param {string} server_cert
 * @param {number} toolbox_port
 * @param {number} postgres_port
 * @returns {any}
 */
Nodes.createNode = function(name, ip, hostname, password, check_server, server_cert, toolbox_port, postgres_port) { // #KHERt#
    return Nodes.insert({
        name: name,
        ip: ip,
        hostname: hostname,
        password: password,
        check_server: check_server,
        server_cert: server_cert,
        toolbox_port: toolbox_port,
        postgres_port: postgres_port
    });
};

Nodes.setConnectionEstablished = function(node, connected) { // #JByg8#

    Nodes.update(node._id, {$set: {connected: connected, state: ''}});

    if (connected) {
        Controller.sendCommand(node, "status") // #tDgsV#
    } else {

    }
}

if ( Meteor.isServer ) {

    // https://atmospherejs.com/matb33/collection-hooks

    // When a new node is added, attempt to establish a socket
    Nodes.after.insert(function (userId, node) { // #gSksW#
        try {
            Comm.createSocket(node)

        } catch (e) {
            console.log(e)
        }
    });

    Nodes.after.remove(function (userId, node) {
        try {
            Comm.closeSocket(node)

        } catch (e) {
            console.log(e)
        }
    });

    Nodes.before.update(function (userId, node, fieldNames, modifier, options) {
        try {
            if (fieldNames.indexOf('ip') != -1 || fieldNames.indexOf('toolbox_port') != -1) {
                Comm.closeSocket(node)
            }

        } catch (e) {
            console.log(e)
        }
    });

    Nodes.after.update(function (userId, node, fieldNames, modifier, options) {
        try {
            if (fieldNames.indexOf('ip') != -1 || fieldNames.indexOf('toolbox_port') != -1) {

                Comm.createSocket(node)
            }
        } catch (e) {
            console.log(e)
        }
    });
}
