class Clock {
    constructor(clockDivContainer, { size = 400, style = "free" }) {
        this.container = clockDivContainer;
        this.size = size;
        this.style = style;
        this.initDom();
    }

    initDom() {
        this.container.classList.add('clock');
        this.container.style.width = this.size + 'px';
        this.container.style.height = this.size + 'px';

        let cover = document.createElement('DIV');
        cover.style.width = this.size * .8 + 'px';
        cover.style.height = this.size * .8 + 'px';
        cover.style.top = this.size * .2 / 2 + 'px';
        cover.style.left = this.size * .2 / 2 + 'px';
        cover.style.borderRadius = '50%';
        this.container.append(cover);
        
        let r = 30;
        for (let i = 1; i < 13; i++) {
            let t = document.createElement('DIV');
            let html = '<div>' + i + '</div>';
            t.style.width = this.size * .75 / 2 + 'px';
            t.style.height = this.size * .1 + 'px';
            t.style.transform = 'rotateZ(' + r * i + 'deg)';
            t.style.top = this.size * 0.9 / 2 + 'px';
            t.style.lineHeight = this.size * 0.1 + 'px';
            t.classList.add('tpart');
            t.innerHTML = html;
            t.querySelector('div').style.fontSize = this.size * .08 + 'px';
            t.querySelector('div').style.transform = 'rotateZ(' + (90 - (r * i)) + 'deg)';
            this.container.append(t);
        }

        let hour = document.createElement('DIV'),
            minute = document.createElement('DIV'),
            sec = document.createElement('DIV'),
            ampm = document.createElement('DIV');

        hour.style.top = this.size / 2 + 'px';
        hour.style.left = ((this.size - 0) / 2) + 'px';
        hour.style.width = this.size / 2 * .4 + 'px';
        hour.style.height = '0px';
        hour.style.borderRadius = '40%';

        minute.style.top = this.size / 2 + 'px';
        minute.style.left = ((this.size - 0) / 2) + 'px';
        minute.style.width = this.size / 2 * .6 + 'px';
        minute.style.height = '0px';
        minute.style.borderRadius = '40%';

        sec.style.top = this.size / 2 + 'px';
        sec.style.left = ((this.size - 0) / 2) + 'px';
        sec.style.width = this.size / 2 * .7 + 'px';
        sec.style.height = '0px';
        sec.style.borderRadius = '40%';
        sec.style.borderColor = 'red';

        hour.classList.add('pointer');
        minute.classList.add('pointer');
        sec.classList.add('pointer');

        ampm.style.width = this.size / 2 * .5 + 'px';
        ampm.style.height = this.size / 2 * .5 + 'px';

        ampm.style.top = (this.size - (this.size / 2 * .5)) / 2 + 'px';
        ampm.style.left = ampm.style.top;
        // ampm.style.backgroundColor='green';
        // ampm.style.textAlign = 'center';
        // ampm.style.transform = 'rotate(90deg)';
        // ampm.style.transformOrigin= 'center';

        this.container.append(hour);
        this.container.append(minute);
        this.container.append(sec);
        this.container.append(ampm);

        let [$now, timePart] = (new Date()).toLocaleTimeString().split(" "), [nowHour, nowMin, nowSec] = $now.split(":");

        ampm.innerHTML = timePart;
        hour.style.transform = 'rotate(' + (parseInt(nowHour) + nowMin / 60) * (360 / 12) + 'deg)';
        minute.style.transform = 'rotate(' + nowMin * r + 'deg)';
        sec.style.transform = 'rotate(' + nowSec * r + 'deg)';

        hour.classList.add('hourMove');
        minute.classList.add('minuteMove');
        sec.classList.add('secMove');

        function getRule(name) {
            var animations = [];
            var rule, cssRule;
            var ss = document.styleSheets;
            for (var i = 0; i < ss.length; ++i) {
                for (var x = 0; x < ss[i].rules.length; ++x) {
                    rule = ss[i].rules[x];
                    if (rule.type == 7 && rule.name === name) {
                        animations.push({
                            cssRule: rule,
                            styleSheet: ss[i],
                            index: x
                        });
                    }
                }
            }
            return animations;
        }


        let hourAnimate = getRule('hourPointer');
        hourAnimate.forEach(function(elmt) {
            elmt.styleSheet.deleteRule(elmt.index);
            elmt.styleSheet.insertRule("@keyframes hourPointer{0%{transform: rotate(" + (parseInt(nowHour) + nowMin / 60) * (360 / 12) + "deg);} 100%{transform: rotate(" + ((parseInt(nowHour) + nowMin / 60) * (360 / 12) + 360) + "deg);}");
        });

        let minuteAnimate = getRule('minutePointer');
        minuteAnimate.forEach(function(elmt) {
            elmt.styleSheet.deleteRule(elmt.index);
            elmt.styleSheet.insertRule("@keyframes minutePointer{0%{transform: rotate(" + nowMin * r + "deg);} 100%{transform: rotate(" + (nowMin * r + 360) + "deg);}");
        });

        let secAnimate = getRule('secPointer');
        secAnimate.forEach(function(elmt) {
            elmt.styleSheet.deleteRule(elmt.index);
            elmt.styleSheet.insertRule("@keyframes secPointer{0%{transform: rotate(" + nowSec * r + "deg);} 100%{transform: rotate(" + ((nowSec * r) + 360) + "deg);}");
        });
        switch (this.style) {
            case "day":
                this.dayTimeStyle();
                break;
            case "night":
                this.nightTimeStyle();
                break;
            default:
                this.freeStyle();
                break;
        }
    };

    freeStyle(){
        this.container.style.backgroundColor='rgba(255,255,255, 1)';
        this.container.style.border="0px solid rgb(158, 158, 158)";
        this.container.firstElementChild.style.backgroundColor="rgba(158, 158, 158, 1)";
        this.container.firstElementChild.style.border="0px solid rgb(158, 158, 158)";
        this.container.querySelectorAll('.tpart').forEach(e => {
            e.style.backgroundColor="rgba(255, 255, 255, 0)";
            e.style.color="black";
        });
        this.container.querySelector('.hourMove').style.borderColor='black';
        this.container.querySelector('.minuteMove').style.borderColor='black';
        this.container.lastChild.style.color='black';
    };

    dayTimeStyle(){
        this.container.style.backgroundColor='rgba(255,255,255, 1)';
        this.container.style.border="1px solid rgb(158, 158, 158)";
        this.container.firstElementChild.style.backgroundColor="rgba(255, 255, 255, 1)";
        this.container.firstElementChild.style.border="1px solid rgb(158, 158, 158)";
        this.container.querySelectorAll('.tpart').forEach(e => {
            e.style.backgroundColor="rgba(255, 255, 255, 0)";
            e.style.color="black";
        });
        this.container.querySelector('.hourMove').style.borderColor='black';
        this.container.querySelector('.minuteMove').style.borderColor='black';
        this.container.lastChild.style.color='black';
    };

    nightTimeStyle(){
        this.container.style.backgroundColor='rgba(0, 0, 0, 1)';
        this.container.style.border="0px solid rgb(158, 158, 158)";
        this.container.firstElementChild.style.backgroundColor="rgba(50, 50, 50, 1)";
        this.container.firstElementChild.style.border="0px solid rgb(158, 158, 158)";
        this.container.querySelectorAll('.tpart').forEach(e => {
            e.style.backgroundColor="rgba(255, 255, 255, 0)";
            e.style.color="white";
        });
        this.container.querySelector('.hourMove').style.borderColor='white';
        this.container.querySelector('.minuteMove').style.borderColor='white';
        this.container.lastChild.style.color='white';
    }

}