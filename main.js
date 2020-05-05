class AppData {
  constructor() {
    this.data = {};
    this.dataSort = {};
    this.filmGender = new Set();
    this.filmSpecies = new Set();
    this.filmStatus = new Set();
    this.filmCitizenships = new Set();
    this.SHOWING_FILMS_COUNT_ON_START = 10;
    this.SHOWING_FILMS_COUNT_BY_BUTTON = 5;
    this.showingFilmsCount = this.SHOWING_FILMS_COUNT_ON_START;
    this.filmWrapper = {};
    this.filmBtnShow = {};
    this.form = {};
    this.filmCard = {};
    this.filmsLink = {};
    this.body = document.querySelector('body');
    this.popup = {};
    this.film = {};
    this.cardCountNum = 0;
    this.cardCountHtml = document.querySelector('.search__count');
    this.elementCheckedStart = {};
  } 
  // Удалить обьект со страницы
  remove (element) {
    element.remove();
  }
  // Удалить обьекты со страницы
  removeAll (element) {
    element.forEach(el => {
      this.remove(el);
    });
  }
  // start
  start () {   
    const outputData = (data) => {
      this.data = data;
      this.dataSort = data;
      this.dataSort.forEach(el => {
        el.gender === undefined ? false : this.filmGender.add(el.gender.toLowerCase());
        el.species === undefined ? false : this.filmSpecies.add(el.species.toLowerCase());
        el.status === undefined ? false : this.filmStatus.add(el.status.toLowerCase());
        el.citizenship === undefined ? false : this.filmCitizenships.add(el.citizenship.toLowerCase());
      });
      this.renderMenu(this.filmGender, this.filmCitizenships, this.filmStatus, this.filmSpecies);
      
      this.film = document.querySelector('.film');

      this.render(this.film, this.createShowFilmBtnTemplate(), `beforeend`);
      this.renderFilms();
      this.menuSortCheck();
      this.clickCard();
      this.renderCountSearch();
      this.filmBtnShow.addEventListener(`click`, this.clickShowBtn.bind(this));
      this.elementCheckedStart = this.inputCheck(); 
    };

    const errorData = (data) => {
      renderCountSearch(data);
    };
    
    this.postData()
      .then(outputData)
      .catch(errorData);
  }
  // ф-ция рендора 
  render (container, template, place = `beforeend`) {
    container.insertAdjacentHTML(place, template);    
  }
  // рендер всех (Боковое меню )
  renderMenu (filmGender, filmCitizenships, filmStatus, filmSpecies) {
    const filmGenderHtml = document.querySelector('.filmGender');
    const filmCitizenshipsHtml = document.querySelector('.filmCitizenships');
    const filmStatusHtml = document.querySelector('.filmStatus');
    const filmSpeciesHtml = document.querySelector('.filmSpecies');

    this.render(filmGenderHtml, this.createSearchMenuTemplate('gender', 'Allgender', 'checked'), `beforeend`);
    filmGender.forEach((el) => {
      if (el !== undefined) {
        
        this.render(filmGenderHtml, this.createSearchMenuTemplate('gender', el), `beforeend`);
      }
    });
    this.render(filmCitizenshipsHtml, this.createSearchMenuTemplate('citizenship', 'Allcitizenship', 'checked'), `beforeend`);
    filmCitizenships.forEach((el) => {    
      if (el !== undefined) {
        this.render(filmCitizenshipsHtml, this.createSearchMenuTemplate('citizenship', el), `beforeend`);
      }
    });
    this.render(filmStatusHtml, this.createSearchMenuTemplate('status', 'Allstatus', 'checked'), `beforeend`);
    filmStatus.forEach((el) => {
      if (el !== undefined) {
        this.render(filmStatusHtml, this.createSearchMenuTemplate('status', el), `beforeend`);
      }    
    });
    this.render(filmSpeciesHtml, this.createSearchMenuTemplate('species', 'Allspecies', 'checked'), `beforeend`);
    filmSpecies.forEach((el) => {
      if (el !== undefined) {
        this.render(filmSpeciesHtml, this.createSearchMenuTemplate('species', el), `beforeend`);
      }
    });
  }
  // рендер фильмов - Кнопка Показать еще
  renderFilms () {
    this.filmWrapper = document.querySelector('.film__wrapper');
    this.dataSort.slice(0, this.showingFilmsCount).forEach((dataSort) =>
          this.render(this.filmWrapper, this.createFilmTemplate(dataSort.photo, dataSort.name, dataSort.realName, `beforeend`)));
    this.clickFilter();
  }
  // Боковое меню
  createSearchMenuTemplate (name , el, checked = '') {
    let n = name[0].toUpperCase() + name.substring(1);
    let e = el[0].toUpperCase() + el.substring(1);
    
    return (`
      <label class="search__label" for="${e}-${n}">
        <input class="search__input ${n}" 
          type="radio" 
          id="${e}-${n}" name="${n}" 
          ${checked}>
          ${e}
      </label>
    `);
  }
  // карточки фильмов
  createFilmTemplate (url, name, realName) {
    return (`
    <div class="film__card" >
      <a class="film__link" href="#"></a>
      <div class="film__wrapper__image">
        <img class="film__img" src="${url.replace(/\/$/,'')}" alt="${name}" width="200px">
      </div>
      <div class="film__description">
        <h4 class="film__name">${name}</h4>
        <span class="film__name">${realName === undefined ? '---' : realName}</span>
      </div>
    </div>
    `);
  }
  // попап 
  createRenderSimilarMoviesTemplate (movies) {
    let elem = '';
    movies.forEach(el => {
      elem += (`<i href="#" class="popup__move-item">${el}</i>`);
    });   
    return elem;
  }
  createPopupTemplate (card) {
    return (`
    <div class="popup">
    <div class="popup__wrapper">
      <a class="popup__btn-close" href="#">X</a>
      <div class="popup__wrapper-img">
        <img class="popup__img" src="${card.photo === undefined ? 'Is unknown': card.photo}" alt="${card.name === undefined ? 'Is unknown': card.name}">
      </div>
      <div class="popup__description">
        <span class="popup__item popup__name">Name: <span>${card.name === undefined ? 'Is unknown': card.name}</span></span>
        <span class="popup__item popup__realName">RealName :<span>${card.realName === undefined ? 'Is unknown': card.realName}</span></span>
        <span class="popup__item popup__species">Species: <span></span>${card.species === undefined ? 'Is unknown': card.species}</span>
        <span class="popup__item popup__citizenship">Citizenship: <span>${card.citizenship === undefined ? 'Is unknown': card.citizenship}</span></span>
        <span class="popup__item popup__gender">Gender: <span>${card.gender === undefined ? 'Is unknown': card.gender}</span></span>
        <span class="popup__item popup__status">Status: <span>${card.status === undefined ? 'Is unknown': card.status}</span></span>
        <span class="popup__item popup__actors">Актеры: <span>${card.actors === undefined ? 'Is unknown': card.actors}</span></span>
        <span class="popup__item popup__day">
          BirthDay: <span>${card.birthDay === undefined ? 'Is unknown': card.birthDay}.</span>
          DeathDay: <span>${card.deathDay === undefined ? 'Is unknown': card.deathDay}</span>
        </span>
        <div class="popup__item popup__movies">
          Movies: <br>
          ${card.movies === undefined ? 'Is unknown': this.createRenderSimilarMoviesTemplate(card.movies)}
        </div>
    </div>
    `);
  }
  // рендер кнопки
  createShowFilmBtnTemplate () {
    return (`<button class="film__btn__show">Показать еще</button>`);
  }
  // Подключение
  postData () {
    return new Promise ((resolve, reject) => {
      const request = new XMLHttpRequest();
  
      request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) {
            return;
          }
        if (request.status === 200) {
            this.data = JSON.parse(request.responseText);
            resolve(this.data);
        } else {
            reject(responseText);
        }
      });
  
      request.open('GET', './dbHeroes.json');
      request.setRequestHeader('Content-type', 'application/json');
      request.send();
    });
  }
  // Клик фильтрам + рендер на странице
  clickFilter () {
    this.filmBtnShow = document.querySelector('.film__btn__show');   

    if (this.filmBtnShow === null) {
      if (this.dataSort.length <= 10) {
        return;
      }

      this.render(this.film, this.createShowFilmBtnTemplate(), `beforeend`);
      this.filmBtnShow = document.querySelector('.film__btn__show');
      this.filmBtnShow.addEventListener(`click`, this.clickShowBtn.bind(this));
    } else if (this.dataSort.length <= 10) {
        this.remove(this.filmBtnShow);
        
    }
  }

  clickShowBtn () {
    const prevFilmsCount = this.showingFilmsCount;
    this.showingFilmsCount = this.showingFilmsCount + this.SHOWING_FILMS_COUNT_BY_BUTTON;

    this.dataSort.slice(prevFilmsCount, this.showingFilmsCount)
      .forEach((data) => this.render(this.filmWrapper, this.createFilmTemplate(data.photo, data.name, data.realName, `beforeend`)));

    if (this.showingFilmsCount >= this.dataSort.length) {
      this.remove(this.filmBtnShow);
    }
  }
  // Чекнутые инпуты
  inputCheck () {
    let input = [...this.form.elements].filter(item => {
      return item.className !== 'search__btn' && item.checked === true;
    });
    let arr = {};
 
    input.forEach(el => {
      let one = el.id.split('-');
      arr[one[1]] = one[0];
    });
    return arr;
  }
  
  flterCardData (elementChecked) {

    let filterGender = [];
    this.data.forEach(el => {
      if (el.gender !== undefined) {
        if (el.gender.toLowerCase() === elementChecked.Gender.toLowerCase()) filterGender.push(el);
        if (elementChecked.Gender.toLowerCase() === "Allgender".toLowerCase()) filterGender.push(el);
      } else {
        filterGender.push(el);
      }
    });
    let filterStatus = [];
      filterGender.forEach(el => {
        if (el.status !== undefined) {
          if (el.status.toLowerCase() === elementChecked.Status.toLowerCase()) filterStatus.push(el);
          if (elementChecked.Status.toLowerCase() === "Allstatus".toLowerCase()) filterStatus.push(el);
        } else {
          filterStatus.push(el);
        }
    });

    let filterSpecies = [];
    filterStatus.forEach(el => {
      if (el.species !== undefined) {
        if (el.species.toLowerCase() === elementChecked.Species.toLowerCase()) filterSpecies.push(el);
        if (elementChecked.Species.toLowerCase() === "Allspecies".toLowerCase()) filterSpecies.push(el);
      } else {
        filterSpecies.push(el);
      }
    });

    let filterCitizenship = [];
    filterSpecies.forEach(el => {
      if (el.citizenship !== undefined) {          
        if (el.citizenship.toLowerCase() === elementChecked.Citizenship.toLowerCase()) filterCitizenship.push(el);
        if (elementChecked.Citizenship.toLowerCase() === "Allcitizenship".toLowerCase()) filterCitizenship.push(el);
      } else {
        filterCitizenship.push(el);
      }
    });

    return filterCitizenship;
  }
  // форма сортировки
  menuSortCheck () {
    this.form = document.querySelector('form');
    this.form.addEventListener('click', (evt) => {

      if (evt.target.classList.contains('search__input')) {     
        this.showingFilmsCount = this.SHOWING_FILMS_COUNT_ON_START;
        this.filmCard = document.querySelectorAll('.film__card');
        this.removeAll(this.filmCard);
        let elementChecked = this.inputCheck(); 
        this.dataSort = this.flterCardData(elementChecked);
        this.renderCountSearch(this.dataSort.length);
        if (this.dataSort.length === 0) this.dataSort = this.data;
        this.renderFilms();
        
      }
      if (evt.target.classList.contains('search__btn')) {

        this.showingFilmsCount = this.SHOWING_FILMS_COUNT_ON_START;
        this.filmCard = document.querySelectorAll('.film__card');
        this.removeAll(this.filmCard);
        this.dataSort = this.flterCardData(this.elementCheckedStart);
        this.renderCountSearch(this.dataSort.length);
        this.renderFilms();
      }
    });
  }
  // рендер кол-во найденых эл
  renderCountSearch(number = this.dataSort.length, color = 'green') {
    if (number === 0) {
      number = "Ничего не найдено. Показаны все.";
      color = 'red';
    }
    this.cardCountHtml.textContent = number;
    this.cardCountHtml.style.color = color;

  }
  // Клик по карточке / рендер попапа
  clickCard () {
    this.filmWrapper.addEventListener('click', (evt) => {
     
      evt.preventDefault();
      if (evt.target.matches('.film__link')) {
        let card = evt.target.parentNode;
        let nameCard = card.querySelector('.film__name').textContent;
        this.dataSort.forEach(el => {
            if (el.name === nameCard)  {
              this.render(this.body, this.createPopupTemplate(el));
            }
        });

        this.popup = document.querySelector('.popup');
        this.closePopup();
      }
    });
  }
// закрыть popup 
  closePopup () {
    this.popup.addEventListener('click', (evt) => {
      if (evt.target.matches('.popup__btn-close') || evt.target.matches('.popup')) {
        evt.preventDefault();
        this.remove(this.popup);
      }
    });
    document.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 27) {
        this.remove(this.popup);    
      }
    });

  }


}

const appData = new AppData();
appData.start();
