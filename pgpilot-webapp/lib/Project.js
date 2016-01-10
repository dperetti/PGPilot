//
//Projects = new Meteor.Collection('projects');
//Projects.getProject = function() {
//    return Projects.findOne({key:'project'});
//}
Project = function() {

    var collection = new Meteor.Collection('projects');
    var project_id;
    var KEY = "dummy";

    var init = function() {

        if (Meteor.isServer) {
            collection.remove({});
            project_id = collection.insert({key: KEY, name: "Blah"});
            //console.log(project_id);

        } else {
            //console.log(collection.find({}).fetch());
            //var project = collection.findOne({key: KEY});
            //project_id = project._id
            //console.log(project_id);
        }
    }

    var set = function(obj) {
        var project = collection.findOne({key: KEY})
        collection.update(project._id, {$set: obj});
    }

    var get = function (key) {

        try {
            return collection.findOne({key: KEY})[key];
        } catch (e) {
            return undefined;
        }
    }

    var project = function () {
        var project = collection.findOne({key: KEY});
        return project
    }

    return {
        init: init,
        set: set,
        get: get,
        project: project,
        collection: collection
    }
}();

Project.init();