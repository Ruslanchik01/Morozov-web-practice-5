function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)
 
 
    // отримання контексту для малювання
    const context = canvas.getContext('2d')
   // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();
 
    let isPaint = false // чи активно малювання
    let points = [] //масив з точками
    
        // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging
        })
    }

    // головна функція для малювання
   const redraw = () => {
    //очищуємо  canvas
    
 
    context.strokeStyle = options.strokeColor;
    context.lineJoin = "round";
    context.lineWidth = options.strokeWidth;
    let prevPoint = null;
    for (let point of points){
        context.beginPath();
        if (point.dragging && prevPoint){
            context.moveTo(prevPoint.x, prevPoint.y)
        } else {
            context.moveTo(point.x - 1, point.y);
        }
        context.lineTo(point.x, point.y)
        context.closePath()
        context.stroke();
        prevPoint = point;
    }
 }
 
      // функції обробники подій миші
 const mouseDown = event => {
    isPaint = true
    addPoint(event.pageX, event.pageY);
    redraw();
 }
 
 const mouseMove = event => {
    if(isPaint){
        addPoint(event.pageX, event.pageY, true);
        redraw();
    }
 }
 
 // додаємо обробку подій
 canvas.addEventListener('mousemove', mouseMove)
 canvas.addEventListener('mousedown', mouseDown)
 canvas.addEventListener('mouseup',() => {
    isPaint = false;
 });
 canvas.addEventListener('mouseleave',() => {
    isPaint = false;
 });
    
// TOOLBAR
const toolBar = document.getElementById('toolbar')
// clear button
    
const clearIcon = document.createElement("i")
clearIcon.classList.add('fas')
clearIcon.classList.add('fa-broom')
    
const clearBtn = document.createElement('button')
clearBtn.classList.add('btn')
clearBtn.appendChild(clearIcon)

clearBtn.addEventListener('click', () => {
// тут необхідно додати код очистки canvas та масиву точок (clearRect)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    points.length = 0;
})
    toolBar.insertAdjacentElement('afterbegin', clearBtn)


    const downlIcon = document.createElement("i")
    downlIcon.classList.add('fas')
    downlIcon.classList.add('fa-file-download')

    const btnDownl = document.createElement("button");
    btnDownl.classList.add('btn');
    btnDownl.appendChild(downlIcon)
    btnDownl.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', btnDownl)
    

    const saveIcon = document.createElement("i")
    saveIcon.classList.add('fas')
    saveIcon.classList.add('fa-save')

    const btnSave = document.createElement("button");
    btnSave.classList.add('btn');
    btnSave.appendChild(saveIcon)
    btnSave.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    })
    toolBar.insertAdjacentElement('afterbegin', btnSave)
    
    const restIcon = document.createElement("i")
    restIcon.classList.add('fas')
    restIcon.classList.add('fa-window-restore')

    const btnRest = document.createElement("button");
    btnRest.classList.add('btn')
    btnRest.appendChild(restIcon)
    btnRest.addEventListener('click', () => {
        points = JSON.parse(localStorage.getItem('points'))
        redraw();
    })
    toolBar.insertAdjacentElement('afterbegin', btnRest)
    
    const timeIcon = document.createElement("i")
    timeIcon.classList.add('fas')
    timeIcon.classList.add('fa-clock')

    const btnTime = document.createElement("button");
    btnTime.classList.add('btn')
    btnTime.appendChild(timeIcon)
    btnTime.addEventListener('click', () => {
        context.fillText(new Date().toString(),350,10)
    })
    toolBar.insertAdjacentElement('afterbegin', btnTime)

    const pickerColor = document.getElementById('color-picker')
    pickerColor.addEventListener('change', () => {
        options.strokeColor = pickerColor.value;
    })
    
    const pickerBrush = document.getElementById('brush-picker')
    pickerBrush.addEventListener('change', () => {
        options.strokeWidth = pickerBrush.value;
    })

    const imgIcon = document.createElement("i")
    imgIcon.classList.add('fas')
    imgIcon.classList.add('fa-images')
    const btnImg = document.createElement("button");
    btnImg.classList.add('btn')
    btnImg.appendChild(imgIcon)
    btnImg.addEventListener('click', () => {
        const img = new Image;
        img.src =`https://301-1.ru/uploads/image/img_files/2015_01_22_e4b27043ac2d2a5065e7dd626fe142f1.jpg`;
        img.onload = () => {
        context.drawImage(img, -30, 0);}

    })
    toolBar.insertAdjacentElement('afterbegin', btnImg)
    
    
    
}
 