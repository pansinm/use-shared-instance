export type Disposable = { dispose?: () => void };

export type Class<T extends Disposable> = { new (): T };

export type RefedObject<T> = {
  type: Class<T>;
  refs: number;
  value: T;
};

/**
 * 管理全局实例
 */
export default class InstanceManager {
  refedMap = new Map<Class<Disposable>, RefedObject<Disposable>>();

  /**
   * 创建或返回实例，增加引用计数
   * @param c
   * @returns
   */
  getOrCreate<T>(c: Class<T>): T {
    let refedObj = this.refedMap.get(c);
    if (!refedObj) {
      refedObj = {
        type: c,
        refs: 0,
        value: new c(),
      };
      this.refedMap.set(c, refedObj);
    }
    refedObj.refs++;
    return refedObj.value as T;
  }
  /**
   * 减少引用计数
   * @param c
   */
  unref<T>(c: Class<T>) {
    const refedObj = this.refedMap.get(c);
    if (refedObj) {
      refedObj.refs--;
      if (refedObj.refs <= 0) {
        // 可以使用dispose进行资源释放
        refedObj.value.dispose?.();
        this.refedMap.delete(c);
      }
    }
  }
}
