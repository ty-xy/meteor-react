
// const lazyFn = lazy();
// lazyFn();
// 第一种方案
// window.addEventListener('scroll', lazyFn, false);

// 第二种节流方案
// window.addEventListener('scroll', throttle(lazyFn, 500, 1000), false);
export function lazy(target) {
    const targetElment = target.getElementsByTagName('img');
    const len = targetElment.length;
    let n = 0;
    console.log('targetElment', target, len, n);
    return function () {
        const docHeight = target.clientHeight;
        const docScrollHeight = target.scrollTop;
        for (let i = 0; i < len; i++) {
            console.log('docScrollHeight', targetElment[i].offsetTop, targetElment[i].offsetTop, docScrollHeight + docHeight, n);
            if (targetElment[i].offsetTop < docScrollHeight + docHeight) {
                targetElment[i].src = targetElment[i].getAttribute('data-src');
                // cb();
            }
            n++;
        }
    };
}
export function throttle(fn, time, interval) {
    let timer = null;
    let startTime = new Date();
    return () => {
        clearTimeout(timer);
        const endTime = new Date();
        if (endTime - startTime > interval) {
            fn();
            startTime = endTime;
        } else {
            timer = setTimeout(fn, time);
        }
    };
}
