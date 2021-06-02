import React from 'react';
declare type Props = {
    base?: string;
    sidenote: string;
    children: React.ReactNode;
    order?: number;
};
export declare const Sidenote: {
    (props: Props): JSX.Element;
    defaultProps: {
        base: undefined;
        order: undefined;
    };
};
export default Sidenote;
