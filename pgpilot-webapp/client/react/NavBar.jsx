Navbar = ReactBootstrap.Navbar;
Brand = ReactBootstrap.NavbarBrand
Nav = ReactBootstrap.Nav;
NavItem = ReactBootstrap.NavItem;
ButtonToolbar = ReactBootstrap.ButtonToolbar;
Button = ReactBootstrap.Button;

MainNavBar = React.createClass({

    mixins: [ReactMeteorData],

    templateName: "MainNavBar",

    getMeteorData() {

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

    handleSaveConfiguration() {
        PGPilot.uiSaveConfiguration();
    },

    render() {

        var handleBlur = function(text) {

            Project.set({
                name: text
            });
        };




        return <Navbar inverse fixedTop fluid >
            <Brand>
                <img src="/Logo.png" /><span className="title"><i><EditableSpan text={this.data.projectName} handleBlur={handleBlur} /></i></span>
            </Brand>

            <Nav navbar pullRight>
                <ButtonToolbar>
                    <Button onClick={this.handleRefresh} className="navbar-btn" bsStyle='primary'>Refresh</Button>
                    <Button onClick={this.handleNewNode} className="navbar-btn" bsStyle='primary'>New Node</Button>{/* #FWNuw# */}
                    <Button onClick={this.handleSaveConfiguration} className="navbar-btn" bsStyle='primary'>Save Configuration</Button>
                    <span>&nbsp;</span>
                </ButtonToolbar>
            </Nav>
        </Navbar>
    }
});
