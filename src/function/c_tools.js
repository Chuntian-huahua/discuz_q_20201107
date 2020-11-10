const onScrollCallBackTrack = {};

/**
 * 防抖
 * @param {function}} fun 执行的函数
 * @param {number} time 隔多久触发
 */
function debounce(fun, time = 300) {
  let timer = null;
  return function() {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(fun, time);
  };
}
/**
 * 节流
 * @param {function} func 执行的方法
 * @param {number} delay 间隔时间
 */
function throttle(func, delay) {
  let timer = null;
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        func();
        timer = null;
      }, delay);
    }
  };
}

export default {
  debounce,
  throttle,
  /**
   * 返回一个对象，对象键为数组元素里面指定键的值
   * @param {array} arr 源数组
   * @param {string} ItemKey 数组元素的某个键值
   * @return {object} 对象
   */
  arrayItemValueToObject(arr, ItemKey) {
    let obj = {};
    arr.forEach((element) => {
      obj[element[ItemKey]] = element;
    });
    return obj;
  },
  /**
   * 根据格式 格式化时间戳
   * @param {number} timestamp 时间戳
   * @param {string} formatString 格式 y=年 m=月 d=天 h=小时 i=分钟 s=秒
   * @return {string} 格式化结果
   */
  formatDate(timestamp, formatString = "y-m-d h:i:s") {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let second = date.getSeconds();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (second < 10) {
      second = `0${second}`;
    }
    formatString = formatString.replace("y", year);
    formatString = formatString.replace("m", month);
    formatString = formatString.replace("d", day);
    formatString = formatString.replace("h", hours);
    formatString = formatString.replace("i", minutes);
    formatString = formatString.replace("s", second);
    return formatString;
  },
  /**
   * 获取对象的类型
   * @param {any} value 任意对象
   * @return {string} 类型
   */
  getType(value) {
    let type = Object.prototype.toString.call(value);
    return type.slice(type.lastIndexOf(" ") + 1, type.indexOf("]"));
  },
  onScroll(cb, scrollTop = null, scrollLeft = null, once = false) {
    let scrollCBLength = Object.keys(onScrollCallBackTrack).length;
    let cbName = `cb_${scrollCBLength}`;
    if (once === true) {
      cbName += "_once";
    }
    onScrollCallBackTrack[cbName] = {
      scrollTop,
      scrollLeft,
      cb,
    };
    scrollTop = document.documentElement.scrollTop;
    scrollLeft = document.documentElement.scrollLeft;
    window.addEventListener(
      "scroll",
      throttle(function() {
        scrollTop = document.documentElement.scrollTop;
        scrollLeft = document.documentElement.scrollLeft;
        for (let key in onScrollCallBackTrack) {
          if (
            onScrollCallBackTrack[key] &&
            (onScrollCallBackTrack[key]["scrollLeft"] ||
              onScrollCallBackTrack[key]["scrollTop"])
          ) {
            if (onScrollCallBackTrack[key].hasOwnProperty("scrollTop")) {
              if (
                onScrollCallBackTrack[key]["scrollTop"] &&
                scrollTop >= onScrollCallBackTrack[key]["scrollTop"]
              ) {
                onScrollCallBackTrack[key]["cb"]();
                if (/once/.test(key)) {
                  delete onScrollCallBackTrack[key];
                }
              }
            }
            if (
              onScrollCallBackTrack[key] &&
              onScrollCallBackTrack[key].hasOwnProperty("scrollLeft")
            ) {
              if (
                onScrollCallBackTrack[key]["scrollLeft"] &&
                scrollLeft >= onScrollCallBackTrack[key]["scrollLeft"]
              ) {
                onScrollCallBackTrack[key]["cb"]();
                if (/once/.test(key)) {
                  delete onScrollCallBackTrack[key];
                }
              }
            }
            if (
              onScrollCallBackTrack[key] &&
              onScrollCallBackTrack[key].hasOwnProperty("scrollLeft") &&
              onScrollCallBackTrack[key].hasOwnProperty("scrollTop")
            ) {
              if (
                onScrollCallBackTrack[key]["scrollLeft"] &&
                onScrollCallBackTrack[key]["scrollTop"] &&
                scrollLeft >=
                  onScrollCallBackTrack[key][
                    "scrollLeft" &&
                      scrollTop >= onScrollCallBackTrack[key]["scrollTop"]
                  ]
              ) {
                onScrollCallBackTrack[key]["cb"]();
                if (/once/.test(key)) {
                  delete onScrollCallBackTrack[key];
                }
              }
            }
          } else {
            onScrollCallBackTrack[key]["cb"]();
            if (/once/.test(key)) {
              delete onScrollCallBackTrack[key];
            }
          }
        }
      }, 100)
    );
  },
  /**
   * 当距离底部多大距离时触发回调函数
   * @param {number} distance 底部距离
   * @param {function} callback 回调函数
   * @param {number} debounceTime 防抖时间差
   */
  distanceBottom(distance = 300, callback = null, debounceTime = 300) {
    let scrollTop = document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight;
    window.onscroll = this.debounce(function() {
      scrollHeight = document.documentElement.scrollHeight;
      scrollTop = document.documentElement.scrollTop;
      if (scrollHeight - (scrollTop + window.innerHeight) <= distance) {
        if (callback) {
          callback();
        }
      }
    }, debounceTime);
  },
};
