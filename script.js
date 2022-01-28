//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot

// var url_obj1 = "https://api.hsforms.com/submissions/v3/integration/submit/21334118/876e460d-12e3-4430-b61a-98e9bc54c56f";
// var url_obj2 = "http://localhost:3000/form/submissions";
// import Vue from 'vue'
// import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
// vue.use(Buefy)

var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!"
  }
});


var params_obj1 = {
  title: "Objective 1",
  subtitle: "Submit form directly to HS API",
  url: "https://api.hsforms.com/submissions/v3/integration/submit/21334118/876e460d-12e3-4430-b61a-98e9bc54c56f"
};

var params_obj2 = {
  title: "Objective 2",
  subtitle: "Submit form via Expressjs API",
  url: "http://localhost:3000/form/submissions"
};

var form_params = {
  title: "Start",
  subtitle: "",
  url: ""
};

// Wait until document is loaded
$(document).ready(function(){
  // On form submit action execute this code
  $("#form-submission").submit(function(event){
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

    var url = form_params.url;

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

    var url = "http://localhost:3000/form/submissions";

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
  console.log(tabName);
  if(tabName=="Objective1"){
    form_params = params_obj1;
  } else if (tabName=="Objective2"){
    form_params = params_obj2;
  } else {
    form_params = {};
  }
  document.getElementById(tabName).style.display = "block";
  // set current tab to active
  evt.currentTarget.className += " is-active";
}

// Reusable form
class ContactForm extends HTMLElement {
  constructor(){
    super();
    this.Title = "";
    this.SubTitle = "";
    this.innerHTML = `
      <form class="box" id="form-submission" method="post">
        <h1 class="title">${form_params.title}</h1>
        <h2 class="subtitle" id="form-subtitle"></h2>
        <div class="field">
          <label class="label">First Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Alex" name="firstname" id="firstname">
          </div>
        </div>
        <div class="field">
          <label class="label">Last Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Carpenter *required" name="lastname" id="lastname">
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" placeholder="alex@example.com  *required" name="email" id="email">
          </div>
        </div>
        <button class="button is-primary js-modal-trigger" id="submit" type="submit" data-target="modal-js-example">Submit</button>
      </form>
    `;
  }
}

class ResponseMessage extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
      <div id="submit-response" hidden>
        <article id="submit-message">
          <div class="message-header">
          </div>
          <div class="message-body">
          </div>
        </article>
      </div>
    `;
  }
}

class Other extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `

    `;
  }
}



customElements.define('contact-form', ContactForm);
customElements.define('response-message', ResponseMessage);
