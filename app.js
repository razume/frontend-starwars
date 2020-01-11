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

/************************************************************************************
 * FUNCTION NAME: formatData                                                        *
 * PARAMETERS: 1 -> a date of type string, in YYYY-MM-DD format                     *
 * DESCRIPTION: converts a date string in YYYY-MM-DD and changes it to              *
 *              a nicer looking MONTH DAY, YEAR format                              *
 ************************************************************************************/

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

/************************************************************************************
 * FUNCTION NAME: renderData                                                        *
 * PARAMETERS: 2 -> colType: a string that descibes the type of column, data: SWAPI *
 *             data in JSON format                                                  *
 * DESCRIPTION: renders all JSON data to the browser screen                         *
 ************************************************************************************/

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

/************************************************************************************
 * FUNCTION NAME: filter                                                            *
 * PARAMETERS: 1 -> inputType: a string that descibes the type of column            *
 * DESCRIPTION: filters user input -- called onkeyup in index.html                  *
 ************************************************************************************/

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

/************************************************************************************
 * FUNCTION NAME: renderStats                                                       *
 * PARAMETERS: 2 -> colType: a string that descibes the type of column, data: SWAPI *
 *             data in JSON format                                                  *
 * DESCRIPTION: renders length of data array for each data type                     *
 ************************************************************************************/

function renderStats(inputType, data) {
  const statsNode = document.querySelector(`#${inputType}-stats`);
  const count = document.querySelector(`#${inputType}-list`).childElementCount;
  statsNode.innerText = ` viewing ${count} of ${data.count}`;
}

// Adds a Load More button if data.length is > 10
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

/***************************************************************
 *                 call render functions below                 *
 ***************************************************************/

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

// everything is called with a simple fetchData()
fetchData();
