/**
 * Launch a modal
 * @param modal React modal class
 * @param {Object} otherProps
 * @returns {*}
 */
launchModal = function(modal, otherProps) { // #aWzaF#

    var mountNode = document.getElementById("modal-placeholder");

    var ModalWrapper = ReactMeteor.createClass({

        getInitialState() {
            var props = _.extend({}, otherProps, {
                handleHide: this.handleHide
            });

            return {
                open: true,
                modal: React.createElement(this.props.modal, props)
            }
        },

        handleHide () {
            this.setState({
                open: false
            });
        },

        componentWillReceiveProps(nextProps) {
            // when openModal wants to render MyModal for the second time,
            // this method is called. This is the opportunity to reopen the modal.
            this.setState({
                open: true
            });
        },
        render() {
            if ( !this.state.open ) {
                return <span/>
            } else return this.state.modal;
        }
    });

    React.render(<ModalWrapper modal={modal}  />, mountNode);
};
