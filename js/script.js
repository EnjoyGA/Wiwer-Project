"use strict";

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabcontent');
    const tabItem = document.querySelectorAll('.tabheader__item');
    const tabParent = document.querySelector('.tabheader__items');


    // Tabs

    function hideTabContent() {
        tabs.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });

        tabItem.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabs[i].classList.add('show', 'fade');
        tabs[i].classList.remove('hide');
        tabItem[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabItem.forEach((item, i) => {
                if (item == target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // Timer


    const deadLine = '2022-02-28';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 * 60) % 60),
            seconds = Math.floor(t / 1000 % 60);

        return {
            t,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.t <= 0) {
                clearInterval(timeInterval);
            }

        }
    }
    setClock('.timer', deadLine);


    // Modal 


    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modalTriggerClose = document.querySelector('[data-close]'),
        modalWindow = document.querySelector('.modal');

    function show(modal) {
        modal.classList.remove('hide');
        modal.classList.add('show');
        document.body.style.overflowY = 'hidden';
        window.removeEventListener('scroll', showModalByScroll);
    }

    function hide(modal) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflowY = '';
    }


    function ShowModalWindow(openElement, modal) {
        openElement.forEach(item => {
            item.addEventListener('click', () => {
                show(modal);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                hide(modal);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.classList.contains('show')) {
                hide(modal);
            }
        });
    }
    // function HideModalWindow(closeElement, modal){
    //     closeElement.addEventListener('click', ()=>{
    //         hide(modal);
    //     });
    // }


    ShowModalWindow(modalTrigger, modalWindow);
    // HideModalWindow(modalTriggerClose, modalWindow);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            show(modalWindow);
            // window.removeEventListener('scroll', showModalByScroll);
        }

        // if(document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
        //     show(modalWindow);
        //     window.removeEventListener('scroll', showModalByScroll);
        // }
    };
    window.addEventListener('scroll', showModalByScroll);


    // Price

    class CreateMenuCard {
        constructor(src, alt, name, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.name = name;
            this.descr = descr;
            this.classes = classes;
            this.price = price;
            this.vallute = 27;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.vallute;
        }

        render() {
            const elem = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                elem.classList.add(this.element);
            } else {
                this.classes.forEach(className => elem.classList.add(className));
            }
            elem.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.name}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(elem);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}; status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data=>{
    data.forEach(({img, alt, title, descr, price})=>{
        new CreateMenuCard(img, alt, title, descr, price, '.menu .container').render();
            });
        });

    // axios.get('http://localhost:3000/menu')
    //     .then(data => {
    //         data.data.forEach(({
    //             img,
    //             alt,
    //             title,
    //             descr,
    //             price
    //         }) => {
    //             new CreateMenuCard(img, alt, title, descr, price, '.menu .container').render();
    //         });
    //     });

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/spinner.svg',
        success: 'Thanks, wait a few moment',
        failure: 'Something goes wrong'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block; 
            margin: 0 auto;`;
            form.insertAdjacentElement('afterend', statusMessage);



            // request.setRequestHeader('Content-type', 'application/json');// don't needed for form-data (multipart/form-data)
            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    statusMessage.remove();
                    showThanksModal(message.success);
                }).catch(() => {
                    showThanksModal(message.failure);
                    statusMessage.remove();
                }).finally(() => {
                    form.reset();
                });
            console.log(formData.entries());
        });
    }


    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__content');
        prevModal.classList.remove('show');
        prevModal.classList.add('hide');
        show(modalWindow);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__content');
        thanksModal.innerHTML = `<div class='modal__title'>${message}</div> <div data-close class='modal__close'>×</div>`;

        document.querySelector('.modal__dialog').append(thanksModal);
        setTimeout(function () {
            thanksModal.remove();
            prevModal.classList.add('show');
            prevModal.classList.remove('hide');
            hide(modalWindow);
        }, 2500);
    }


    // Slider

    const   slider = document.querySelector('.offer__slider'),
            slidesWrapper = document.querySelector('.offer__slider-wrapper'),
            slidesField = document.querySelector('.offer__slider-inner'),
            slides = document.querySelectorAll('.offer__slide'),
            total = document.querySelector('#total'),
            current = document.querySelector('#current'),
            next = document.querySelector('.offer__slider-next'),
            prev = document.querySelector('.offer__slider-prev'),
            indicators = document.createElement('ol'),
            width = +window.getComputedStyle(slidesWrapper).width.match(/\d/g).join('');
    let slideIndex = 1;
    let offset = 0;

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.cssText = `width: ${100 * slides.length + '%'}; display: flex; transition: 0.5s all;`;
    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => slide.style.width = width);

    indicators.classList.add('carousel-indicators');
    slider.style.position = 'relative';
    slider.append(indicators);
    const dots = [];

    for(let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1);
        dot.classList.add('dot');
        indicators.append(dot);
        dots.push(dot);

        if(i == 0) dot.style.opacity = '1';
    }
  
    next.addEventListener('click', ()=>{
        if(offset == width * (slides.length - 1)){
            offset = 0;
        }else{
            offset += width;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }

        checkCurrent();
        activeDot();
    });

    prev.addEventListener('click', ()=>{
        if(offset == 0){
            offset = width * (slides.length - 1);
        }else{
            offset -= width;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }

        checkCurrent();
        activeDot();
    });

    dots.forEach(dot =>{
        dot.addEventListener('click', (e)=>{
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = width * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            checkCurrent();
            activeDot();
        });
    });

       // functions ***

    function checkCurrent(){
        if(slideIndex < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = slideIndex;
        }
    }

    function activeDot(){
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';
    }






















    










    // showSlides(slideIndex);
    // if(sliders.length >= 10){
    //     total.textContent = `0${sliders.length}`;
    // }else{
    //     total.textContent = sliders.length;
    // }

    // function showSlides(n){
    //     if(n > sliders.length){
    //         slideIndex = 1;
    //     }
    //     if(n < 1){
    //         slideIndex = sliders.length;
    //     }


    //     sliders.forEach(item => item.style.display = 'none');
    //     sliders[slideIndex-1].style.display = 'block';

    //     if(sliders.length >= 10){
    //         current.textContent = `0${slideIndex}`; // current slide
    //     }else{
    //         current.textContent = slideIndex;
    //     }
    // }


    // function plusSlides(n){
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', ()=>{
    //     plusSlides(-1);
    // });
    // next.addEventListener('click', ()=>{
    //     plusSlides(1);
    // });
});