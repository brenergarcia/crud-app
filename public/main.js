const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'put',
    /*telling the server that a JSON data is being sent by setting the Content-Type 
    headers to application/json*/
    headers: { 'Content-Type': 'application/json' },
    //converting the data sent into JSON
    body: JSON.stringify({
      name: 'George Bernard Shaw',
      quote: 'Success does not consist in never making mistakes but in never making the same one a second time.'
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      window.location.reload(true)
    })
})

deleteButton.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'George Bernard Shaw'
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      //telling the user there’s no Bernard Shaw quote to delete
      if (response === 'No quote to delete') {
        messageDiv.textContent = 'No George Bernard Shaw quote to delete'
      } else {
        window.location.reload(true)
      }
    })
    .catch(console.error)
})
