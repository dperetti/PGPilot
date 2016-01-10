Input = ReactBootstrap.Input;
Modal = ReactBootstrap.Modal;

CreateMasterModal = ReactMeteor.createClass({

    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        handleSave: React.PropTypes.func.isRequired,
        title: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            title: "Init primary server",
            handleSave: function() {
                alert("props.handleSave() must be implemented")
            }
        }
    },

    getInitialState() {
        return {
            'postgresUser': 'no-access'
        }
    },

    handleChange: function(event) {
        this.setState({postgresUser: event.target.value});
    },

    handleSave: function() {
        this.props.handleHide();
        this.props.handleSave(this.state);
    },

    render() { // #sP7sm#
        return (
            <Modal ref="modal" title={this.props.title}
                   bsStyle='primary'
                   backdrop={true}
                   animation={true}
                   onRequestHide={this.props.handleHide}>

                <div className='modal-body'>
                    <form className='form-horizontal'>
                        <div className="form-group">
                            <label className="col-md-4 control-label">postgres user</label>

                            <div className="col-md-4">
                                <div className="radio">
                                    <label>
                                        <input type='radio' label='No network access' defaultChecked onChange={this.handleChange} value="no-access" name="postgresUser" standalone/>
                                        No network access
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type='radio' label='Set password' onChange={this.handleChange} value="accessible" name="postgresUser" standalone />
                                        Set password :
                                    </label>
                                </div>
                            </div>
                        </div>
                        <Input type='text' label='Password' valueLink={this.linkState('password')}  disabled={this.state.postgresUser == 'no-access'} labelClassName='col-md-4' wrapperClassName='col-md-4'/>
                    </form>
                </div>
                <div className='modal-footer'>
                    <Button onClick={this.props.handleHide}>Cancel</Button>
                    <Button onClick={this.handleSave} bsStyle='success'>Create</Button>
                </div>
            </Modal>
        )
    }
});
