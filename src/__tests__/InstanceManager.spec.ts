import InstanceManager from '../InstanceManager';

describe('InstanceManager', () => {
  it('不存在实例时会创建实例, 并且保存', () => {
    const A = class {};
    const instanceManager = new InstanceManager();
    const a = instanceManager.getOrCreate(A);
    expect(instanceManager.refedMap.get(A)?.value).toBe(a);
  });

  it('实例存在时，会返回该实例，并将refs + 1', () => {
    const A = class {};
    const instanceManager = new InstanceManager();
    instanceManager.getOrCreate(A);
    instanceManager.getOrCreate(A);
    expect(instanceManager.refedMap.get(A)?.refs).toBe(2);
  });

  it('unref会将refs - 1', () => {
    const A = class {};
    const instanceManager = new InstanceManager();
    instanceManager.getOrCreate(A);
    instanceManager.getOrCreate(A);
    instanceManager.unref(A);
    expect(instanceManager.refedMap.get(A)?.refs).toBe(1);
  });
  it('当refs为0时，会删除实例', () => {
    const A = class {};
    const instanceManager = new InstanceManager();
    instanceManager.getOrCreate(A);
    instanceManager.unref(A);
    expect(instanceManager.refedMap.get(A)).toBe(undefined);
  });
  it('删除实例时，会调用实例dispose方法', () => {
    const A = class {
      dispose = jest.fn();
    };
    const instanceManager = new InstanceManager();
    const a = instanceManager.getOrCreate(A);
    instanceManager.unref(A);
    expect(a.dispose).toBeCalledTimes(1);
  });
  it('当实例不存在时，unref无副作用', () => {
    const A = class {
      dispose = jest.fn();
    };
    const instanceManager = new InstanceManager();
    const a = instanceManager.getOrCreate(A);
    instanceManager.unref(A);
    instanceManager.unref(A);
    expect(a.dispose).toBeCalledTimes(1);
  });
});
