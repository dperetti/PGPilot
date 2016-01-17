Modal = ReactBootstrap.Modal;
Input = ReactBootstrap.Input;
Grid = ReactBootstrap.Grid;
Row = ReactBootstrap.Row;
Col = ReactBootstrap.Col;

NodeEditModal = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {

        // If we're creating a new node, no model was passed, so it's null.
        if (this.props.model == null) { // #ttxNh#
            return {
                mode: "new",
                name: "",
                host: "",
                websocket_port: 8888,
                postgres_port: 5432,
                check_server_cert: false
            };
        } else {
            var state = _.pick(this.props.model, 'name', 'host', 'websocket_port', 'postgres_port', 'password', 'check_server_cert', 'server_cert');
            state.mode = "edit";
            return state;
        }
    },

    handleSave: function() {  // #TuC43#
        if ( this.state.host == undefined || this.state.host.length == 0 ) {
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
                show={true}
                onRequestHide={this.props.handleHide}>

                <div className='modal-body'>
                    <Grid fluid={true}>
                        <Row>
                            <Col md={6}>
                                <Input valueLink={this.linkState('name')} type="text" label="Name" placeholder="Development"
                                    help="Description of the node"/>
                            </Col>
                            <Col md={6}>
                                <Input valueLink={this.linkState('host')} type="text" label="HOST or IP" placeholder="Ex: 192.168.0.1"
                                    help="HOST or IP Address of the node"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Input valueLink={this.linkState('websocket_port')} type="text" label="Websocket port of the node" placeholder="ex: 8888"
                                       help="The external port you set when you launched the docker container"/>
                            </Col>
                            <Col md={6}>
                                <Input valueLink={this.linkState('postgres_port')} type="text" label="PostgreSQL port" placeholder="ex: 5432"
                                    help="The external port you set when you launched the docker container"/>
                            </Col>
                        </Row>
                        <Input valueLink={this.linkState('password')} type="textarea" label="PGPilot Password" placeholder="ex: TheSuperPAsSwOrD"
                            help="PG Pilot password you set when you launched the docker container"/>
                        <Input checkedLink={this.linkState('check_server_cert')} type="checkbox" label="Check server certificate" />
                        <Input valueLink={this.linkState('server_cert')} type="textarea" label="Certificate" placeholder="-----BEGIN CERTIFICATE-----..." help="(server.pem)"/>
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
