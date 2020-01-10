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
                    ? `released on ${datum.release_date}`
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

function loadMore(inputType, data) {
  if (data.count > 10) {
    // insert a button
  }
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
