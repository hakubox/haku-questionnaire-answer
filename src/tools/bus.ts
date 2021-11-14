/** Bus */
export class Bus {
	constructor() {
		// 收集订阅信息,调度中心
		this.list = {};
	}

	list: {
    [key: string]: Array<Function>
  };

	/** 订阅 */
	$on(name: string, fn: Function) {
		this.list[name] = this.list[name] || [];
		this.list[name].push(fn);
	}

	/** 发布 */
	$emit(name: string, data?: any) {
		if (this.list[name]) {
        this.list[name].forEach((fn: Function) => {
        fn(data);
      });
    }
	}

	/** 取消订阅 */
	$off(name: string) {
		if (this.list[name]) {
			delete this.list[name];
		}
	}
}

const bus = new Bus();

export default bus;