# js-yang-slide
```
js 判断手指滑动方向
```

vue 使用 main.js
```
import slide from "js-yang-slide"
Vue.use(slide);
```

接收事件：home.vue
```
document.addEventListener("slide", (event) => {
	console.log("event slide event:", event);
})
```