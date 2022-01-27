//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot

$(document).ready(function(){
  // On form submit action execute this code
  $("#custom-form").submit(function(event){
    // Ignore default form submit behavior
    event.preventDefault()
    // Construct body of API call
    var data = {
      "fields": [
        {
          "objectTypeId": "0-1",
          "name": "email",
          "value": $("#email").val()
        },
        {
          "objectTypeId": "0-1",
          "name": "firstname",
          "value": $("#firstname").val()
        },
        {
          "objectTypeId": "0-1",
          "name": "lastname",
          "value": $("#lastname").val()
        }
      ]
    };
    var url = "https://api.hsforms.com/submissions/v3/integration/submit/21334118/876e460d-12e3-4430-b61a-98e9bc54c56f";
    // var url = "https://webhook.site/d31b760b-650c-4dc9-a42a-e506013da95f";
    // Settings for ajax call
    var settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify(data),
      // Feedback based on response code
      statusCode: {
        200: function(response) {
          console.log(response.inlineMessage)
        },
        400: function(response) {
          var res = response.responseJSON
          console.log("Status: " + res.status + " ... " +  res.message)
          console.log("Hubspot correlationId: " + res.correlationId)
          console.log("Error type: " + res.errors[0].errorType)
          console.log("Error message: " + res.errors[0].message)
        },
        403: function(xhr) {
          console.log(response.responseText)
        },
        404: function(xhr) {
          console.log(response.responseText)
        },
      }
    };
    // Execute POST request
    $.ajax(settings)

  })
})
