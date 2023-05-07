import { useRef, useEffect } from 'react';
import { 
  // API
  Parent, 
  IFrame,
  // Types
  IParent,
  ParentOpts,
  IFrameOpts,
} from 'liaison-core';

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
    callIFrameEffect: _requestCallToIFrame,
  }

  function _requestCallToIFrame(args: any) {
    if (parentRef.current) {
      parentRef.current.callIFrameEffect(args);
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
    iFrameModelRef.current.init();
    return () => {
      if (iFrameModelRef.current) {
        iFrameModelRef.current.destroy();
        iFrameModelRef.current = null
      }
    };
  }, []);

  return {
    callParentEffect: _requestCallToParent,
  }

  function _requestCallToParent(args: any) {
    if (iFrameModelRef.current) {
      iFrameModelRef.current.callParentEffect(args);
    }
  }
}