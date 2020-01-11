/***********************************DarkSide Button***********************************/

const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

toggleSwitch.addEventListener('change', switchTheme, false);

/*********************************^^DarkSide Button^^*********************************/

function formatDate(date) {
  const year = date[0] + date[1] + date[2] + date[3];
  const month = Number(date[5] + date[6]) - 1;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Dececember'
  ];
  const day = date[8] + date[9];
  const newDate = `${months[month]} ${day}, ${year}`;
  return newDate;
}
function renderData(colType, data) {
  let col = document.querySelector(`#${colType}-list`);
  data.results.forEach(datum => {
    col.innerHTML += `
            <div class="entry">
                <h4 id="${colType}">${
      colType === 'films' ? datum.title : datum.name
    }</h4>
                <p>${
                  colType === 'people'
                    ? `appeared ${datum.films.length} in films`
                    : colType === 'films'
                    ? `released on ${formatDate(datum.release_date)}`
                    : colType === 'starships'
                    ? datum.starship_class
                    : colType === 'vehicles'
                    ? `Manufactured by ${datum.manufacturer}`
                    : ''
                }</p>
            </div>
        `;
  });
  renderStats(colType, data);
  addLoadMoreButton(colType, data);
}

function filter(inputType) {
  const input = document.querySelector(`#${inputType}-input`);
  const inputValue = input.value.toUpperCase();
  const nodes = [...document.querySelectorAll(`#${inputType}`)];
  nodes.forEach(node => {
    node.innerText.toUpperCase().indexOf(inputValue) > -1
      ? (node.parentNode.style.display = '')
      : (node.parentNode.style.display = 'none');
  });
}

function renderStats(inputType, data) {
  const statsNode = document.querySelector(`#${inputType}-stats`);
  const count = document.querySelector(`#${inputType}-list`).childElementCount;
  statsNode.innerText = ` viewing ${count} of ${data.count}`;
}

function addLoadMoreButton(inputType, data) {
  if (data.count > 10) {
    const moreData = document.createElement('BUTTON');
    const buttonLabel = document.createTextNode('Load More');
    moreData.appendChild(buttonLabel);
    document.querySelector(`#more-${inputType}`).appendChild(moreData);
  }
}

function loadMore() {
  // when a load more button is clicked,
  // fetch(data.next), then render it
}

async function fetchData() {
  const people = fetch(`http://star-cors.herokuapp.com/people`);
  const films = fetch(`http://star-cors.herokuapp.com/films`);
  const starships = fetch(`http://star-cors.herokuapp.com/starships`);
  const vehicles = fetch(`http://star-cors.herokuapp.com/vehicles`);

  const response = await Promise.all([people, films, starships, vehicles]);

  const peopleResponse = response[0];
  const filmsResponse = response[1];
  const starshipsResponse = response[2];
  const vehiclesResponse = response[3];

  const peopleJSON = await peopleResponse.json();
  const filmsJSON = await filmsResponse.json();
  const starshipsJSON = await starshipsResponse.json();
  const vehiclesJSON = await vehiclesResponse.json();
  console.log(starshipsJSON);

  renderData('people', peopleJSON);
  renderData('films', filmsJSON);
  renderData('starships', starshipsJSON);
  renderData('vehicles', vehiclesJSON);
}

fetchData();
