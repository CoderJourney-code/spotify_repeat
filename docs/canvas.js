export function drawCanvas(colors) { 
    let canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext('2d');
    let angles = new Array(Object.keys(colors).length).fill(0).map(() => Math.random() * 30 * Math.PI);

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.globalCompositeOperation = 'saturation';

        let colorStops = Object.values(colors);
        colorStops.forEach((color, index) => {
            // let x = canvas.width / 2 + Math.cos(angles[index]) * canvas.width / 4;
            // let y = canvas.height / 2 + Math.sin(angles[index]) * canvas.height / 4;
            let t = angles[index];
            let x = canvas.width / 2 + (canvas.width / 4) * (Math.sin(t) / (1 + Math.cos(t) * Math.cos(t)));
            let y = canvas.height / 2 + (canvas.height / 4) * (Math.sin(t) * Math.cos(t) / (1 + Math.cos(t) * Math.cos(t)));


            // var grd = ctx.createRadialGradient(x, y, 0, x, y, Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height));
            var grd = ctx.createRadialGradient(x, y, 0, x, y, 900);
            let rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            grd.addColorStop(0, rgb);
            grd.addColorStop(1, "transparent");
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