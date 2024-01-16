var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");
var w = window.innerWidth;
var h = window.innerHeight;
// var dpr = window.devicePixelRatio;
cvs.width = w;
cvs.height = h;
// ctx.scale(dpr, dpr);
ctx.clearRect(0, 0, w, h);
// ctx.fillStyle = '#efefef';
ctx.fillRect(0, 0, w, h);
ctx.fill();

var dots = [];
var dotsCount = 300;

function Hue() {
    this.h = rand(0, 250);
}
Hue.prototype = {
    update: function () {
        this.h = (this.h += 0.25) % 360;
    },
    getHue: function () {
        return this.h;
    },
};

function Dotted() {}
Dotted.prototype = {
    mx: 0,
    my: 0,
    rise: 0,
    run: 0,
    radian: 0,
    radius: 2,
    degree: 0,
    setPos: function (x, y) {
        this.x = x;
        this.y = y;
        this.dx = rand(0, w);
        this.dy = rand(0, h);
    },
    update: function () {
        if (this.dx == Math.round(this.x) && this.dy == Math.round(this.y)) {
            this.dx = rand(0, w);
            this.dy = rand(0, h);
        }
        if (this.x >= w || this.x < 0 || this.y >= h || this.y < 0) {
            this.dx = rand(0, w);
            this.dy = rand(0, h);
        }
        this.radian = Math.atan2(this.dy - this.y, this.dx - this.x);
        this.x += Math.cos(this.radian) * 0.5;
        this.y += Math.sin(this.radian) * 0.5;
    },
    draw: function () {
        var dt = this;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.arc(dt.x, dt.y, dt.radius, 0, Math.PI * 180);
        ctx.fill();
    },
};
for (var i = 0; i < dotsCount; i++) {
    var d = new Dotted();
    d.setPos(rand(0, w), rand(0, h));
    dots.push(d);
}

var flagMouse = false;
var mousePos = {};
cvs.addEventListener("mouseenter", function () {
    flagMouse = true;
});
cvs.addEventListener("mousemove", function () {
    if (flagMouse) {
        mousePos.x = event.pageX;
        mousePos.y = event.pageY;
    }
});
cvs.addEventListener("mouseleave", function () {
    flagMouse = false;
});

function Range() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.bx = 0;
    this.by = 0;
    this.mx = 0;
    this.my = 0;
    this.radian = 0;
    this.run = 0;
    this.rise = 0;
    this.alpha = 1;
    this.rangeRadius = 125;
    this.dtg;
    this.btg;
}
var particles = [];
Range.prototype = {
    x: 0,
    y: 0,
    update: function () {
        for (var i = 0; i < dots.length; i++) {
            dtg = dots[i];
            for (var j = i + 1; j < dots.length; j++) {
                btg = dots[j];
                this.bx = dtg.x - btg.x;
                this.by = dtg.y - btg.y;
                if (
                    Math.sqrt(this.bx * this.bx + this.by * this.by) /
                        this.rangeRadius <=
                    1
                ) {
                    particles.push({
                        moveX: dtg.x,
                        moveY: dtg.y,
                        toX: btg.x,
                        toY: btg.y,
                        alpha:
                            1 -
                            Math.sqrt(this.bx * this.bx + this.by * this.by) /
                                this.rangeRadius,
                    });
                    // particles.push({moveX: dtg.x, moveY: dtg.y, toX: btg.x, toY: btg.y, alpha: 1});
                }
            }
            if (flagMouse) {
                this.mx = dtg.x - mousePos.x;
                this.my = dtg.y - mousePos.y;
                if (
                    Math.sqrt(this.mx * this.mx + this.my * this.my) /
                        this.rangeRadius <=
                    1
                ) {
                    // particles.push({moveX: dtg.x, moveY: dtg.y, toX: mousePos.x, toY: mousePos.y, alpha: (1 - Math.sqrt((this.mx * this.mx) + (this.my * this.my)) / this.rangeRadius)});
                    particles.push({
                        moveX: dtg.x,
                        moveY: dtg.y,
                        toX: mousePos.x,
                        toY: mousePos.y,
                        alpha:
                            1 -
                            Math.sqrt(this.mx * this.mx + this.my * this.my) /
                                this.rangeRadius,
                    });
                }
            }
        }
    },
};

let hue = new Hue();
let r = new Range();
let bt = 0;
let particleRender;
const loop = function (time) {
    hue.update();

    // ctx.fillStyle = '#efefef';
    // ctx.fillRect(0, 0, w, h);
    ctx.clearRect(0, 0, w, h);
    ctx.fill();
    particles = [];
    r.update();
    for (var i = 0; i < dots.length; i++) {
        var dt = dots[i];
        dt.update();
        dt.draw();
    }
    for (var i = 0; i < particles.length; i++) {
        var pp = particles[i];
        ctx.beginPath();
        ctx.moveTo(pp.moveX, pp.moveY);
        ctx.lineTo(pp.toX, pp.toY);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // ctx.strokeStyle = `hsla(${hue.getHue()},46%,54%, ${pp.alpha})`;
        ctx.strokeStyle = `rgba(255,255,255, ${pp.alpha})`;
        ctx.stroke();
    }

    particleRender = requestAnimationFrame(loop);
};

particleRender = requestAnimationFrame(loop);

function stopParticle() {
    cancelAnimationFrame(particleRender);
}
function startparticle() {
    particleRender = requestAnimationFrame(loop)
}