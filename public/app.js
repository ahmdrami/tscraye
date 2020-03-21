fetchProperties()

let update_property_id = null

submit.addEventListener('click', e => {
  e.preventDefault()

  const values = `name=${property_name.value}&price=${property_price.value}`
  const url = update_property_id
    ? `/api/property/${update_property_id}?${values}`
    : `/api/property?${values}`

  fetch(url, {
    method: update_property_id ? 'PATCH' : 'POST'
  })
    .then(() => fetchProperties())
    .catch((e) => console.log(e.message))

  resetValues()
})

function fetchProperties() {
  fetch('/api/property')
    .then(resp => resp.json())
    .then(
      data =>
        (document.getElementById(
          'property-listing'
        ).innerHTML = renderProperties(data))
    )
    .catch((e) => console.log(e.message))
}

function renderProperties(properties) {
  let html = ''
  properties.forEach(property => {
    const a = document.createElement('a')
    a.onclick = onUpdate
    a.innerHTML = 'Delete'
    html += `
    <div class="column is-one-third">
      <div class="card">
        <div class="card-content">
          <p class="title">
            ${property.name}
          </p>
          <p class="subtitle">
            £${property.price}
          </p>
        </div>
        <footer class="card-footer">
          <p class="card-footer-item">
           <a class="update-link href="#" data-id='${property.id}' onclick="onUpdate(event, '${property.name}', '${property.price}')">Update</a>
          </p>
          <p class="card-footer-item">
            <a class="delete-link" data-id="${property.id}"  "href="#" onclick="onUpdate(event)">Delete</a>
          </p>
        </footer>
      </div>
    </div>
    `
  })
  return html
}

function onUpdate(e, name, price) {
  e.preventDefault()
  if (e.target && e.target.classList.contains('delete-link')) {
    fetch(`/api/property/${e.target.dataset.id}`, {
      method: 'DELETE'
    }).then(() => fetchProperties())
  }
  if (e.target && e.target.classList.contains('update-link')) {
    property_name.value = name
    property_price.value = price
    update_property_id = e.target.dataset.id
  }
}

function resetValues() {
  update_property_id = null
  property_price.value = ''
  property_name.value = ''
}
