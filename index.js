//First commit to my Integrating With HubSpot I: Foundations practicum repository.

const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
    try {
        // Fetch your CRM records here
        // This is a placeholder - replace with your actual API call
        const response = await axios.get(
            `https://api.hubapi.com/crm/v3/objects/2-42773951?properties=pet_first_name,temperment,collar_coler,vaccine_status`,
            {
                headers: {
                    authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "content-type": "application/json"
                }
            }
        );

        const records = response.data.results;

        res.render('homepage', {
            title: 'CRM Records',
            records: records.map(r => ({
                properties: {
                    name: r.properties.pet_first_name,
                    temperment: r.properties.temperment,
                    collar_coler: r.properties.collar_coler,
                    vaccine_status: r.properties.vaccine_status

                }
            }))
        });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.render('homepage', {
            title: 'CRM Records',
            records: [],
            error: 'Failed to fetch records'
        });
    }
    return
})
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/update-cobj", async (req, res) => {
    res.render('updates.pug', {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
    })
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/update-cobj", async (req, res) => {

    const { name, temperment, collar_coler, vaccine_status } = req.body
    try {
        await axios.post(
            `https://api.hubapi.com/crm/v3/objects/2-42773951`,
            {
                associations: [],
                properties: {
                    pet_first_name: name,
                    temperment,
                    collar_coler,
                    vaccine_status
                }
            },
            {
                headers: {
                    authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "content-type": "application/json"
                }
            }
        )
    } catch (e) {
        console.error(e)

        //res.status(500).send("Failure in POST /update-cobj")
    }

    res.redirect("/")
    return
})

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));