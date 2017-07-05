        var CLIENT_ID;
        var sheetID;
        var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
        var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

        var authorizeButton;
        var signoutButton;

        var OnInitFunction;
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          OnInitFunction();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */

        function initSheetInterface(client_id, sheet_id, callback) {
            body = document.getElementsByTagName("body")[0];
            attachment = '  <button id="authorize-button" style="display: block;">Authorize</button> \
                            <button id="signout-button" style="display: none;">Sign Out</button>';
            body.innerHTML = body.innerHTML + attachment;
            CLIENT_ID = client_id;
            sheetID = sheet_id;

            OnInitFunction = callback;

            authorizeButton = document.getElementById('authorize-button');
            signoutButton = document.getElementById('signout-button');

            console.log("Initialized Sheet Interface");

            handleClientLoad();


        }

        function initSheetInterfaceWithoutDisplayedButtons(client_id, sheet_id, callback) {
            body = document.getElementsByTagName("body")[0];
            attachment = '  <a id="authorize-button" style="display: block;" hidden></a> \
                            <a id="signout-button" style="display: none;" hidden></a>';
            body.innerHTML = body.innerHTML + attachment;
            CLIENT_ID = client_id;
            sheetID = sheet_id;

            OnInitFunction = callback;

            authorizeButton = document.getElementById('authorize-button');
            signoutButton = document.getElementById('signout-button');

            console.log("Initialized Sheet Interface without Displayed Buttons");

            handleClientLoad()

        }

        function setRow(range, value) {
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: sheetID,
                "range": range,
                "valueInputOption": "USER_ENTERED",
                "majorDimension": "ROWS",
                "values": [
                    value
                ]
            }).then(function(response) {
                console.log(response);
            });
        }

        function setColumn(range, value) {
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: sheetID,
                "range": range,
                "valueInputOption": "USER_ENTERED",
                "majorDimension": "COLUMNS",
                "values": [
                    value
                ]
            }).then(function(response) {
                console.log(response);
            });
        }

        function get(range, returnValue) {
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetID,
                "range": range
            }).then(function(response) {
                if (response.result.values.length > 0) {
                    rows = response.result.values;
                    returnValue(rows);
                }
            });
        }

