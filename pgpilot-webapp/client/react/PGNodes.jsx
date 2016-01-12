
PGNodes = React.createClass({

    mixins: [ReactMeteorData],

    templateName: "PGNodes",

    getMeteorData() {

        return {
            nodes: Nodes.find({}, {sort: {name: 1}}).fetch(),
            master_nodes: Nodes.find({connected: true}, {fields: {state: 1, ip: 1, _id: 1, postgres_port: 1}}).fetch()
        }
    },

    render() {

        return (
            <div className="container">
                <div className="row">
                    {this.data.nodes.map((node) => {
                        return <div className="col-md-4" key={node._id}>
                            <PGNodeRepresentation model={node} master_nodes={this.data.master_nodes}/>
                        </div>
                    })}
                </div>
            </div>
        )
    }
})
