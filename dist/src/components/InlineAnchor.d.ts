import React from 'react';
declare type Props = {
    sidenote: string;
    className?: string;
    children?: React.ReactNode;
};
export declare const InlineAnchor: {
    (props: Props): JSX.Element;
    defaultProps: {
        className: undefined;
        children: JSX.Element;
    };
};
export default InlineAnchor;
