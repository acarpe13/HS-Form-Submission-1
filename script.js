//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot

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

var app = new Vue({
  el: '#app',
  data: {
    forms: ['Objective1', 'Objective2'],
    form_params1: params_obj1,
    form_params2: params_obj2,
    form_data: {
      firstname: "",
      lastname: "",
      email: ""
    },
    last_response: {},
    response_data: {
       status: "",
       statusCode: 666,
       message: {},
       class: ""
    },
    responseActive: false,
    responseDuration: 2
  },
  methods: {
    send(form) {
      var url = form.url;
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
            // $(".message-header").text("Success");
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
        app.responseActive = true;
        // setTimeout(() => app.responseActive = false, 3 * 1000)
      })
    },
    sending() {
    }
  }
})
