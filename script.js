//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot

var params_obj1 = {
  title: "Objective 1",
  subtitle: "Submit form directly to HS API",
  url: "https://api.hsforms.com/submissions/v3/integration/submit/21334118/876e460d-12e3-4430-b61a-98e9bc54c56f"
  // url: "https://webhook.site/d31b760b-650c-4dc9-a42a-e506013da95f"
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

var app = new Vue({
  el: '#app',
  data: {
    forms: ['Objective1', 'Objective2'],
    message: 'Hello Vue!',
    form_params: form_params,
    form_params1: params_obj1,
    form_params2: params_obj2,
    form_data: {
      firstname: "",
      lastname: "",
      email: ""
    }
  },
  methods: {
    send(form,form_data) {
      var url = form.url;
      var data = {
        "fields": [
          {
            "objectTypeId": "0-1",
            "name": "email",
            "value": form_data.email
          },
          {
            "objectTypeId": "0-1",
            "name": "firstname",
            "value": form_data.firstname
          },
          {
            "objectTypeId": "0-1",
            "name": "lastname",
            "value": form_data.lastname
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

      // Loading spinner
      const loadingComponent = this.$buefy.loading.open({
          container: this.$refs.form.$el
      })
      setTimeout(() => loadingComponent.close(), 5 * 1000)

      // Execute POST request
      $.ajax(settings).always(function(){
        loadingComponent.close()
      })
    },
    sending() {
    }
  }
})
