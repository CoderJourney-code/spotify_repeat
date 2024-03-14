export function drawCanvas(colors) { 
    let canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    let angles = new Array(Object.keys(colors).length).fill(0).map(() => Math.random() * 5 * Math.PI);

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.globalCompositeOperation = 'saturation';

        let colorStops = Object.values(colors);
        colorStops.forEach((color, index) => {
            // let x = canvas.width / 2 + Math.cos(angles[index]) * canvas.width / 4;
            // let y = canvas.height / 2 + Math.sin(angles[index]) * canvas.height / 4;
            let t = angles[index];
            let x = canvas.width / 2 + (canvas.width / 1.5) * (Math.sin(t) / (1 + Math.cos(t) * Math.cos(t)));
            let y = canvas.height / 2 + (canvas.height / 1.5) * (Math.sin(t) * Math.cos(t) / (1 + Math.cos(t) * Math.cos(t)));

            const multiplier = 0.7;
            var grd = ctx.createRadialGradient(x, y, 0, x, y, Math.sqrt(canvas.width  * multiplier * canvas.width * multiplier + canvas.height * multiplier * canvas.height * multiplier));
            // var grd = ctx.createRadialGradient(x, y, 0, x, y, 1500);
            let rgba = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`;
            grd.addColorStop(0, rgba);
            grd.addColorStop(1, "transparent");
            // grd.addColorStop(1, rgb);
            // grd.addColorStop(2, "black");

            // Fill with gradient
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            angles[index] += 0.01;
        });

        requestAnimationFrame(draw);
    }

    draw();
}