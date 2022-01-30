//add your code here to submit the form
// 1. Listen for the form submission event
// 2. Grab the contents of the fields
// 3. Send a POST request to the Forms endpoint to submit the form data to HubSpot
// Script to grab HS cookie

// const express_url = "http://localhost:3000/form/submissions"
const express_url = "https://hs-form-submission-objective-2.acarpe13.repl.co"

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
  subtitle: "Submits form directly to HS API",
  url: "https://api.hsforms.com/submissions/v3/integration/submit/21334118/876e460d-12e3-4430-b61a-98e9bc54c56f"
  // url: "https://webhook.site/d31b760b-650c-4dc9-a42a-e506013da95f"
};

var params_obj2 = {
  title: "Objective 2",
  subtitle: "Submits form via Expressjs API",
  url: express_url + "/form/submissions"
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
    responseDuration: 2,
    // Contact List Data
    lists: {}
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
        ],
        "context": {}
      };
      // If utk token present push it to context array
      // This prevents errors when privacy settings are active
      if(hubspotutk != ""){
        data.context = {
          "hutk": hubspotutk, // include this parameter and set it to the hubspotutk cookie value to enable cookie tracking on your submission
          "pageUri": "https://hs-form-submission-1.acarpe13.repl.co/",
          "pageName": "Technical Assessment"
        };
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
    },
    fetchLists() {
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.open("GET", express_url + "/contactlists");
      xhr.onload = function() {
        self.lists = JSON.parse(xhr.responseText);
        for(var list of self.lists) {
          var id = list.listId;
          // self.fetchList(list);
        }
      };
      xhr.send();
    }
  },
  created: function() {
    this.fetchLists()
    // this.fetchList(),
  },
})

//Componenet to display information about contact lists
Vue.component('contact-list', {
  props: ['list'],
  data: function () {
    return {

      columns: [
        {
            field: 'vid',
            label: 'ID',
        },
        {
            field: 'addedAt',
            label: 'Name'
        }
      ]
    }
  },
  template: `
  <nav class="panel">
    <p class="panel-heading">
      {{list.name}}
    </p>

    <b-tabs class="is-small" type="is-toggle">
      <b-tab-item label="Table">
        <table-component
          v-bind:list="list">
        ></table-component>
      </b-tab-item>
      <b-tab-item label="Details" class="panel-block">
        <section>
          <a class="panel-block is-active">
            List Id: {{list.listId}}
          </a>
          <a class="panel-block is-active">
            Contact Count: {{list.metaData.size}}
          </a>
          <a class="panel-block">
            List Type: {{list.listType}}
          </a>
        </section>
      </b-tab-item>
    </b-tabs>
  </nav>
  `
})

//Componenet to display table of form submissions
Vue.component('table-component', {
  props: ['list'],
  data: function () {
    return {
      contacts: [],
      columns: [
        {
            field: 'properties.firstname.value',
            label: 'First Name',
        },
        {
            field: 'properties.lastname.value',
            label: 'Last Name',
        },
        {
            field: 'properties.email.value',
            label: 'Email',
        },
        {
            field: 'properties.lifecyclestage.value',
            label: 'LifeCycleStage',
        },
        {
            field: 'properties.hs_marketable_reason_id.value',
            label: 'Original source id'
        }
      ]
    }
  },
  methods: {
    fetchList() {
      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", express_url + "/contactlist/" + self.list.listId);
      xhr.onload = function() {
        self.contacts = JSON.parse(xhr.responseText);
        console.log(self.contacts)
      };
      xhr.send();
    }
  },
  created () {
    this.fetchList()
  },
  template: `
        <div>
          <b-table
            :data="contacts"
            :columns="columns">
          </b-table>
        </div>
  `
})
