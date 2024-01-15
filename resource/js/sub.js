class Paging {
    constructor() {
        this.subWrap = document.querySelector('.sub_wrap');
        this.subBox = this.subWrap.querySelector('.sub_box');
        this.colors = ['#2a2a2a','#3a3a3a'];

        this.btns = Array.from(document.querySelectorAll('.dep_tit'));
        this.btns.forEach(el => {
            el.addEventListener('click', evt => this.movePage(evt));
        });
    }
   
    movePage(evt) {
        const tg = evt.currentTarget;
        const pageName = this.selectPage(tg.name);
        this.xhr = new XMLHttpRequest();
        this.xhr.open("GET", `/${pageName}.html`);
        this.xhr.send();
        this.xhr.onload = () => {
            stopParticle();
            if(pageName === 'index') {
                startParticle();
            }else {
                this.subWrap.classList.add('on');
                switchPage.actionAnim()
            }
            if(this.xhr.status == 200) {
                const html = this.xhr.responseText;
                this.subBox.innerHTML = html;
                if(pageName == 'works') {
                    platte = new Platte();
                }
            }else {
                // 실패
                console.log("HTTP 응답 오류: " + xhr.status);
            }
        }
    }
    selectPage(name) {
        switch(name) {
            case 'about':
                stopParticle();
                this.color = this.colors[0];
                return 'about';
                break;
            case 'works':
                this.color = this.colors[1];
                stopParticle();
                return 'works';
                break;
            default:
                this.color = '';
                return 'index';
                break;
        }
    }
}
class SwitchPage {
    constructor() {
        this.subWrap = document.querySelector('.sub_wrap');
        this.subBox = this.subWrap.querySelector('.sub_box');
        this.cvs = this.subWrap.querySelector('#subCvs');
        this.ctx = this.cvs.getContext('2d');
        
        this.cvs.width = wid;
        this.cvs.height = hei;


        this.ctx.clearRect(0, 0, wid, hei);

        this.render;

        this.createArc();

        // particles;
        this.particleCount = 125;
    };
    createParticle() {
        let p = {};
        p.x = this.cvs.width / 2,
        p.y = this.arc.y;
        p.r = rand(4, 12);
        p.endX = p.x - rand(-150, 150);
        p.endY = p.y - rand(-150, 150);
        p.alpha = 1;
        p.duration = randFloat(0.5, 2.5);
        return p;
    };
    drawParticle(p, idx) {
        gsap.to(p, {
            duration: p.duration,
            x: p.endX,
            y: p.endY,
            alpha: 0,
            ease: "expoScale(0.5,7,none)",
            r: 1,
            onComplete: () => {
                if(this.isParticle) {
                    let p = this.createParticle();
                    this.particles.splice(idx, 1, p);
                    this.drawParticle(p, idx);
                }
            }
        });
    }
    actionAnim() {
        this.particles = [];
        this.createArc();
        for(let i = 0; i < this.particleCount; i++) {
            let p = this.createParticle();
            this.particles.push(p);
            this.drawParticle(p, i);
        }
        
        this.dropArcAnim(this.arc);

        this.isParticle = true;
        this.cvs.classList.remove('hide');
        this.anim = requestAnimationFrame(this.drawDropAnim.bind(this));
    }
    drawDropAnim() {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, wid, hei);
        this.ctx.arc(this.arc.x, this.arc.y, this.arc.r, 0, Math.PI * 2);
        var grd = this.ctx.createRadialGradient(this.arc.x, this.arc.y, 15, this.arc.x, this.arc.y, 100);
        grd.addColorStop(0, "rgba(255,255,255, 1)");
        grd.addColorStop(0.25, "rgba(255, 238, 195, 0.25)");
        grd.addColorStop(1, "transparent");
        this.ctx.fillStyle = grd;
        this.ctx.fill();

        for(let p of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            this.ctx.fill();
        }
        this.anim = requestAnimationFrame(this.drawDropAnim.bind(this));
    };
    drawScaleAnim() {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, wid, hei);
        this.ctx.arc(this.arc.x, this.arc.y, this.arc.r, 0, Math.PI * 2);
        var grd = this.ctx.createRadialGradient(this.arc.x, this.arc.y, Math.floor(this.arc.r / 6.6666), this.arc.x, this.arc.y, this.arc.r);
        grd.addColorStop(0, "rgba(40,42,58, 1)");
        grd.addColorStop(0.25, "#3b3d4d");
        grd.addColorStop(1, "#3b3d4d");
        this.ctx.fillStyle = grd;
        // this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fill();

        this.anim = requestAnimationFrame(this.drawScaleAnim.bind(this));
    }
    dropArcAnim(arc) {
        this.dropTimeline = gsap.timeline()
        this.dropTimeline.to(arc, {
            delay: .25,
            duration: 2,
            y: this.center.y,
            ease: "power1.out",
            onComplete: () => {
                this.isParticle = false;
            },
        });
        this.dropTimeline.to(arc, {
            delay: .25,
            duration: 1,
            r: wid,
            onStart: () => {
                cancelAnimationFrame(this.anim);
                this.anim = requestAnimationFrame(this.drawScaleAnim.bind(this));
            },
            onComplete: () => {
                layout.closeAllMenu();
                cancelAnimationFrame(this.anim);
                this.cvs.classList.add('hide');
            }
        })
    };
    createArc() {
        this.center = {
            x:  this.cvs.width / 2,
            y:  this.cvs.height / 2
        }
        this.arc = {
            x: this.cvs.width / 2,
            r: 100,
        }
        this.arc.y = -this.arc.r;
    }
}

class Platte {
    constructor() {
        this.works = document.querySelector(".work_lists");
        this.lists = this.works.querySelector('.work_list');
        this.lists.style.transform = `rotate(-90deg)`;
        let rects = Array.from(this.works.querySelectorAll('.work_item'));
        this.cnt = rects.length;
        this.startX, this.startY, this.endX, this.endY;
        for (let rect of rects) {
            if(this.cnt++ >= 20) break;
            this.lists.appendChild(rect.cloneNode(true));
        }
        
        this.rects = Array.from(this.works.querySelectorAll('.work_item'));

        // const radius = hei / 2;
        this.radius = wid / 1.75;
        // this.radius = wid / 5;
        this.angle = 360 / this.rects.length;
        for (let i = 0; i < this.rects.length; i++) {
            let rect = this.rects[i];
            rect.style.transform = `rotate(${this.angle * i}deg) translate(${this.radius}px)`;
            rect.addEventListener('dragstart', this.disabledDrag);
        }
        this.activeIdx = 0;
        this.rects[this.activeIdx].classList.add('on');

        scaleImg = new ScaleWorks();
        scaleImg.changeScaleImg(this.activeidx)

        this.works.addEventListener('dragstart', this.disabledDrag);
        this.works.addEventListener('touchstart', (evt) => this.touchStart(this, evt), true);
        this.works.addEventListener('mousedown', (evt) => this.touchStart(this, evt), true);
        this.works.addEventListener('touchend', (evt) => this.touchEnd(this, evt), true);
        this.works.addEventListener('mouseup', (evt) => this.touchEnd(this, evt), true);
        
    }

    disabledDrag() {
        return false;
    }
    changeActiveEl() {
        this.rects.filter(el => {el.classList.remove('prev', 'next');});
        if(this.activeIdx >= this.rects.length) this.activeIdx = 0;
        if(this.activeIdx < 0) this.activeIdx = this.rects.length - 1;
        this.rects[this.activeIdx].classList.add('on');
        const prevElement = this.activeIdx <= 0 ? this.rects.length - 1 : Number(this.activeIdx) - 1;
        const nextElement = this.activeIdx >= this.rects.length - 1 ? 0 : Number(this.activeIdx) + 1;
        this.rects[prevElement].classList.add('prev');
        this.rects[nextElement].classList.add('next');
        scaleImg.changeScaleImg(this.activeidx)
    }
    nextCycle() {
        this.lists.style.transform = 'rotate('+(parseInt(this.getDeg()) - Math.floor(this.angle))+'deg)';
        this.rects[this.activeIdx++].classList.remove('on');
        this.changeActiveEl();
    }
    prevCycle() {
        this.lists.style.transform = 'rotate('+(parseInt(this.getDeg()) + Math.floor(this.angle))+'deg)';
        this.rects[this.activeIdx--].classList.remove('on');
        this.changeActiveEl();
    }
    getDeg() {
        var deg = this.lists.style.transform;
        return deg.substring(deg.indexOf('(') + 1, deg.indexOf('deg'));
    }

    touchStart(t, e) {
        t.start = {};
        if(e.type == 'mousedown') {
            t.start.x = parseInt(e.screenX);
            t.start.y = parseInt(e.screenY);
        }else {
            t.start.x = parseInt(e.changedTouches[0].screenX);
            t.start.y = parseInt(e.changedTouches[0].screenY);
        }
    }
    touchEnd(t, e) {
        t.end = {};
        if(e.type == 'mouseup') {
            t.end.x = parseInt(e.screenX)
            t.end.y = parseInt(e.screenY)
        }else {
            t.end.x = parseInt(e.changedTouches[0].screenX);
            t.end.y = parseInt(e.changedTouches[0].screenY);
        }
        t.dx = t.start.x - t.end.x;
        t.dy = t.start.x - t.end.x;
        // x, y축 이동이 100 이하면 단순 클릭으로 처리
        if(!(Math.abs(t.dx) > 50 || Math.abs(t.dy) > 50)) return;
        if(Math.abs(t.dx) > Math.abs(t.dy)) {
            // X축 이동이 Y축 이동보다 클 경우
            t.dx < 0 ? t.nextCycle() : t.prevCycle();
        }else {
            t.dy < 0 ? t.prevCycle() : t.nextCycle();
        }
    }
}
class ScaleWorks {
    constructor() {
        this.wrap = document.querySelector('#workWrap');
        this.cvs = this.wrap.querySelector('#scaleCvs');
        this.cvs.width = wid;
        this.cvs.height = hei;
        this.ctx = this.cvs.getContext('2d');

        const arr = Array.from(this.wrap.querySelectorAll('.card_img img'));
        const uniqueArr = arr.reduce((acc, el) => {
            if (!acc.includes(el)) {
              acc.push(el);
            }
            return acc;
        }, []);

        this.works = Array.from(this.wrap.querySelectorAll('.work_item'));
    }
    changeScaleImg(idx) {
        const activeEl = this.works.filter(el => {return el.classList.contains('on')})[0];
        let imgEl = activeEl.querySelector('img');
        let path = this.getScalePath(imgEl);
        const img = new Image();
        img.onload = () => {
            this.setScaleImg(img);
        }
        img.src = path;
    }
    getScaleImg(img) {
        const imgWid = img.naturalWidth;
        const imgHei = img.naturalHeight;

        const imgRatio = imgWid / imgHei;
        const docRatio = wid / hei;
        let scaleHei, scaleWid, left, top;
        if(imgRatio >= 1) {
            // 이미지가 가로가 큰 경우
            if(imgRatio >= docRatio) {
                scaleHei = hei;
                scaleWid = scaleHei * imgRatio;
                left = (wid - scaleWid) / 2;
                top = 0;
            }else {
                scaleWid = wid;
                scaleHei = scaleWid / imgRatio;
                left = 0;
                top = (hei - scaleHei) / 2;
            }
        }else{
            // 이미지가 세로가 큰 경우
            if(imgRatio >= docRatio) {
                scaleHei = hei;
                scaleWid = scaleHei / imgRatio;
                left = (wid - scaleWid) / 2;
                top = 0;
            }else {
                scaleWid = wid;
                scaleHei = scaleWid * imgRatio;
                left = 0;
                top = (hei - scaleHei) / 2;
            }
        }

        return {
            w: scaleWid,
            h: scaleHei,
            left: left,
            top: top,
        }
    }
    setScaleImg(img) {
        const info = this.getScaleImg(img);
        this.ctx.drawImage(img, info.left, info.top, info.w, info.h);
    }
    getScalePath(el) {
        return el.src.slice(0, el.src.lastIndexOf(".")) + "_scale" + el.src.slice(el.src.lastIndexOf("."));
    }
}
const page = new Paging();
const switchPage = new SwitchPage();
let platte; // works
let scaleImg;