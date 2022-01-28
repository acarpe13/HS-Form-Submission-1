//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot

// Wait until document is loaded
$(document).ready(function(){
  // On form submit action execute this code
  $("#to-hs-api").submit(function(event){
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

    // Settings for ajax call
    var settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify(data),

      // Display Feedback based on response code
      statusCode: {
        200: function(response) {
          $(".message-header").text("Success");
          $(".message-body").html(`<p>${response.inlineMessage}<p>`);
          $("#submit-message").attr("class","message is-success");
          $("#submit-response").removeAttr("hidden");
          // console.log(response.inlineMessage);
        },
        400: function(response) {
          var res = response.responseJSON
          $(".message-header").text(res.message);

          $(".message-body").html(`<p>Hubspot Correlation Id: ${res.correlationId}</p>`)
          $(".message-body").append(`<p>Error Type: ${res.errors[0].errorType}</p>`)
          $(".message-body").append(`<p>Error Message: ${res.errors[0].message}</p>`)

          $("#submit-message").attr("class","message is-danger");
          $("#submit-response").removeAttr("hidden");

        },
        403: function(xhr) {
          $(".message-header").text("Status: 403");
          $(".message-body").html(`${response.responseText}`);

          $("#submit-message").attr("class","message is-danger");
          $("#submit-response").removeAttr("hidden");
        },
        404: function(xhr) {
          $(".message-header").text("Status: 404");
          $(".message-body").html(`${response.responseText}`);

          $("#submit-message").attr("class","message is-danger");
          $("#submit-response").removeAttr("hidden");
        },
      }
    };

    // Execute POST request
    $.ajax(settings)

  })

  // not very DRY. Refactor later
  $("#to-express-api").submit(function(event){
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

    var url = "https://webhook.site/d31b760b-650c-4dc9-a42a-e506013da95f";

    // Settings for ajax call
    var settings = {
      "url": url,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify(data),

      // Display Feedback based on response code
      statusCode: {
        200: function(response) {
          $(".message-header").text("Success");
          $(".message-body").html(`<p>${response.inlineMessage}<p>`);
          $("#submit-message").attr("class","message is-success");
          $("#submit-response").removeAttr("hidden");
          // console.log(response.inlineMessage);
        },
        400: function(response) {
          var res = response.responseJSON
          $(".message-header").text(res.message);

          $(".message-body").html(`<p>Hubspot Correlation Id: ${res.correlationId}</p>`)
          $(".message-body").append(`<p>Error Type: ${res.errors[0].errorType}</p>`)
          $(".message-body").append(`<p>Error Message: ${res.errors[0].message}</p>`)

          $("#submit-message").attr("class","message is-danger");
          $("#submit-response").removeAttr("hidden");

        },
        403: function(xhr) {
          $(".message-header").text("Status: 403");
          $(".message-body").html(`${response.responseText}`);

          $("#submit-message").attr("class","message is-danger");
          $("#submit-response").removeAttr("hidden");
        },
        404: function(xhr) {
          $(".message-header").text("Status: 404");
          $(".message-body").html(`${response.responseText}`);

          $("#submit-message").attr("class","message is-danger");
          $("#submit-response").removeAttr("hidden");
        },
      }
    };

    // Execute POST request
    $.ajax(settings)

  })
})

// Tab Navigation
function openTab(evt, tabName) {
  var i, x, tablinks;
  // get tab content elements
  x = document.getElementsByClassName("content-tab");
  // for each element set display to none (hide)
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  // get tab elements
  tablinks = document.getElementsByClassName("tab");
  // set all tabs to inactive
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }
  // set current content to display on (unhide)
  document.getElementById(tabName).style.display = "block";
  // set current tab to active
  evt.currentTarget.className += " is-active";
}
