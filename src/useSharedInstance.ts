import { useEffect, useMemo } from 'react';

import globalInstanceManager from './globalInstanceManager';
import { Class } from './InstanceManager';

/**
 * 共享实例，组件之间，页面之间共享同一个实例
 * @param Class
 * @returns
 */
function useSharedInstance<T>(Class: Class<T>): T {
  const instance = useMemo(() => globalInstanceManager.getOrCreate(Class), [
    Class,
  ]);

  // 减少上一个Class的引用计数
  useEffect(() => {
    // 便于理解，重命名一下
    const prevClass = Class;
    return () => {
      globalInstanceManager.unref(prevClass);
    };
  }, [Class]);

  return instance;
}

export default useSharedInstance;
