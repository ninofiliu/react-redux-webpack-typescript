import * as React from 'react';

type EditProps = {
    setName: (name: string) => void,
    setAge: (age: number) => void
}
type EditState = {
    name: string,
    age: number
}
export default class Edit extends React.Component<EditProps, EditState> {
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