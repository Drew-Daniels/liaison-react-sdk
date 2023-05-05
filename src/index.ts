import { useRef, useEffect } from 'react';
import { 
  // API
  Parent, 
  Child,
  // Types
  IParent,
  IFrame,
  ParentOpts,
  IFrameOpts,
} from '@drew-daniels/liaison-core';

export type IParentHook = Omit<IParent, ILifecycles>;
export type IChildHook = Omit<IFrame, ILifecycles>;

type ILifecycles = "init" | "destroy";

export function useParent({ iframeOpts, effects }: ParentOpts): IParentHook {
  const parentRef = useRef<IParent | null>(null);

  useEffect(() => {
    parentRef.current = Parent({
      iframeOpts,
      effects,
    })
    parentRef.current.init();
  }, []);

  return {
    callIFrameEffect: _requestCallToChild,
  }

  function _requestCallToChild(args: any) {
    if (parentRef.current) {
      parentRef.current.callIFrameEffect(args);
    }
  }
}

export function useChild({ parentOrigin, effects }: IFrameOpts) {
  const childRef = useRef<IFrame | null>(null);

  useEffect(() => {
    childRef.current = Child({
      parentOrigin,
      effects,
    });
    childRef.current.init();
    return () => {
      if (childRef.current) {
        childRef.current.destroy();
        childRef.current = null
      }
    };
  }, []);

  return {
    callParentEffect: _requestCallToParent,
  }

  function _requestCallToParent(args: any) {
    if (childRef.current) {
      childRef.current.callParentEffect(args);
    }
  }
}