// const rand = (min, max) => {
//     ~~ 연산자는 소수점 이하를 버리고 정수로 반환
//     return ~~(Math.random() * (max - min + 1)) + min;
// }


class Layout {
    constructor(){
        this.header = document.querySelector('#header');
        this.toggle = this.header.querySelector('.toggle_btn');
        this.allMenu = document.querySelector('#allMenu');
    }
    toggleEvt() {
        this.toggle.addEventListener('click', evt => {
            this.toggle.classList.toggle('on');
            if(this.toggle.classList.contains('on')) {
                this.openAllMenu();
            }else {
                this.closeAllMenu();
            }
        })
    }
    openAllMenu() {
        this.allMenu.classList.add('on');
        bubble.activeBubble();
    }
    closeAllMenu() {
        this.allMenu.classList.remove('on');
        this.toggle.classList.remove('on');
        bubble.cancelBubble();
    }
}

class Bubble {
    constructor() {
        this.cvs = document.querySelector('#bubble');
        this.ctx = this.cvs.getContext('2d');
        this.bubble = [];
        this.square = {};
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.square = {
            w: this.w,
            h: this.h,
            y: this.h,
            speed: 0.25,
            totalTime: 250,
            duration: 250,
            time: 0,
            delay: 15,
        }
        this.cvs.width = this.w
        this.cvs.height = this.h;
        this.bubbleCount = 200;
        // this.color = `rgba(255,176,158,.75)`;
        this.color = `rgba(255,176,158,1)`;
        this.anim;
        this.ctx.clearRect(0, 0, this.w, this.h);
        for(let i = 0; i < this.bubbleCount; i++) {
            this.bubble.push(this.getBubble());
        }
    }
    activeBubble() {
        if(this.anim) cancelAnimationFrame(this.anim);
        const render = () => {
            this.ctx.clearRect(this.w * -0.5, this.h * -0.5, this.w * 1.5, this.h * 1.5);
            this.ctx.fillStyle = this.color;
            if(Number(this.square.y) > 0) {
                // 가속도
                let sq = this.square;
                sq.totalTime -+ sq.time;
                // ease-out
                sq.y = sq.y + ((sq.time - sq.delay) / sq.duration) * sq.speed * (0 - sq.y);
                this.square.time += 1;
            }else {
                this.square.y = 0;
                this.totalTime = this.duration;
                cancelAnimationFrame(this.anim);
            }
            this.ctx.beginPath();
            this.ctx.rect(0, this.square.y, this.square.w, this.square.h);
            this.ctx.fill();
            for(const bb of this.bubble) {
                this.ctx.beginPath();
                this.ctx.arc(bb.x, bb.y, bb.r, 0, Math.PI * 2);
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
    
                bb.y = bb.y - (bb.speed * 1);
                if(bb.y <= bb.r * -2) {
                    bb.y = rand(this.h, this.h * 2);
                    bb.speed = rand(1, 25);
                }
            }
            this.anim = requestAnimationFrame(render);
        }
        this.anim = requestAnimationFrame(render);
    }
    cancelBubble() {
        if(this.anim){
            cancelAnimationFrame(this.anim)
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.bubble = [];
            this.square.y = this.h;
            this.square.time = 0;
            this.totalTime = this.duration;
            for(let i = 0; i < this.bubbleCount; i++) {
                this.bubble.push(this.getBubble());
            }
        };
    }
    
    getBubble() {
        const b = {};
        b.x = rand(0, w);
        b.y = rand(this.h, this.h * 2.5);
        b.r = rand(50, 175);
        b.speed = rand(5, 35);
        // b.speed = 100;
        return b;
    }
}


class Loading {
    constructor() {
        this.cvs = document.createElement('canvas');
        this.ctx = this.cvs.getContext('2d');
        this.cvs.width = wid;
        this.cvs.height = hei;
        this.bgColor = '#002025 ';
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.fill();

        this.cvs.classList.add('loading_wrap');
        this.cvs.id = 'loadingWrap';

        this.centerLine = hei / 2;
        this.amplitude = hei / 5;  // 높이
        this.frequency = 0.035; // 폭
        this.gap = 20; // 간격
        this.velocity = 0.025; // 속도

        this.lines = [];
        for(let s = 0; s < 25; s++) {
            this.points = [];
            for(let i = 0; i <= Math.ceil(this.cvs.width / this.gap); i++) {
                const x = i * this.gap;
                let y;
                this.points.push(this.createPoint(x, y, i));
            }
            this.lines.push(this.points);
        }
    }
    init() {
        document.body.append(this.cvs);
        this.render();
    }
    clear() {
        this.ctx.clearRect(0, 0, cvs.width, cvs.height);
    }
    remove() {
        if(document.querySelector('#loadingWrap')) {
            this.cvs.remove();
        }
    }
    createPoint(x, y, i) {
        return {x: x, y: y, radian: i * this.frequency, i: i};
    }
    render() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        this.ctx.lineWidth = 0.125;
        let tempTime = 0;
        let delay = this.lines.length;
        let animation = (timeStamp) => {
            let time = Math.ceil(timeStamp * 0.002);
            
            this.ctx.clearRect(0, 0, cvs.width, cvs.height);
            this.ctx.fillRect(0, 0, w, h);
            this.ctx.fill();
            for(let s = 0; s < Object.keys(this.lines).length; s++) {
                this.ctx.beginPath();
                let points = this.lines[s];
                for(let i = 0; i < points.length; i++) {
                    let p = points[i];
                    p.radian += this.velocity;
                    p.y = this.amplitude * Math.sin(p.radian + s * 0.05) + this.centerLine;
                    this.ctx.lineTo(p.x, p.y);
                }
                this.ctx.stroke();
            }
            this.anim = requestAnimationFrame(animation);
        }
        this.anim = requestAnimationFrame(animation);
    }
    resizeLoading() {
        this.cvs.width = wid;
        this.cvs.height = hei;
    }

}

const layout = new Layout();
const bubble = new Bubble();
layout.toggleEvt();


const loading = new Loading();
// loading.init();