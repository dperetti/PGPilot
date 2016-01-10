
PGNodes = ReactMeteor.createClass({

    templateName: "PGNodes",

    getMeteorState() {

        return {
            nodes: Nodes.find({}, {sort: {name: 1}}).fetch()
        };
    },


    render() {

        return (
            <div className="container">
                <div className="row">
                    {this.state.nodes.map(function(node) {
                        return <div className="col-md-4" key={node._id}>
                            <PGNodeRepresentation model={node} />
                        </div>
                    })}
                </div>
            </div>
        )
    }
});
