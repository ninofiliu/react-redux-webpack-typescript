import * as React from 'react';

import Display from './display';
import Edit from './edit';

export default (props: {}) => (
    <div>
        <Display
            name={'John Doe'}
            age={20}
        />
        <Edit
            setName={name => alert(`setName(${name}): not coded yet`)}
            setAge={age => alert(`setAge(${age}): not coded yet`)}
        />
    </div>
)