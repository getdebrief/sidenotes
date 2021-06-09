/* eslint-disable react/prop-types */
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, State } from '../store';
import {
  connectAnchor, disconnectAnchor, selectAnchor,
} from '../store/ui/actions';
import { isSidenoteSelected } from '../store/ui/selectors';
import { getDoc } from './utils';

type Props = {
  sidenote: string;
  className?: string;
  children?: React.ReactNode;
};

export const InlineAnchor = (props: Props) => {
  const {
    sidenote, children, className,
  } = props;
  const dispatch = useDispatch<Dispatch>();
  const [doc, setDoc] = useState<string>();
  const [ref, setRef] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (ref == null || doc == null) return () => { };
    return () => dispatch(disconnectAnchor(doc, ref));
  }, [doc, ref]);

  const selected = useSelector((state: State) => isSidenoteSelected(state, doc, sidenote));
  const onClick = useCallback((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    dispatch(selectAnchor(doc, ref));
  }, [doc, ref]);
  const onRef = useCallback((el: HTMLSpanElement) => {
    setRef(el);
    const parentDoc = getDoc(el);
    if (parentDoc) {
      setDoc(parentDoc);
      dispatch(connectAnchor(parentDoc, sidenote, el));
    }
  }, []);
  const classes = classNames('anchor', { selected, [className ?? '']: Boolean(className) });
  const styles = {
    height: children ? 'auto' : 0,
    display: 'inline-block',
    verticalAlign: children ? 'baseline' : 'text-top',
  };
  return (
    <span className={classes} onClick={onClick} ref={onRef} style={styles}>
      {children}
    </span>
  );
};

InlineAnchor.defaultProps = {
  className: undefined,
  children: null,
};

export default InlineAnchor;
