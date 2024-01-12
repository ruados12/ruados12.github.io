class Paging {
    constructor() {
        this.subWrap = document.querySelector('.sub_wrap');
        this.subBox = this.subWrap.querySelector('.sub_box');
        this.colors = ['#2a2a2a','#3a3a3a'];

        this.cvs = this.subWrap.querySelector('#subCvs');
        this.ctx = this.cvs.getContext('2d');
        
        this.cvs.width = wid;
        this.cvs.height = hei;


        this.ctx.clearRect(0, 0, wid, hei);

        this.render;

        this.createArc();

        // particles;
        this.particleCount = 125;

        this.btns = Array.from(document.querySelectorAll('.dep_tit'));
        this.btns.forEach(el => {
            el.addEventListener('click', evt => this.movePage(evt));
        });
    }
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
        console.log(this.arc);
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
    movePage(evt) {
        const tg = evt.currentTarget;
        const pageName = this.selectPage(tg.name);
        this.xhr = new XMLHttpRequest();
        this.xhr.open("GET", "/about.html");
        this.xhr.send();
        this.xhr.onload = () => {
            stopParticle();
            if(pageName === 'index') {
                startParticle();
            }else {
                this.subWrap.classList.add('on');
                page.actionAnim()
            }
            if(this.xhr.status == 200) {
                const html = this.xhr.responseText;
                this.subBox.innerHTML = html;
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

const page = new Paging();