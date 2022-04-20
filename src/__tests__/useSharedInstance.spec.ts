import { act, renderHook } from '@testing-library/react-hooks';

import globalInstanceManager from '../globalInstanceManager';
import useSharedInstance from '../useSharedInstance';

describe('useSharedInstance', () => {
  // 执行单元测试后清理全局实例
  afterEach(() => {
    globalInstanceManager.refedMap.clear();
  });
  it('多个组件返回同一个实例', () => {
    const A = class {};
    const { result: result1 } = renderHook(() => useSharedInstance(A));
    const { result: result2 } = renderHook(() => useSharedInstance(A));
    const a1 = result1.current;
    const a2 = result2.current;
    expect(a1).toBe(a2);
  });
  it('所有引用组件销毁后，删除实例', () => {
    const A = class {};
    const { unmount } = renderHook(() => useSharedInstance(A));
    unmount();
    expect(globalInstanceManager.refedMap.get(A)).toBe(undefined);
  });
  it('支持动态实例', () => {
    const A = class {};
    const B = class {};
    let val = A;
    const { rerender, result } = renderHook(
      ({ clz }) => useSharedInstance(clz),
      {
        initialProps: { clz: val },
      }
    );
    expect(result.current).toBeInstanceOf(A);
    val = B;
    rerender({ clz: val });
    expect(result.current).toBeInstanceOf(B);
    expect(globalInstanceManager.refedMap.get(A)).toBe(undefined);
  });
});
