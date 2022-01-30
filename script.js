//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot
// Script to grab HS cookie

// const express_url = "http://localhost:3000/form/submissions"
const express_url = "https://hs-form-submission-objective-2.acarpe13.repl.co/form/submissions"

// Function to fetch hubspotutk cookie
// Documentation mentions _hsq cookie but the array was empty. This could be either a new unfinished feature or mistake in docs
function getCookie(cname) {
  let name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Params for both forms
// may change to let b/e serve form param data as array
// This would support principles that the f/e should be dumb and all import data should be passed from the b/e
var params_obj1 = {
  title: "Objective 1",
  subtitle: "Submit form directly to HS API",
  url: "https://api.hsforms.com/submissions/v3/integration/submit/21334118/876e460d-12e3-4430-b61a-98e9bc54c56f"
  // url: "https://webhook.site/d31b760b-650c-4dc9-a42a-e506013da95f"
};

var params_obj2 = {
  title: "Objective 2",
  subtitle: "Submit form via Expressjs API",
  url: express_url
};

// instance of vue app
var app = new Vue({
  el: '#app',
  data: {
    form_params1: params_obj1,
    form_params2: params_obj2,
    // Placeholder for form data
    // Value bindings are shared between forms for ease of data entry
    form_data: {
      firstname: '',
      lastname: '',
      email: ''
    },
    // Var to hold response from hs/express api
    response_data: {
       status: '',
       statusCode: 0,
       message: '',
       class: ''
    },
    responseActive: false,
    responseDuration: 2
  },
  methods: {
    // function to submit form
    send(form) {
      var url = form.url;
      // fetch utk token
      var hubspotutk = getCookie("hubspotutk");
      // api body data
      var data = {
        "fields": [
          {
            "objectTypeId": "0-1",
            "name": "email",
            "value": app.form_data.email
          },
          {
            "objectTypeId": "0-1",
            "name": "firstname",
            "value": app.form_data.firstname
          },
          {
            "objectTypeId": "0-1",
            "name": "lastname",
            "value": app.form_data.lastname
          }
        ]
      };
      // if utk token present push it to data fields array
      // This prevents errors when privacy settings are active
      if(hubspotutk != ""){
        data.fields.push({
          hutk: hubspotutk, // include this parameter and set it to the hubspotutk cookie value to enable cookie tracking on your submission
          pageUri: "https://hs-form-submission-1.acarpe13.repl.co/",
          pageName: "Technical Assessment"
        });
      }

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
            app.response_data.statusCode = 200;
            app.response_data.status = "Success";
            app.response_data.message = response.inlineMessage;
            app.response_data.class = "is-success";
          },
          400: function(response) {
            var res = response.responseJSON;
            app.response_data.statusCode = 400;
            app.response_data.status = "Bad Request";
            app.response_data.message = `Error Type: ${res.errors[0].errorType}<br>
              Error Message: ${res.errors[0].message}<br>
              Hubspot Correlation Id: ${res.correlationId}<br>
            `;
            app.response_data.class = "is-danger";
          },
          403: function(response) {
            app.response_data.statusCode = 403;
            app.response_data.status = "Unauthorized";
            app.response_data.message = "response.responseText"
            app.response_data.class = "is-danger";
          },
          404: function(response) {
            app.response_data.statusCode = 404;
            app.response_data.status = "Not Found";
            app.response_data.message = "response.responseText"
            app.response_data.class = "is-danger";
          },
        },
      };

      // Loading spinner
      const loadingComponent = this.$buefy.loading.open({
          container: this.$refs.form.$el
      })
      setTimeout(() => loadingComponent.close(), 5 * 1000)
      // Execute POST request
      $.ajax(settings).always(function(){
        loadingComponent.close();
        // trigger response message popup
        app.responseActive = true;
      })
    }
  }
})
