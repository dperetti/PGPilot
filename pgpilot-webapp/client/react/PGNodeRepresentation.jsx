const Button = ReactBootstrap.Button
const Glyphicon = ReactBootstrap.Glyphicon
const Panel = ReactBootstrap.Panel
const DropdownButton = ReactBootstrap.DropdownButton
const MenuItem = ReactBootstrap.MenuItem
const ProgressBar = ReactBootstrap.ProgressBar
const OverlayTrigger = ReactBootstrap.OverlayTrigger
const Popover = ReactBootstrap.Popover
const Grid = ReactBootstrap.Grid
const Row = ReactBootstrap.Row
const Col = ReactBootstrap.Col
const Table = ReactBootstrap.Table
const Label = ReactBootstrap.Label

PGNodeRepresentation = class PGNodeRepresentation extends React.Component {

    humanizeState(state) {
        return {
            'NOT_A_DB_CLUSTER': <Label>Not a database cluster yet</Label>,
            'CREATING_SLAVE': 'Creating slave...',
            'NO_SERVER_RUNNING': <Label bsStyle="danger">Server is down</Label>,
            'SERVER_IS_RUNNING': <Label bsStyle="success">Server is up</Label>
        }[state]
    }

    render() {

        const model = this.props.model

        const classSet = classNames({
            socket: true,
            up: model.state == "SERVER_IS_RUNNING",
            disconnected: !model.connected
        })

        let status

        if (model.connected) {
            status = <div className="node-status">
                <span className="state">{this.humanizeState(model.state)}</span>
                <span className="disk-usage">{model.disk_usage}&nbsp;/&nbsp;{model.free_space}</span>
            </div>
        } else {
            status = <div className="node-status">
                <div>Connection to the node is broken. Try to reconnect.</div>
            </div>
        }


        const header = <div>
            <div>{model.name}</div>
            <span className="address">
                <span className="ip">{model.ip}</span>
                :
                <span className="postgres-port">{model.postgres_port}</span>
                &nbsp;
                <span className="websocket-port">{model.websocket_port}</span>
            </span>
            <div className="node-edit-button">
                <DropdownButton title={<span className="fa fa-cogs" aria-hidden="true"></span>}
                                onSelect={this.handleSelectAction.bind(this, model._id)}
                                bsStyle="link" noCaret={true} pullRight={true} id="popover">
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
            </div>
            {status}
        </div>

        let slave_section = null
        let slots_section = null
        let replications_section = null
        let databases_section = null
        let actions_section = <div></div>

        if (model.state == 'NOT_A_DB_CLUSTER') {

        } else {
            if (model.slave_of) {
                var primary = Nodes.findOne(model.slave_of)
                if (primary) {

                    slave_section = <tr>
                        <td colSpan="2">SLAVE &#8592; {primary.ip} ({primary.postgres_port})</td>
                    </tr>
                }
            } else {
                if (model.slots && model.slots.length > 0) {

                    var t = <Glyphicon glyph='ban-circle'/>

                    slots_section =
                        <tr>
                            <td>slots</td>
                            <td className="slots">
                                {model.slots.map( (r) => {
                                    var statusClassSet = classNames({
                                        'slot-status': true,
                                        'slot-status-up': r.active,
                                        'slot-status-down': !r.active
                                    })
                                    var deleteSlotButton = ""
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
                                })}
                            </td>
                        </tr>
                }
                if (model.replications && model.replications.length > 0) {
                    replications_section =
                        <tr>
                            <td>replications</td>
                            <td className="replications">
                                {model.replications.map( (r, i) => {
                                    return <div key={r.client_addr+i}>{r.client_addr}&nbsp;{r.state}</div>
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
                        <ButtonPlus onClick={this.onCreateMaster.bind(this)} bsStyle="default" bsSize="small" /* #ulcSu# */
                                    spinning={model.running_command == 'init_primary'}>Create Master</ButtonPlus>
                        &nbsp;
                        <DropdownButton title='Create Slave' bsSize="small" pullRight={true} /* #mxfVL# */
                                        onSelect={this.onCreateSlave.bind(this, model._id)} id="create-slave-dropdown">
                            <MenuItem header={true}>Choose Master:</MenuItem>
                            {this.props.master_nodes.filter( n => n._id != model._id).map( (r) => {
                                var disabled = r.state != 'SERVER_IS_RUNNING' ? 'disabled' : ''
                                return (
                                    <MenuItem eventKey={r._id} key={r._id}
                                              className={disabled}>{r.ip} {r.postgres_port} {r.state != 'SERVER_IS_RUNNING' ? 'Not started' : ''}</MenuItem>
                                )
                            })}
                        </DropdownButton>
                    </div>
            }
            if (model.state == 'CREATING_SLAVE') {
                actions_section = <div>
                    <ProgressBar striped active now={model.progress} />
                </div>

            }
            if (model.state == 'NO_SERVER_RUNNING') {
                actions_section = <div>
                    <ButtonPlus onClick={this.onStartServer.bind(this)} bsStyle="success" bsSize="xsmall"
                                spinning={model.running_command == 'start'}>Start Server</ButtonPlus>
                </div>
            }
            if (model.state == 'SERVER_IS_RUNNING') {

                if (model.databases && model.databases.length > 0) {
                    var style = {
                        fontSize: "11px",
                        fontWeight: "normal",
                        backgroundColor: "#999",
                        cursor: 'pointer'
                    }
                    var databaseIcon = <span className="fa fa-database" aria-hidden="true"></span>
                    var tableIcon = <span className="fa fa-table" aria-hidden="true"></span>
                    databases_section =
                        <tr>
                            <td colSpan="2">
                                {model.databases.map( (database, i) => {

                                    var tables
                                    if (database.tables.length > 0) {
                                        tables = database.tables.map( (r, i) => {
                                            return <span className="badge" style={style} key={r[0]}>{tableIcon}&nbsp;{r[0]}&nbsp;({r[1]})</span>
                                        })
                                    } else {
                                        tables = <span><i>Empty database</i></span>
                                    }
                                    var popoverTitle = <span>{databaseIcon}&nbsp;{database.name}</span>
                                    var content = <Popover title={popoverTitle} id="popover">{tables}</Popover>
                                    return  <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={content} key={database.name}>
                                        <span className="badge" style={style}>
                                            {databaseIcon}&nbsp;{database.name}&nbsp;({database.tables.length})
                                        </span>
                                    </OverlayTrigger>
                                    //return <span className="badge" style={style} key={r.name}>{r.name}&nbsp;{r.tables.length}</span>;
                                })}
                            </td>
                        </tr>
                }
                var children = []

                // Progress if any
                if (model.running_command == "backup") {
                    children.push(
                        <ProgressBar active now={100} label='Backup in Progress' />
                    )
                }

                // Stop server button
                children.push(
                    <ButtonPlus onClick={this.onStopServer.bind(this)} bsStyle="danger" bsSize="xsmall"
                                            spinning={model.running_command == 'stop'}>Stop Server</ButtonPlus>
                )

                // Promote to master button if flase
                if (model.slave_of) {
                    children.push(<span>&nbsp;</span>)
                    children.push(<ButtonPlus onClick={this.onPromoteToMaster.bind(this)} bsStyle="warning" bsSize="xsmall"
                                              spinning={model.running_command == 'promote_to_master'}>Promote to
                        master</ButtonPlus>)
                }
                actions_section = <div children={children}/>


            }

        } else {
            actions_section = <Button onClick={this.onConnect.bind(this)}>Connect</Button>
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
    }

    /** Dropdown menus and button Actions **/

    handleSelectAction(node_id, event, eventKey) {

        switch (eventKey) {
            case "edit":
                PGPilot.uiEditSettings(this.props.model._id)
                break
            case "delete":
                PGPilot.uiDeleteNode(this.props.model._id)
                break
            case "postgres_password":
                PGPilot.uiChangePostgresPassword(this.props.model._id)
                break
            case "make_backup":
                PGPilot.uiMakeBackup(this.props.model._id)
                break
            case "backups":
                PGPilot.uiOpenBackups(this.props.model._id)
                break
            case "erase":
                PGPilot.uiEraseData(this.props.model._id)
                break
            case "benchmark":
                PGPilot.uiBenchmark(this.props.model._id)
                break
        }
    }

    onConnect() {
        PGPilot.connect(this.props.model)
    }

    onCreateMaster() { // #AevV8#
        PGPilot.createMaster(this.props.model._id)
    }

    onCreateSlave(node_id, event, master_node_id) { // #EuUua#
        console.log(master_node_id)
        PGPilot.createSlave(node_id, master_node_id)
    }

    onStartServer() {
        PGPilot.startServer(this.props.model._id)
    }

    onStopServer() {
        PGPilot.stopServer(this.props.model._id)
    }

    onPromoteToMaster() {
        PGPilot.promoteToMaster(this.props.model._id)
    }

    onDropReplicationSlot(slot_name) {
        PGPilot.dropReplicationSlot(this.props.model._id, slot_name)
    }
}
