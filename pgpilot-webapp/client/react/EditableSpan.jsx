
EditableSpan = React.createClass( {
    displayName: 'EditableSpan',

    getInitialState: function() {

        return {
            text: this.props.text,
            editing: false
        }
    },

    componentWillReceiveProps: function(props) {
        this.setState({
            text: props.text
        })
    },

    getDefaultProps: function() {
        var t = this;
        return {
            handleBlur: function() {
            }
        }
    },

    render: function() {

        var style = {
            backgroundColor: 'transparent',
            minWidth: "100px"
        };

        if ( this.state.editing ) {
            return <input type="text" value={this.state.text} style={style}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
                          onKeyUp={this.handleKeyUp}
                          onBlur={this.handleBlur} />;

        } else {
            var t;
            if ( this.state.text && this.state.text.length > 0 ) {
                t = this.state.text;
            } else {
                t = "<Untitled>";
            }
            return <span style={style} onClick={this.handleClick}>{t}</span>;
        }
    },

    handleChange: function(event) {
        this.setState({
            text: event.target.value
        });
    },

    handleKeyDown: function(event) {
        if ( _.contains([9, 13, 38, 40], event.which) ) {
            event.preventDefault();
        }
    },

    handleKeyUp: function(event) {
        if ( event.which == 13 ) {
            event.preventDefault();
            this.handleBlur();
        }
    },

    handleBlur: function(event) {
        this.setState({
            editing: false
        });
        this.props.handleBlur(this.state.text);
    },

    handleClick: function(event) {
        //console.log($(event.target).width());
        this.setState({
            editing: true
        })
    }

} );
