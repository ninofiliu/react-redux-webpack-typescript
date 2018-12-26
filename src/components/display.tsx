import * as React from 'react';

export default class Display extends React.Component<{ name: string, age: number}> {
    render() {
        return (
            <p>
                {this.props.name} is {this.props.age} years old.
            </p>
        )
    }
}