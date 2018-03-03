const FadeSlider = function(customSettings){
    
    //Базовые настройки
    const settings = {
        
        adaptive: "hybrid",
        treshholdMax: 1180,
        treshholdMin: 586,
        reductionIndex: 1.65,
        controls: true,
        pager: false,
        duration: 10000, 
        fadeTime: 1800,
        animation: true,
        animationChange: "random",
        colorFilter: false,
        caption: false,
        auto: true
    };
    
    //Миграция настроек    
    [settings,customSettings].reduce(function (r, o){
        
        Object.keys(o).forEach(function (k) {
            r[k] = o[k];
        });
        
        return r;
    });
    
    const adaptive = settings.adaptive;
    const treshholdMax = settings.treshholdMax;
    const treshholdMin = settings.treshholdMin;
    const reductionIndex = settings.reductionIndex;
    const pager = settings.pager;
    const controls = settings.controls;
    const duration = settings.duration;
    const fadeTime = settings.fadeTime;
    const animation = settings.animation;
    const animationChange = settings.animationChange;
    const colorFilter = settings.colorFilter;
    const caption = settings.caption;
    const auto = settings.auto;
    
    
    let selectorMatch,currentSlide, oldSlide, sliderAdaptHeight, aspectRatio, startState, oldRand, newRand, slidesCount, $leftControl,$rightControl,$pager,$pagerLi; 

    const angleZoomArr = ['zoom_BL','zoom_TR','zoom_TL','zoom_BR'];
        
    const symbolArray = [/#/,/./,/ /];
    
    if(Array.isArray(animationChange)){
        var customChange = [];
        const standartZoomArr = ['zoom_TL','zoom_TR','zoom_BR','zoom_BL'];
        for(let i = 0; i < 4; i++){            
            customChange[i] = standartZoomArr[animationChange[i]];
        }
    }    
    
    const totalImgSize = {x:0,y:0};
    const middleSize = {};
    const timeOut = {};
        
    const Helper = {};
    Helper.getSelector = function(target){
        for(let s in symbolArray){
            selectorMatch = target.match(symbolArray[s]);
            if(selectorMatch != null){
                switch(selectorMatch[0]){
                        
                case " ":
                    return document.querySelector(target);
                    break;

                case ".":
                    return document.getElementsByClassName(target.slice(1))[0];
                    break;

                case "#":
                    return document.getElementById(target.slice(1));
                    break;
                }
            }
        }        
    };
    //Возвращает среднее значение высоты слайдов
    Helper.sizing = function(totalWidth,totalHeight){

        middleSize.width = Math.floor(totalWidth / $img.length);
        middleSize.height = Math.floor(totalHeight / $img.length);
        aspectRatio = middleSize.height / middleSize.width;
        
        Helper.sliderResize();
                
    };
    Helper.sliderResize = function(){
        
        const sliderWidth = $slider.clientWidth;
        const sliderHeight = $slider.clientHeight;
        
        if(adaptive == "hybrid"){
            //Гибридная адаптивность
            
            const screenWidth = document.body.clientWidth;            
            let middleImgHeight = 0;
            
            if(screenWidth > treshholdMax){
                
                for(let i = 0; i < maxSlides; i++){                      
                    $img[i].style.width = `${middleSize.width}px`;
                    if(screenWidth < middleSize.width){
                        $img[i].style.left = `${(screenWidth - middleSize.width) / 2}px`;
                    }
                    else{
                        $img[i].style.left = "0px";
                    }
                    
                    middleImgHeight += $img[i].clientHeight;
                }
                $slider.style.height = `${middleImgHeight / maxSlides}px`;
                
            } else if(screenWidth < treshholdMax  && screenWidth > treshholdMin){
                
                
                let newW = middleSize.width - (treshholdMax-screenWidth) * reductionIndex;
                
                for(let i = 0; i < maxSlides; i++){                    
                    $img[i].style.width = `${newW}px`;
                    $img[i].style.left = `${(screenWidth - newW) / 2}px`;
                    middleImgHeight += $img[i].clientHeight;
                }
                $slider.style.height = `${middleImgHeight / maxSlides}px`;
                
            } else if(screenWidth < treshholdMax  && screenWidth < treshholdMin){
                
                for(let i = 0; i < maxSlides; i++){
                    
                    let newW = middleSize.width-(treshholdMax-treshholdMin)*reductionIndex;
                    
                    $img[i].style.width = `${newW}px`;
                    $img[i].style.left = `${(screenWidth - newW) / 2}px`;
                    middleImgHeight += $img[i].clientHeight;
                }
                $slider.style.height = `${middleImgHeight / maxSlides}px`;
            }

        } else if(adaptive){
                        
            sliderAdaptHeight = sliderWidth * aspectRatio;
            $slider.style.height = `${sliderAdaptHeight}px`;   
            
            for(let i = 0; i < maxSlides; i++){
                
                const imgHeight = $img[i].clientHeight;
                
                const imgAdaptH = sliderWidth / $img[i].clientWidth  * imgHeight;
                
                if(imgAdaptH < sliderAdaptHeight){
                    
                const newW=sliderAdaptHeight/$img[i].naturalHeight*$img[i].naturalWidth;
                    
                    $img[i].style.width = `${newW}px`;                    
                    $img[i].style.height = "100%";
                    
                    const def = parseInt((sliderWidth - newW) / 2);
                    $img[i].style.left = `${def}px`;
                                       
                } else {
                    $img[i].style.width = "100%";
                }
            }
            
        }else{
            sliderAdaptHeight = parseFloat($slider.style.height);
            
            for (let i = 0; i < maxSlides; i++){
                
                const imgWidth = $img[i].clientWidth;
                const imgHeight = $img[i].clientHeight;
                
                if(imgHeight < sliderHeight){
                    $img[i].style.height = `${sliderHeight}px`;
                    $img[i].style.width = `${imgWidth / imgHeight * sliderHeight}px`;
                }
                if($img[i].clientWidth < sliderWidth){
                    $img[i].style.width = `${sliderWidth}px`;
                }
                if(imgWidth > sliderWidth){
                    const def = parseInt((sliderWidth - imgWidth) / 2);
                    $img[i].style.left = `${def}px`;
                } else{
                    $img[i].style.left = "";
                }
            }
            
        }
    }
    Helper.raf = function(fn){
        window.requestAnimationFrame(function(){
            window.requestAnimationFrame(function(){
                fn();
            });
        });
    }
    Helper.getMode = function(){
        
        if(Array.isArray(animationChange)){
            return customChange[slidesCount % 4];            
        }
        else if(animationChange == "default"){
            return angleZoomArr[slidesCount % 4];
        }
        else if(animationChange == "random"){
            
            newRand = parseInt(Math.random() * 3);
            
            if(newRand != oldRand){
                oldRand = newRand;  
            }
            else{
                if(newRand == maxSlides - 1){
                    newRand--;
                    oldRand = newRand;
                }
                else{
                    newRand++;
                    oldRand = newRand;
                }
            }
            return angleZoomArr[newRand];            
        }        
    };
    Helper.error = function(message){
        if($slider) $slider.style.display = "none";        
        console.error(message);
    };
    
    if(fadeTime * 1.5 > duration){
        Helper.error("Fade Slider : Время перехода не может быть больше времени анимации!");
        return;
    }
    
    //Инициализация основных объектов    
    const $slider = Helper.getSelector(settings.target);     
    
    if(!$slider){
        Helper.error("Fade Slider : Контейнер слайдера не был найден!");
        return;
    } 
    
    const $sliderChild = $slider.children;
    
    if($sliderChild.length == 0){
        Helper.error("Fade Slider : Содержимое слайдера не найдено!");
        return;
    }
    
    const $viewport = function(){
        for(let i = 0,max = $sliderChild.length; i < max; i++){
            if($sliderChild[i].tagName == "UL"){
                return $sliderChild[i];
                break;
            }
        }      
    }();     
    
    const $li = $viewport.getElementsByTagName("li");
    const maxSlides = $li.length;    
    
    if(maxSlides == 0){
        Helper.error("Fade Slider : Нет ни одного слайда");
        return;
    }
    
    $slider.classList.add("fadeSlider");
    $viewport.classList.add("fs-Viewport");
           
    //Создаём анимируюмую обёртку для картинки
    const $frame = [];
    for(let i = 0; i < maxSlides; i++){ 
        
        $frame[i] = document.createElement("div");
        $frame[i].classList.add("fs-Frame");
        $frame[i].style.transitionDuration = `${fadeTime}ms`;
        
        if(animation){
            $frame[i].classList.add("fs-zoom");
            $frame[i].style.animationDuration = `${duration + fadeTime}ms`;              
        } else {
            $frame[i].classList.add("fs-pulse");        
        }
    }
    
    //Находим вложенные в li блоки и инднфицируем их как блоки подписи 
    if(caption){
        var $caption = [];
        for(let i = 0; i < maxSlides; i++){
            
            for(let e = 0, max = $li[i].children.length; e < max; e++){
                if(!$li[i].children[e].classList.contains("fs-Frame")){
                    $caption[i] = $li[i].children[e];
                    $caption[i].classList.add("fs-Caption");
                    $caption[i].style.transitionDuration = `${fadeTime}ms`;
                }
                
            }
        }
    }
    
    //Создаём картинки и их обёртку в DOM
    let imgCount = 0;
    const $img = [];    
    
    for(let i = 0; i < maxSlides; i++){
        
        $li[i].appendChild($frame[i]);
        $li[i].classList.add("fs-Item");
                
        //Создаём картинки из url
        $img[i] = new Image();
        $img[i].src = $li[i].getAttribute("data-src");
        //if(adaptive) $img[i].style.width = "100%";
        $frame[i].appendChild($img[i]);
        if(colorFilter){
            $img[i].style.animationDuration = `${duration - fadeTime - 1000}ms`;
        } 
        
        $img[i].onload = function(){

            totalImgSize.x += this.naturalWidth;
            totalImgSize.y += this.naturalHeight;
            
            imgCount++;
            
            if(imgCount == maxSlides) init();            
        };
        $img[i].onerror = function(e){
            console.log(e);
        };
    }
    
    function init(){
        
        //Устанавливаем базовые размеры картинок
        Helper.sizing(totalImgSize.x,totalImgSize.y);
                
        if(maxSlides > 1){
            //Устанавливаем базовые параметры, создаём кнопки и запускаем слайдер
            startProps();        
            createControls();
            
            
            if(animation){
                $frame[0].style.opacity = "1";
                window.addEventListener("load",function(){
                    setTimeout(function(){
                        autoPlay();
                        setTimeout(function(){
                            $frame[0].style.opacity = "";
                        },1000);
                    },2000);

                });
            }
            else{
                fade2();
            }
            
            //Отслеживаем уход и возврат пользователя на страницу
            outPageListen();
        }
        else{
            $frame[0].style.opacity = 1;
        }
        
        //Отслеживаем изменение ширины экрана
        window.addEventListener("resize",function(){
            Helper.sliderResize();
        });
    };
    
    function outPageListen(){
        document.addEventListener("visibilitychange", function(){
            
            if(document.visibilityState == "hidden"){
                if(animation){
                    stopAutoPlay();
                    for(let i = 0; i < maxSlides; i++){  
                        $frame[i].classList.remove("-fadeIn");
                        $frame[i].classList.remove("-animated");
                        $frame[i].classList.remove("-fadeOut");
                        $frame[i].style.animationName = "";
                        $frame[i].style.animationDuration = "";        
                        $frame[i].style.transitionDuration = "";
                        if(colorFilter) $img[i].classList.remove("-color");
                        if(pager) $pagerLi[i].classList.remove("-active");
                    }  
                } else {
                    stopAutoplay2();
                    for(let i = 0; i < maxSlides; i++){  
                        $frame[i].classList.remove("-fadeIn");
                        $frame[i].classList.remove("-fadeOut");
                        $frame[i].classList.remove("-active");
                        $frame[i].style.transitionDuration = "";                        
                        if(pager) $pagerLi[i].classList.remove("-active");
                    }
                }
                              
            }
            if(document.visibilityState == "visible"){
                if(animation){
                    for(let i = 0; i < maxSlides; i++){        
                        $frame[i].style.animationDuration = `${duration + fadeTime}ms`;
                        $frame[i].style.transitionDuration = `${fadeTime}ms`;
                    }
                } else {
                    for(let i = 0; i < maxSlides; i++){ 
                        $frame[i].style.transitionDuration = `${fadeTime}ms`;
                    }
                }
                Helper.raf(function(){
                    startProps();
                    animation ? autoPlay() : fade2();
                });
            }                         
        });
    }
    
    function startProps(){
        
        slidesCount = 0;
        currentSlide = 0;
        oldSlide = maxSlides - 1;
        startState = true; 
        if(caption) captionFade();
    }
    
    function createControls(){
        if(controls){
            $leftControl = document.createElement("a");
            $leftControl.className = "fs-Controls fs-LeftControl";
            $slider.insertBefore($leftControl,$viewport);
            
            $rightControl = document.createElement("a");
            $rightControl.className = "fs-Controls fs-RightControl";
            $slider.appendChild($rightControl);
        }

        if(pager){
            $pager = document.createElement("ul");
            $pager.classList.add("fs-Pager");
            $slider.appendChild($pager);

            for(let i = 0; i < maxSlides; i++){
                $pager.appendChild(document.createElement("li"));
            }
            
            $pagerLi = $pager.children;
        }
        
        activeClick();
        
    }

    function activeClick(){
        if(controls){
            $leftControl.addEventListener("click",leftControlHandler,false);
            $rightControl.addEventListener("click",rightControlHandler,false);
        }
        if(pager){
            $pager.addEventListener("click",pagerHandler,false);
        }       
    }
    
    function stopClick(){
        if(controls){
            $leftControl.removeEventListener("click", leftControlHandler,false);
            $rightControl.removeEventListener("click",rightControlHandler,false);
        }
        if(pager){
            $pager.removeEventListener("click",pagerHandler,false);
        }
    }
    
    function stopAutoPlay(){
        //console.log("stop auto");
        clearTimeout(timeOut.fadeIn);
        clearTimeout(timeOut.autoPlay);
    }
    
    function updatePager(){
        $pagerLi[currentSlide].classList.add("-active");
        $pagerLi[oldSlide].classList.remove("-active");
    }

    function leftControlHandler(e){

        e.preventDefault();
        animation ? stopAutoPlay() : stopAutoplay2();
        
        oldSlide = currentSlide;
        currentSlide--;
        currentSlide = currentSlide < 0 ? maxSlides - 1 : currentSlide--;
                
        if(pager) updatePager();
        
        action();
    }

    function rightControlHandler(e){

        e.preventDefault();
        animation ? stopAutoPlay() : stopAutoplay2();
        
        oldSlide = currentSlide;
        currentSlide = currentSlide + 1 == maxSlides ? 0 : currentSlide + 1;
        
        if(pager) updatePager();
        
        action();
    }

    function pagerHandler(e){
        
        if(e.target.tagName == "LI"){
            
            const index = [].indexOf.call($pagerLi,e.target);
        
            if(currentSlide != index){

                animation ? stopAutoPlay() : stopAutoplay2();
                oldSlide = currentSlide;
                currentSlide = index;
                                
                action();
            }   
        }                  
    }
    function action(){
        if(animation){
            startState = true;
            fade();
            autoPlay();
        } else {
            fade2();
        }
    }
    function autoPlay(){
        
        if(pager) updatePager();
        
        //Первое включение анимации
        if(startState == true){
            
            $frame[currentSlide].addEventListener("animationstart",listenAnimStart,false);
            
            startAnimation();
            startState = false;
        }
        
        function listenAnimStart(){
            
            $frame[currentSlide].removeEventListener("animationstart", listenAnimStart, false);

            //Начало fade перехода
            timeOut.fadeIn = setTimeout(function(){
                    
                //тут меняются индексы слайдов
                oldSlide = currentSlide;
                currentSlide = currentSlide + 1 == maxSlides ? 0 : currentSlide + 1;
                //начинаем переход
                fade(listenAnimStart);

            }, duration - (fadeTime / 2));

            //Автоповтор
            timeOut.autoPlay = setTimeout(function(){

                autoPlay();

            }, duration);
        }        
    }
    
    function startAnimation(){   
        
        $frame[currentSlide].style.animationName = Helper.getMode();
        $frame[currentSlide].classList.add("-animated");
        slidesCount++;
    }
    function captionFade(){

        $caption[currentSlide].style.display = "block";
        Helper.raf(function(){
            $caption[currentSlide].classList.add("-active");
        });
        
        $caption[oldSlide].classList.remove("-active");
        $caption[oldSlide].addEventListener("transitionend",endCaption);        
        
        function endCaption(){
            
            $caption[oldSlide].removeEventListener("transitionend",endCaption);
            $caption[oldSlide].style.display = "";
        }
            
    }
    function fade(startAnim){

        stopClick();
                
        $frame[currentSlide].classList.add("-fadeIn");
        $frame[oldSlide].classList.add("-fadeOut");        
        if(caption) captionFade();
        
        $frame[currentSlide].addEventListener("transitionend", endFade ,false);
                
        if(startState == false){
            $frame[currentSlide].addEventListener("animationstart",startAnim,false);
            startAnimation();
        }
                
        function endFade(){
            //Удаляем классы старых переходов и анимации 
            $frame[currentSlide].removeEventListener("transitionend", endFade ,false);
            $frame[currentSlide].classList.remove("-fadeIn");
            $frame[oldSlide].classList.remove("-animated");          
            $frame[oldSlide].classList.remove("-fadeOut");
            $frame[oldSlide].style.animationName = "";              

            if(colorFilter == true){
                Helper.raf(function(){
                    $img[oldSlide].classList.remove("-color");
                    setTimeout(function(){
                        $img[currentSlide].classList.add("-color");
                    },fadeTime / 4);
                    
                }); 
            }            
            activeClick();
        }
    }
    function fade2(){

        if(pager) updatePager();
        
        if(startState == true){
            $frame[currentSlide].style.transitionProperty = "none";
            Helper.raf(function(){
                startFade();
            });
        } else {
            stopClick();
            startFade();
        }
        
        function startFade(){
            
            $frame[currentSlide].classList.add("-active");
            if(caption) captionFade();
            
            if(startState == true){
                Helper.raf(function(){
                    $frame[currentSlide].style.transitionProperty = "";
                    startState = false;
                });
            } else{
                $frame[oldSlide].classList.remove("-active");
                $frame[currentSlide].classList.add("-fadeIn");
                $frame[oldSlide].classList.add("-fadeOut"); 
                $frame[currentSlide].addEventListener("transitionend", endFade ,false);
            }
            
            if(auto){
                timeOut.autoPlay2 = setTimeout(function(){
                
                    oldSlide = currentSlide;
                    currentSlide = currentSlide + 1 == maxSlides ? 0 : currentSlide + 1;

                    fade2();

                }, duration);
            }            
        }
        
        function endFade(){
            $frame[currentSlide].removeEventListener("transitionend", endFade ,false);
            $frame[currentSlide].classList.remove("-fadeIn");
            $frame[oldSlide].classList.remove("-fadeOut"); 
            activeClick();
        }
    }
    function stopAutoplay2(){
        clearTimeout(timeOut.autoPlay2);
    }
};