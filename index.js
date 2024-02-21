export default {
    trigger: "event",
    n: 20, // 触发事件的持续滑动的次数
    is_touch_trigger: false, // 当前滑动是否触发事件
    touch_trigger_n: 0, // 当前滑动触发事件的次数
    start_x: 0,
    start_y: 0,
    end_x: 0,
    end_y: 0,
    direction_last: "", // 上一次滑动方向
    direction: "", // 当前滑动方向
    slideEvent: new CustomEvent("slide", {
        detail: {
            message: 'Hello, this is a slide event!',
            direction: "",
            start_x: 0,
            start_y: 0,
            end_x: 0,
            end_y: 0,
        },
        bubbles: true, // 允许事件冒泡
        cancelable: true // 允许事件被取消
    }),
    install(event, options) {

        if (options) {
            if (options.n) this.n = options.n;
            if (options.trigger) this.trigger = options.trigger;
        }

        document.addEventListener("touchstart", (e) => this.touchstart(e));
        document.addEventListener("touchmove", (e) => this.touchmove(e));
        document.addEventListener("touchend", (e) => this.touchend(e));
    },
    handleInit() {
        this.is_touch_trigger = false;
        this.touch_trigger_n = 0;
        this.start_x = 0;
        this.start_y = 0;
        this.end_x = 0;
        this.end_y = 0;
        this.direction = "";

        this.slideEvent.detail.direction = "";
        this.slideEvent.detail.start_x = 0;
        this.slideEvent.detail.start_y = 0;
        this.slideEvent.detail.end_x = 0;
        this.slideEvent.detail.end_y = 0;
    },
    touchstart(event) {
        this.handleInit();
        this.start_x = event.touches[0].clientX;
        this.start_y = event.touches[0].clientY;
    },
    touchmove(event) {
        if (this.is_touch_trigger) return;

        this.end_x = event.touches[0].clientX;
        this.end_y = event.touches[0].clientY;

        // 计算移动的相对距离
        const deltaX = this.end_x - this.start_x;
        const deltaY = this.end_y - this.start_y;

        // 上一次滑动方向
        this.direction_last = this.direction;
        // 判断滑动方向
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平方向移动
            if (deltaX > 0) {
                this.direction = "right";
            } else {
                this.direction = "left";
            }
        } else {
            // 垂直方向移动
            if (deltaY > 0) {
                this.direction = "down";
            } else {
                this.direction = "top";
            }
        }

        if (!this.direction || this.is_touch_trigger) return;
        this.statistics();
    },
    touchend() {
        if (this.trigger !== "end") return;
        this.handleEvent();
    },
    statistics() {
        if (this.direction === this.direction_last) this.touch_trigger_n++
        else this.touch_trigger_n = 1;
        if (this.trigger !== "end" && this.touch_trigger_n >= this.n) this.handleEvent();
    },
    handleEvent() {
        if (!this.direction || this.is_touch_trigger) return;
        this.is_touch_trigger = true;

        this.slideEvent.detail.direction = this.direction;
        this.slideEvent.detail.start_x = this.start_x;
        this.slideEvent.detail.start_y = this.start_y;
        this.slideEvent.detail.end_x = this.end_x;
        this.slideEvent.detail.end_y = this.end_y;

        document.dispatchEvent(this.slideEvent);
    },
}