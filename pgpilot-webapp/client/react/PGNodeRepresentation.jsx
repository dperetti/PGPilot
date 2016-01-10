var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var Panel = ReactBootstrap.Panel;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var ProgressBar = ReactBootstrap.ProgressBar;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Table = ReactBootstrap.Table;
var Label = ReactBootstrap.Label;

var cx = React.addons.classSet;


PGNodeRepresentation = ReactMeteor.createClass({

    templateName: "PGNodeRepresentation",

    /**
     * Wires the state of this component to the Meteor data.
     */
    getMeteorState() {

        var model = Nodes.findOne(this.props.model._id);

        return {
            model: model,
            master_nodes: Nodes.find({connected: true, _id: {$ne: this.props.model._id}},
                {fields: {state: 1, ip: 1, _id: 1, postgres_port: 1}}).fetch() // WARN: creates an overhead on refreshes
        };
    },

    humanizeState(state) {
        return {
            'NOT_A_DB_CLUSTER': <Label>Not a database cluster yet</Label>,
            'CREATING_SLAVE': 'Creating slave...',
            'NO_SERVER_RUNNING': <Label bsStyle="danger">Server is down</Label>,
            'SERVER_IS_RUNNING': <Label bsStyle="success">Server is up</Label>
        }[state];
    },

    render() {

        var model = this.state.model;
        if (model == null) {
            console.log("model is null !");
        }
        var classSet = cx({
            socket: true,
            up: model.state == "SERVER_IS_RUNNING",
            disconnected: !model.connected
        });

        var status;

        if (model.connected) {
            status = <div className="node-status">
                <span className="state">{this.humanizeState(model.state)}</span>
                <span className="disk-usage">{model.disk_usage}&nbsp;/&nbsp;{model.free_space}</span>
            </div>;
        } else {
            status = <div className="node-status">
                <div>Connection to the node is broken. Try to reconnect.</div>
            </div>
        }

        var t = <span className="fa fa-cogs" aria-hidden="true"></span>;
        var header = <div>
            <div>{model.name}</div>
            <span className="address">
                <span className="ip">{model.ip}</span>
                :
                <span className="postgres-port">{model.postgres_port}</span>
                &nbsp;
                <span className="toolbox-port">{model.toolbox_port}</span>
            </span>
            <DropdownButton title={t}
                            onSelect={this.handleSelectAction.bind(this, model._id)}
                            className="node-edit-button" bsStyle="link" noCaret={true} pullRight={true}>
                <MenuItem eventKey='edit'>Edit</MenuItem>
                <MenuItem eventKey='delete'>Delete Node</MenuItem>
                <MenuItem eventKey='postgres_password'>Change postgres User Password</MenuItem>
                <MenuItem divider/>
                <MenuItem eventKey='make_backup'>Make Backup...</MenuItem>
                <MenuItem eventKey='backups'>Backups...</MenuItem>
                <MenuItem divider/>
                <MenuItem eventKey='erase'>Erase database cluster</MenuItem>
                <MenuItem divider/>
                <MenuItem eventKey='benchmark'>Run benchmark test</MenuItem>
            </DropdownButton>

            {status}
        </div>;

        var slave_section = null;
        var slots_section = null;
        var replications_section = null;
        var databases_section = null;
        var actions_section = <div></div>;

        if (model.state == 'NOT_A_DB_CLUSTER') {

        } else {
            if (model.slave_of) {
                var primary = Nodes.findOne(model.slave_of);
                if (primary) {

                    slave_section = <tr>
                        <td colSpan="2">SLAVE &#8592; {primary.ip} ({primary.postgres_port})</td>
                    </tr>
                }
            } else {
                if (model.slots && model.slots.length > 0) {

                    var t = <Glyphicon glyph='ban-circle'/>;

                    slots_section =
                        <tr>
                            <td>slots</td>
                            <td className="slots">
                                {_.map(model.slots, function (r) {
                                    var statusClassSet = cx({
                                        'slot-status': true,
                                        'slot-status-up': r.active,
                                        'slot-status-down': !r.active
                                    });
                                    var deleteSlotButton = "";
                                    if (!r.active) {
                                        deleteSlotButton =
                                            <Button onClick={this.onDropReplicationSlot.bind(this, r.slot_name)}
                                                    bsStyle="link" bsSize='xsmall'
                                                    className="button-delete">{t}</Button>
                                    }

                                    return (<div className="slot" key={r.slot_name}>
                                        <div className={statusClassSet}></div>
                                        <span className="label label-default">{r.slot_name}</span>
                                        {deleteSlotButton}
                                    </div>)
                                }, this)}
                            </td>
                        </tr>
                }
                if (model.replications && model.replications.length > 0) {
                    replications_section =
                        <tr>
                            <td>replications</td>
                            <td className="replications">
                                {model.replications.map(function (r, i) {
                                    return <div key={r.client_addr+i}>{r.client_addr}&nbsp;{r.state}</div>;
                                })}
                            </td>
                        </tr>
                }
            }
        }

        if (model.connected) {
            if (model.state == 'NOT_A_DB_CLUSTER') {
                actions_section =
                    <div>
                        <ButtonPlus onClick={this.onCreateMaster} bsStyle="default" bsSize="small" /* #ulcSu# */
                                    spinning={model.running_command == 'init_primary'}>Create Master</ButtonPlus>
                        &nbsp;
                        <DropdownButton title='Create Slave' bsSize="small" pullRight={true} /* #mxfVL# */
                                        onSelect={this.onCreateSlave.bind(this, model._id)}>
                            <MenuItem header={true}>Choose Master:</MenuItem>
                            {this.state.master_nodes.map(function (r) {
                                var disabled = r.state != 'SERVER_IS_RUNNING' ? 'disabled' : '';
                                return (
                                    <MenuItem eventKey={r._id} key={r._id}
                                              className={disabled}>{r.ip} {r.postgres_port} {r.state != 'SERVER_IS_RUNNING' ? 'Not started' : ''}</MenuItem>
                                )
                            })}
                        </DropdownButton>
                    </div>;
            }
            if (model.state == 'CREATING_SLAVE') {
                actions_section = <div>
                    <ProgressBar striped active now={model.progress} />
                </div>;

            }
            if (model.state == 'NO_SERVER_RUNNING') {
                actions_section = <div>
                    <ButtonPlus onClick={this.onStartServer} bsStyle="success" bsSize="xsmall"
                                spinning={model.running_command == 'start'}>Start Server</ButtonPlus>
                </div>;
            }
            if (model.state == 'SERVER_IS_RUNNING') {

                if (model.databases && model.databases.length > 0) {
                    var style = {
                        fontSize: "11px",
                        fontWeight: "normal",
                        backgroundColor: "#999",
                        cursor: 'pointer'
                    };
                    var databaseIcon = <span className="fa fa-database" aria-hidden="true"></span>;
                    var tableIcon = <span className="fa fa-table" aria-hidden="true"></span>;
                    databases_section =
                        <tr>
                            <td colSpan="2">
                                {model.databases.map(function (database, i) {

                                    var tables;
                                    if (database.tables.length > 0) {
                                        tables = database.tables.map(function (r, i) {
                                            return <span className="badge" style={style} key={r[0]}>{tableIcon}&nbsp;{r[0]}&nbsp;({r[1]})</span>;
                                        });
                                    } else {
                                        tables = <span><i>Empty database</i></span>;
                                    }
                                    var popoverTitle = <span>{databaseIcon}&nbsp;{database.name}</span>;
                                    var content = <Popover title={popoverTitle}>{tables}</Popover>;
                                    return  <OverlayTrigger trigger='hover' placement='bottom' overlay={content} key={database.name}>
                                        <span className="badge" style={style}>
                                            {databaseIcon}&nbsp;{database.name}&nbsp;({database.tables.length})
                                        </span>
                                    </OverlayTrigger>;
                                    //return <span className="badge" style={style} key={r.name}>{r.name}&nbsp;{r.tables.length}</span>;
                                })}
                            </td>
                        </tr>
                }
                var children = [];

                // Progress if any
                if (model.running_command == "backup") {
                    children.push(
                        <ProgressBar active now={100} label='Backup in Progress' />
                    )
                }

                // Stop server button
                children.push(
                    <ButtonPlus onClick={this.onStopServer} bsStyle="danger" bsSize="xsmall"
                                            spinning={model.running_command == 'stop'}>Stop Server</ButtonPlus>
                );

                // Promote to master button if flase
                if (model.slave_of) {
                    children.push(<span>&nbsp;</span>);
                    children.push(<ButtonPlus onClick={this.onPromoteToMaster} bsStyle="warning" bsSize="xsmall"
                                              spinning={model.running_command == 'promote_to_master'}>Promote to
                        master</ButtonPlus>);
                }
                actions_section = <div children={children}/>


            }

        } else {
            actions_section = <Button onClick={this.onConnect}>Connect</Button>
        }

        return (
            <Panel header={header} className="node">
                <Table condensed fill>
                    <tbody>
                    {databases_section}
                    {slave_section}
                    {slots_section}
                    {replications_section}
                    </tbody>
                </Table>
                {actions_section}
            </Panel>
        )
    },

    /** Dropdown menus and button Actions **/

    handleSelectAction(node_id, eventKey) {

        switch (eventKey) {
            case "edit":
                PGPilot.uiEditSettings(this.props.model._id);
                break;
            case "delete":
                PGPilot.uiDeleteNode(this.props.model._id);
                break;
            case "postgres_password":
                PGPilot.uiChangePostgresPassword(this.props.model._id);
                break;
            case "make_backup":
                PGPilot.uiMakeBackup(this.props.model._id);
                break;
            case "backups":
                PGPilot.uiOpenBackups(this.props.model._id);
                break;
            case "erase":
                PGPilot.uiEraseData(this.props.model._id);
                break;
            case "benchmark":
                PGPilot.uiBenchmark(this.props.model._id);
                break;
        }
    },

    onConnect() {
        PGPilot.connect(this.props.model);
    },

    onCreateMaster() { // #AevV8#
        PGPilot.createMaster(this.props.model._id);
    },

    onCreateSlave(node_id, master_node_id) { // #EuUua#
        PGPilot.createSlave(node_id, master_node_id);
    },

    onStartServer() {
        PGPilot.startServer(this.props.model._id);
    },

    onStopServer() {
        PGPilot.stopServer(this.props.model._id);
    },

    onPromoteToMaster() {
        PGPilot.promoteToMaster(this.props.model._id);
    },

    onDropReplicationSlot(slot_name) {

        PGPilot.dropReplicationSlot(this.props.model._id, slot_name);
        //Meteor.call('cmd_drop_replication_slot', node, slot_name)
    }
});
