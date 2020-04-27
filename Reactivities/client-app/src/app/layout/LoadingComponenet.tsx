import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const LoadingComponenet: React.FC<{inverted?: boolean, content?: string}> = ({
    inverted = true,
    content
}) => {
    return (
        <Dimmer active inverted={inverted}>
            <Loader content={content}/>
        </Dimmer>
    )
}

export default LoadingComponenet;