const form = document.querySelector('.url-form');
const result = document.querySelector('.result-section');
form.addEventListener('submit', event => {
  event.preventDefault();

  const input = document.querySelector('.url-input');
  //console.log(input)
  fetch('/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      URL: input.value,
    })
  })
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      while (result.hasChildNodes()) {
        result.removeChild(result.lastChild);
      }


      result.insertAdjacentHTML('afterbegin', `
        <p>
        <a href = "${data.original_url}">${data.original_url}</a> is now at <a id="shortened" href = "${location.origin}/${data.short_id}">${location.origin}/${data.short_id}</a>
        </p>
      `)
    })
    .catch(console.error)
});