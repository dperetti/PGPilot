Navbar = ReactBootstrap.Navbar;
Nav = ReactBootstrap.Nav;
NavItem = ReactBootstrap.NavItem;
ButtonToolbar = ReactBootstrap.ButtonToolbar;
Button = ReactBootstrap.Button;

MainNavBar = ReactMeteor.createClass({

    templateName: "MainNavBar",

    getMeteorState() {

        return {
            projectName: Project.get('name')
        }
    },

    getDefaultProps() {
        return {
            spinning: false
        }
    },

    propTypes: {
        spinning: React.PropTypes.bool
    },

    handleRefresh() {
        PGPilot.refresh();
    },

    handleNewNode() { // #q78pK#
        PGPilot.uiEditSettings();
    },

    handleToggleConsole() {
        $('.collapse').collapse('toggle');
    },

    handleSaveConfiguration() {
        PGPilot.uiSaveConfiguration();
    },

    render() {

        var handleBlur = function(text) {

            Project.set({
                name: text
            });
        };


        var brand = <span><img src="/Logo.png" /><span className="title">PG Pilot – <i><EditableSpan text={this.state.projectName} handleBlur={handleBlur} /></i></span></span>;

        return <Navbar brand={brand} inverse fixedTop fluid >

            <Nav navbar right>
                <ButtonToolbar>
                    <Button onClick={this.handleRefresh} className="navbar-btn" bsStyle='primary'>Refresh</Button>
                    <Button onClick={this.handleToggleConsole} className="navbar-btn" bsStyle='primary'>Toggle Console</Button>
                    <Button onClick={this.handleNewNode} className="navbar-btn" bsStyle='primary'>New Node</Button>{/* #FWNuw# */}
                    <Button onClick={this.handleSaveConfiguration} className="navbar-btn" bsStyle='primary'>Save Configuration</Button>
                    <span>&nbsp;</span>
                </ButtonToolbar>
            </Nav>
        </Navbar>
    }
});
