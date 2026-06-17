const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE =
path.join(
__dirname,
"data",
"applications.json"
);

/* -------------------------
HELPERS
------------------------- */

function getApplications(){

    return fs.readJsonSync(DATA_FILE);

}

function saveApplications(data){

    fs.writeJsonSync(
        DATA_FILE,
        data,
        {
            spaces:2
        }
    );

}

/* -------------------------
GET ALL APPLICATIONS
------------------------- */

app.get(
"/api/applications",
(req,res)=>{

    const applications =
    getApplications();

    const company =
    req.query.company;

    if(company){

        const filtered =
        applications.filter(app=>

            app.company
            .toLowerCase()
            .includes(
                company.toLowerCase()
            )

        );

        return res.json(filtered);
    }

    res.json(applications);

});

/* -------------------------
POST APPLICATION
------------------------- */

app.post(
"/api/applications",
(req,res)=>{

    const {
        company,
        role,
        status
    } = req.body;

    if(
        !company ||
        !role ||
        !status
    ){

        return res
        .status(400)
        .json({

            message:
            "All fields are required"

        });
    }

    const applications =
    getApplications();

    const newApplication = {

        id:Date.now(),

        company,

        role,

        status,

        date:
        new Date()
        .toLocaleDateString()

    };

    applications.push(
        newApplication
    );

    saveApplications(
        applications
    );

    res
    .status(201)
    .json({

        message:
        "Application Added",

        data:
        newApplication

    });

});

/* -------------------------
UPDATE STATUS
------------------------- */

app.put(
"/api/applications/:id",
(req,res)=>{

    const id =
    Number(
        req.params.id
    );

    const status =
    req.body.status;

    const applications =
    getApplications();

    const application =
    applications.find(
        app =>
        app.id === id
    );

    if(!application){

        return res
        .status(404)
        .json({

            message:
            "Application Not Found"

        });
    }

    application.status =
    status;

    saveApplications(
        applications
    );

    res.json({

        message:
        "Status Updated"

    });

});

/* -------------------------
DELETE APPLICATION
------------------------- */

app.delete(
"/api/applications/:id",
(req,res)=>{

    const id =
    Number(
        req.params.id
    );

    const applications =
    getApplications();

    const updated =
    applications.filter(
        app =>
        app.id !== id
    );

    saveApplications(
        updated
    );

    res.json({

        message:
        "Application Deleted"

    });

});

/* -------------------------
STATS
------------------------- */

app.get(
"/api/stats",
(req,res)=>{

    const applications =
    getApplications();

    const stats = {

        total:
        applications.length,

        applied:
        applications.filter(
            a =>
            a.status ===
            "Applied"
        ).length,

        interview:
        applications.filter(
            a =>
            a.status ===
            "Interview"
        ).length,

        selected:
        applications.filter(
            a =>
            a.status ===
            "Selected"
        ).length,

        rejected:
        applications.filter(
            a =>
            a.status ===
            "Rejected"
        ).length

    };

    res.json(stats);

});

/* -------------------------
404 API
------------------------- */

app.use((req,res)=>{

    res.status(404).json({

        message:
        "API Route Not Found"

    });

});

/* -------------------------
SERVER
------------------------- */

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log(

        `Server Running On:
        http://localhost:${PORT}`

    );

});