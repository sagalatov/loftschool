/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
 const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds*1000)
  });
  return promise;
}


/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
const loadButton = document.querySelector('#LoadButton');
const container = document.querySelector('#filter-result');
const formValue = document.querySelector('#filter-input');
const loading = document.querySelector('#loading-block');
const fragment = document.createDocumentFragment();


const getTowns = async() => {
  const allTowns = await fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
  .then(res => res.json())
  .then(towns => towns.map(town => town.name))
  .catch(e => console.error("Важная ошибка"))
  return allTowns;
}

formValue.addEventListener('keydown', () => {
  if (event.code.includes('Key') || event.key === 'Shift') {

    for (const town of allTowns) {
      if (town.toLowerCase().includes(formValue.value.toLowerCase()) && formValue.value.toLowerCase().length > 1) {
        fragment.appendChild(createTownDom(town));
      }
    }
  } else if (event.key === 'Backspace') {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
});

function createTownDom(town) {
  const div = document.createElement('div');
  div.textContent = town;
  return div;
}


export {
    delayPromise,
    loadAndSortTowns
}
}
