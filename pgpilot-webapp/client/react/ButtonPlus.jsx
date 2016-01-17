
ButtonPlus = React.createClass({

    templateName: "ButtonPlus",

    getDefaultProps() {
        return {
            spinning: false
        }
    },

    propTypes: {
        spinning: React.PropTypes.bool
    },

    render() {
        var spinner = <span className="spinner"><span className="fa fa-refresh fa-spin"></span></span>;

        var spinningClassSet = "has-spinner";
        spinningClassSet += this.props.spinning ? " active disabled" : "";

        var { ...other } = this.props;
        return <Button {...other} className={spinningClassSet}>
            {spinner}
            {this.props.children}
        </Button>
    }
});
