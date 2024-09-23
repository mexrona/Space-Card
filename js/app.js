LibCanvas.extract();

/** @class Star */
var Star = atom.declare(App.Element, {
    progress: 1,
    opacity: 0,

    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.generatePosition(this.settings.get("center"));

        this.shape = new Polygon(
            this.from.clone(),
            this.from.clone(),
            this.from.clone()
        );

        // во сколько раз хвост будет двигаться медленнее, чем основа. от 2 до 3
        this.tailFactor = 2 + Math.random();
        // ускорение звезды
        this.progressSpeed = (Math.random() + 0.5) / 100;
        this.color = new atom.Color(
            128,
            128,
            atom.number.random(128, 192)
        ).toString();

        this.reset(true);
        this.recount();
    },

    generatePosition: function (center) {
        // на каком расстоянии от центра звезда "стартует"
        // мы не хотим, чтобы она появлялась прям в центре приложения,
        // потому смещаем в бок центр
        var distance = atom.number.random(Math.round(center.x / 10), center.x);

        // определяемся в каком направлении точка будет лететь
        this.angle = atom.math.degree(atom.number.random(1, 360));

        // смещаем сначала на расстояние, а потом вертим вокруг центра
        this.from = center
            .clone()
            .move(new Point(distance, 0))
            .rotate(this.angle, center);

        this.sin = Math.sin(-this.angle);
        this.cos = Math.cos(-this.angle);
    },

    reset: function (init) {
        if (init) {
            // При старте приложения четверть будет запускаться с нуля
            // Остальные - словно мы уже в полёте
            this.progress = atom.number.limit(atom.number.random(-15, 45), 1);
            this.opacity = 1;
        } else {
            this.progress = 1;
            this.opacity = 0;
            this.animate({opacity: 1});
        }
    },

    recount: function () {
        var sin = this.sin,
            cos = this.cos,
            f = this.from,
            p = this.shape.points,
            progress = atom.number.limit(this.progress - 2, 2);

        p[0].x = f.x + (progress * cos) / this.tailFactor;
        p[0].y = f.y - (progress * sin) / this.tailFactor;

        if (this.layer.ctx.rectangle.hasPoint(p[0])) {
            p[1].x = f.x + progress * cos;
            p[1].y = f.y - progress * sin;
            p[2].x = p[1].x + 2 * sin;
            p[2].y = p[1].y + 2 * cos;
        } else {
            this.reset();
        }
    },

    onUpdate: function (time) {
        this.progress *= 1 + this.progressSpeed * time;
        this.recount();
        this.redraw();
    },

    renderTo: function (ctx) {
        ctx.fill(this.shape, this.color);
    },
});

// App Init
(function () {
    var width, app, layer, i, size, center;

    width = document.width ? document.width - 50 : 800;
    size = new Size(width, Math.round(width / 2));
    center = new Point(Math.round(size.width / 2), Math.round(size.height / 2));

    app = new App({size: size, invoke: true, appendTo: "body"});
    layer = app.createLayer({intersection: "full"});

    for (i = 0; i < 150; i++) {
        new Star(layer, {center: center});
    }
})();

// Planet
$(function () {
    var pl_id = "planet";

    var image = new Image();
    image.src = "./img/moon.jpg";

    // определяем длину и высоту элемента canvas
    var width = $("#" + pl_id).width();
    var height = $("#" + pl_id).height();

    var canvas = document.getElementById(pl_id);
    var id = canvas.getContext("2d");

    var newMoveWidth = 0;
    var newMoveHeight = 0;

    var drawPl = function () {
        id.clearRect(0, 0, width, height);
        // рисуем карту с новыми координатами внутри элемента
        id.drawImage(
            image,
            newMoveWidth,
            newMoveHeight,
            width,
            height,
            0,
            0,
            width,
            height
        );

        if (newMoveWidth >= 800)
            newMoveWidth = 0; // если смещение достигло предела, начинаем сначала
        else newMoveWidth = newMoveWidth + 0.5; // иначе двигаем карту дальше
    };

    setInterval(drawPl, 50); // запускаем анимацию со скоростью 50 мс.
});

const inner = document.querySelector(".inner");

window.addEventListener("click", function () {
    inner.classList.add("active");
});

const clickOnInner = function () {
    inner.click();
};

setTimeout(clickOnInner, 3000);

const text = [
    "Поздравляю со Всемирным днём авиациии и\n",
    "космонавтики. Желаю, чтобы твоя звезда\n",
    "удачи никогда не погасла, чтобы космические\n",
    "просторы каждый раз открывали для тебя\n",
    "новые тайны, чтобы в твоей жизни для тебя\n",
    "много славных полётов к ярким огонькам\n",
    "Вселенной и вершинам счастья.\n",
];

let line = 0;
let count = 0;
let result = "";
function typeLine() {
    let interval = setTimeout(() => {
        result += text[line][count];
        document.querySelector("pre").innerHTML = result + "|";

        count++;
        if (count >= text[line].length) {
            count = 0;
            line++;
            if (line == text.length) {
                clearTimeout(interval);
                document.querySelector("pre").innerHTML = result;
                return true;
            }
        }
        typeLine();
        textBlock.click();
    }, getRandomInt(getRandomInt(250 * 2.5)));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const textBlock = document.querySelector(".text");

window.addEventListener("click", function () {
    textBlock.classList.remove("noActive");
});

setTimeout(typeLine, 2500);
