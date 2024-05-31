import React from 'react'

type Error = {
    message?: string | undefined | null
}

export const Loading: React.FC<Error> = ({ message }) => {
    return (
        <>
            {
                !!message
                    ?

                    <p>{message}</p>

                    :
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', background: "none", display: 'block', shapeRendering: 'auto' }} width="30px" height="30px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <path d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" fill="#fffdff" stroke="none">
                                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform>
                            </path>
                        </svg>
                    </div>

            }
        </>
    )
}

export const LoadingZero: React.FC<Error & {width?: number, inline?:boolean}> = ({ message, width, inline }) => {
    return (
        <>
            {
                !!message
                    ?

                    <p>{message}</p>

                    :
                    <div style={{
                        display: inline ? 'inline-flex' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'fit-content',
                        height: '100%',
                        margin: '0'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: '0', background: "none", display: 'block', shapeRendering: 'auto' }} width={width || 24} height={width || 24} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <path d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" fill="#fffdff" stroke="none">
                                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform>
                            </path>
                        </svg>
                    </div>

            }
        </>
    )
}