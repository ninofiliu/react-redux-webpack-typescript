import * as React from 'react';
import { connect } from 'react-redux';

import { State } from '../store';

class Display extends React.Component<{ name: string, age: number}> {
    render() {
        return (
            <p>
                {this.props.name} is {this.props.age} years old.
            </p>
        )
    }
}

const mapStateToProps = (state: State) => ({
    age: state.age.value,
    name: state.name.value
});

export default connect(mapStateToProps)(Display);