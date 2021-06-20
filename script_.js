const inputs = document.getElementsByTagName('input');

function f(x, y) {
    // return -Math.abs(Math.sin(0.002 * (x - 500)) * Math.sin(0.005 * (y - 500)));
    return Math.abs(0.000005 * ((x - 500) * (x - 500) + (y - 500) * (y - 500)));
}

function div(val, by) {
    return (val - val % by) / by;
}

function canvasInit(context, width, height) {
    context.canvas.height = height;
    context.canvas.width = width;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#000000";
    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.font = '16px serif';
}

function loop() {
    const context = document.querySelector("canvas").getContext("2d");
    
    const height = document.documentElement.clientHeight; 
    const width = document.documentElement.clientWidth;

    canvasInit(context, width, height);

    const MSIZE = 3000 + 1;
    const SIZE = 2010 + 1;
    const nx = 1000;    

    const offsetX = height / 2; // положение на оси У
    const offsetY = 600; // положение на оси Х

    let minvs = new Array(MSIZE);
    let minv = new Array(MSIZE);
    let uv = new Array(SIZE);
    
    let hhx, hhy, x, y, xx, yy, xxc1, yyc1, xxc2, yyc2;
    let fa, fb;

    let count = 0;

    for (let i = 0; i <= SIZE; i++) {
        uv[i] = new Array(SIZE);
        for (let j = 0; j <= SIZE; j++) {
            uv[i][j] = f(i, j);
        }
    }
    
    for (let i = 0; i <= nx; i++) {
        minv[i] = 800;
        minvs[i] = 800;
    }

    const a = Number(inputs[0].value);
    const b = Number(inputs[1].value);
    const c = Number(inputs[2].value);

    const l1 = Math.cos(a) * Math.cos(c) - Math.cos(b) * Math.sin(a) * Math.sin(c);
    const m1 = Math.sin(a) * Math.cos(c) + Math.cos(b) * Math.cos(a) * Math.sin(c);
    const n1 = Math.sin(b) * Math.sin(c);

    const l2 = -Math.cos(a) * Math.sin(c) + Math.cos(b) * Math.sin(a) * Math.cos(c);
    const m2 = -Math.sin(a) * Math.sin(c) + Math.cos(b) * Math.cos(a) * Math.cos(c);
    const n2 = Math.sin(b) * Math.cos(c);

    const l3 = Math.sin(b) * Math.sin(a);
    const m3 = -Math.sin(b) * Math.cos(a);
    const n3 = Math.cos(b);

    const scale = 100; // Высота значений функции

    const delxyd = 50;    
    const delxyk = 5;
    
    const nr = div(nx, delxyd);
    const nr1 = div(nx, delxyd);
    const nr2 = div(nx, delxyk);

    for (let ir = 0; ir <= nr; ir++) {
        for (let i1 = 1; i1 <= nr2; i1++) {

            hhx = 20;
            hhy = 2;

            fa = uv[ir * delxyd][(i1 - 1) * delxyk];
            fb = uv[ir * delxyd][i1 * delxyk];

            x = hhx * ir;
            y = hhy * (i1 - 1);

            xx = l1 * x + l2 * y + l3 * scale * fa;
            yy = m1 * x + m2 * y + m3 * scale * fa;

            xxc1 = Math.round(xx);
            yyc1 = Math.round(yy);
    
            x = hhx * ir;
            y = hhy * i1;       
        
            xx = l1 * x + l2 * y + l3 * scale * fb;
            yy = m1 * x + m2 * y + m3 * scale * fb;

            xxc2 = Math.round(xx);
            yyc2 = Math.round(yy);

            if (offsetX - yyc1 <= minvs[xxc1 + offsetY] && offsetX - yyc2 <= minvs[xxc2 + offsetY]) {

                context.beginPath();
                context.strokeStyle = `rgb(${ir}, ${i1}, ${ir * i1})`;
                context.moveTo(offsetY + xxc1, offsetX - yyc1);
                context.lineTo(offsetY + xxc2, offsetX - yyc2);
                context.stroke();

                minv[xxc1 + offsetY] = offsetX - yyc1;
                minv[xxc2 + offsetY] = offsetX - yyc2;
            }
            
            if (offsetX - yyc1 < minvs[xxc1 + offsetY] && offsetX - yyc2 > minvs[xxc2 + offsetY]) {

                context.beginPath();
                context.moveTo(offsetY + xxc1, offsetX - yyc1);
                context.lineTo(offsetY + xxc2, minv[xxc2 + offsetY]);
                context.stroke();

                minv[xxc1 + offsetY] = offsetX - yyc1;
            }

            if (offsetX - yyc1 > minvs[xxc1 + offsetY] && offsetX - yyc2 < minvs[xxc2 + offsetY]) {

                context.beginPath();
                context.moveTo(offsetY + xxc1, minv[xxc1 + offsetY]);
                context.lineTo(offsetY + xxc2, offsetX - yyc2);
                context.stroke();

                minv[xxc2 + offsetY] = offsetX - yyc2;
            }
                     
        }    

        for (let i = 1; i <= nx; i++) 
            minvs[i] = minv[i];
        
        for (let i1 = 0; i1 <= nr - 1; i1++)
            for (let i2 = 1; i2 <= 10; i2++) {
                hhy = 20;
                hhx = 2;

                fa = uv[ir * delxyd + (i2 - 1) * delxyk][i1 * delxyd];
                fb = uv[ir * delxyd + i2 * delxyk][i1 * delxyd];

                x = hhy * ir + (i2 - 1) * hhx;
                y = hhy * i1;                

                xx = l1 * x + l2 * y + l3 * scale * fa;
                yy = m1 * x + m2 * y + m3 * scale * fa;

                xxc1 = Math.round(xx);
                yyc1 = Math.round(yy);

                x = hhy * ir + i2 * hhx;                
                y = hhy * i1;                

                xx = l1 * x + l2 * y + l3 * scale * fb;
                yy = m1 * x + m2 * y + m3 * scale * fb;

                xxc2 = Math.round(xx);
                yyc2 = Math.round(yy);
                
                if (offsetX - yyc1 <= minvs[xxc1 + offsetY] && offsetX - yyc2 <= minvs[xxc2 + offsetY]) {

                    context.beginPath();
                    context.moveTo(offsetY + xxc1, offsetX - yyc1);
                    context.lineTo(offsetY + xxc2, offsetX - yyc2);
                    context.stroke();
    
                    minv[xxc1 + offsetY] = offsetX - yyc1;
                    minv[xxc2 + offsetY] = offsetX - yyc2;
                }

                if (offsetX - yyc1 < minvs[xxc1 + offsetY] && offsetX - yyc2 > minvs[xxc2 + offsetY]) {

                    context.beginPath();
                    context.moveTo(offsetY + xxc1, offsetX - yyc1);
                    context.lineTo(offsetY + xxc2, minv[xxc2 + offsetY]);
                    context.stroke();
                    
                    minv[xxc1 + offsetY] = offsetX - yyc1;
                }

                if (offsetX - yyc1 > minvs[xxc1 + offsetY] && offsetX - yyc2 < minvs[xxc2 + offsetY]) {

                    context.beginPath();
                    context.moveTo(offsetY + xxc1, minv[xxc1 + offsetY]);
                    context.lineTo(offsetY + xxc2, offsetX - yyc2);
                    context.stroke();
    
                    minv[xxc2 + offsetY] = offsetX - yyc2;
                } 
    
            }   

        for (let i = 1; i <= nx; i++) 
            minvs[i] = minv[i];            

    }   

    context.fillText(`a = ${a}`, 150, 50);
    context.fillText(`b = ${b}`, 150, 80);
    context.fillText(`c = ${c}`, 150, 110);
}

loop();

for (let i = 0; i < inputs.length; i++) 
    inputs[i].addEventListener('change', loop);