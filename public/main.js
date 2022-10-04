const { response } = require("express")

const update= document.querySelector('#update-button')
const deleteButton= document.querySelector('#delete-button')
const messageDiv= document.querySelector('#message')

update.addEventListener('click', _ =>{
    //use fetch for the put request here (coming from the button)
    // set the end point to '/quotes' since thats where we want to send the req
    fetch('/quotes', {
        //tell it we're using the put method
        method: 'put',
        //tell is we're sending json 
        headers: {'Content-Type': 'application/json'},
        //conver the data we're sending into JSON do this by using JSON.stringify (the data is passed via the body property)
        body: JSON.stringify( {
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        })
    })
    //need to put another then obj ; because its a promised returned from the server : use a then obj to get the the response from the server
     .then(res => {
        if (res.ok) return res.json()
      })
      .then(response => {
        //reload the window
        window.location.reload(true)
      })
  })


  /*delete button fetch*/
  //since we're deleting a quote by Darth Vader we only need to send Darth Vaders name to the server

  deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Darth Vadar'
      })
    })
      .then(res => {
        if (res.ok) return res.json()
      })
      .then(response => {
        if (response === 'No quote to delete') {
          messageDiv.textContent = 'No Darth Vadar quote to delete'
        } else {
          window.location.reload(true)
        }
      })
      .catch(console.error)
  })