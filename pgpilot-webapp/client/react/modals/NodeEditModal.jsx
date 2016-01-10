Modal = ReactBootstrap.Modal;
Input = ReactBootstrap.Input;
Grid = ReactBootstrap.Grid;
Row = ReactBootstrap.Row;
Col = ReactBootstrap.Col;

NodeEditModal = ReactMeteor.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {

        // If we're creating a new node, no model was passed, so it's null.
        if (this.props.model == null) { // #ttxNh#
            return {
                mode: "new",
                name: "",
                ip: "",
                toolbox_port: 8888,
                postgres_port: 5432,
                check_server: false
            };
        } else {
            var state = _.pick(this.props.model, 'name', 'ip', 'toolbox_port', 'postgres_port', 'password', 'check_server', 'server_cert');
            state.mode = "edit";
            return state;
        }
    },

    handleSave: function() {  // #TuC43#
        if ( this.state.ip == undefined || this.state.ip.length == 0 ) {
            alert('IP must be set');
        } else {
            this.props.handleHide();
            this.props.handleSave(this.state);
        }
    },

    render() {
        return (
            <Modal ref="modal" title='Node settings'
                bsStyle='primary'
                backdrop={true}
                animation={true}
                onRequestHide={this.props.handleHide}>

                <div className='modal-body'>
                    <Grid fluid={true}>
                        <Row>
                            <Col md={6}>
                                <Input valueLink={this.linkState('name')} type="text" label="Name" placeholder="Development"
                                    help="Description of the node."/>
                            </Col>
                            <Col md={6}>
                                <Input valueLink={this.linkState('ip')} type="text" label="IP Address" placeholder="Ex: 192.168.0.1"
                                    help="IP Address of the node. Required if the hostname isn't accessible from the network."/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Input valueLink={this.linkState('toolbox_port')} type="text" label="Websocket port of the node" placeholder="ex: 8888"
                                       help="Websocket port of the toolbox"/>
                            </Col>
                            <Col md={6}>
                                <Input valueLink={this.linkState('postgres_port')} type="text" label="PostgeSQL port" placeholder="ex: 5432"
                                    help="The external port you set when you launched the docker container"/>
                            </Col>
                        </Row>
                        <Input valueLink={this.linkState('password')} type="textarea" label="PGPilot Password" placeholder="ex: TheSuperPAsSwOrD"
                            help="Postgres Pilot Password set when you launched the docker container"/>
                        <Input checkedLink={this.linkState('check_server')} type="checkbox" label="Check server certificate" />
                        <Input valueLink={this.linkState('server_cert')} type="textarea" label="Certificate" placeholder="-----BEGIN CERTIFICATE-----..."/>
                    </Grid>
                </div   >
                <div className='modal-footer'>
                    <Button onClick={this.props.handleHide}>Cancel</Button>
                    <Button bsStyle='success' onClick={this.handleSave}>{this.state.mode == 'edit' ? 'Save Changes' : 'Create Node'}</Button>
                </div>
            </Modal>
        )
    }
});
