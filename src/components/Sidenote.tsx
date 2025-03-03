/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { connectSidenote, disconnectSidenote, selectSidenote } from '../store/ui/actions';
import { sidenoteTop, isSidenoteSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';
import { getDoc } from './utils';
import { opts } from '../connect';


type Props = {
  base?: string;
  sidenote: string;
  children: React.ReactNode;
  order?: number;
};

export const Sidenote = (props: Props) => {
  const {
    base, sidenote, children, order,
  } = props;
  const dispatch = useDispatch<Dispatch>();
  const [doc, setDoc] = useState<string>();

  const selected = useSelector((state: State) => isSidenoteSelected(state, doc, sidenote));
  const top = useSelector((state: State) => sidenoteTop(state, doc, sidenote));
  const onClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (selected) return;
    setTimeout(() => {
      dispatch(selectSidenote(doc, sidenote));
    }, 0);
  }, [doc, selected]);
  const onRef = useCallback((el: HTMLDivElement) => {
    const parentDoc = getDoc(el);
    if (parentDoc) {
      setDoc(parentDoc);
      dispatch(connectSidenote(parentDoc, sidenote, base, el, order));
    }
  }, []);

  return (
    <div
      id={sidenote}
      className={classNames('sidenote', { selected })}
      onClick={onClick}
      ref={onRef}
      style={{ top }}
    >
      {children}
    </div>
  );
};

Sidenote.defaultProps = {
  base: undefined,
  order: undefined,
};

export default Sidenote;
