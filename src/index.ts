import { useRef, useEffect } from 'react';
import { 
  // API
  Parent, 
  IFrame,
  // Types
  IParent,
  ParentOpts,
  IFrameOpts,
  Signal,
} from 'liaison-core';

export type IParentHook = Omit<IParent, ILifecycles>;
export type IChildHook = Omit<IFrame, ILifecycles>;

type ILifecycles = "init" | "destroy";

export function useParent({ iframe: { id, src }, effects }: ParentOpts): IParentHook {
  const parentRef = useRef<IParent | null>(null);

  useEffect(() => {
    parentRef.current = Parent({
      iframe: {
        id,
        src,
      },
      effects,
    })
    return () => {
      if (parentRef.current) {
        parentRef.current.destroy();
        parentRef.current = null;
      }
    }
  }, []);

  return {
    callIFrameEffect,
  }

  function callIFrameEffect(signal: Signal) {
    if (parentRef.current) {
      parentRef.current.callIFrameEffect(signal);
    }
  }
}

export function useIFrame({ parentOrigin, effects }: IFrameOpts) {
  const iFrameModelRef = useRef<IFrame | null>(null);

  useEffect(() => {
    iFrameModelRef.current = IFrame({
      parentOrigin,
      effects,
    });

    return () => {
      if (iFrameModelRef.current) {
        iFrameModelRef.current.destroy();
        iFrameModelRef.current = null
      }
    };
  }, []);

  return {
    callParentEffect,
  }

  function callParentEffect(signal: Signal) {
    if (iFrameModelRef.current) {
      iFrameModelRef.current.callParentEffect(signal);
    }
  }
}