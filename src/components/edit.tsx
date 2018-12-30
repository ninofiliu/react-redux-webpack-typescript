import * as React from 'react';
import { connect } from 'react-redux';

import { store } from '../store';
import { setValue as setAge } from '../store/age.reducer';
import { setValue as setName } from '../store/name.reducer';

type EditProps = {
    setName: (name: string) => void,
    setAge: (age: number) => void
}
type EditState = {
    name: string,
    age: number
}
class Edit extends React.Component<EditProps, EditState> {
    constructor(props) {
        super(props);
        this.state = {
            name: 'James Foobar',
            age: 25
        }
    }
    render() {
        return (
            <div>
                <p>
                    <input
                        value={this.state.name}
                        onChange={evt => this.setState({name: evt.target.value})}
                    />
                    <button onClick={() => this.props.setName(this.state.name)}>
                        Set new name
                    </button>
                </p>
                <p>
                    <input
                        value={this.state.age}
                        onChange={evt => this.setState({age: +evt.target.value})}
                    />
                    <button onClick={() => this.props.setAge(this.state.age)}>
                        Set new age
                    </button>
                </p>
            </div>
        )
    }
}

const mapStateToProps = null;
const mapDispatchToProps = (dispatch: typeof store.dispatch) => ({
    setName: (name: string) => dispatch(setName(name)),
    setAge: (age: number) => dispatch(setAge(age))
});

export default connect(mapStateToProps, mapDispatchToProps)(Edit);