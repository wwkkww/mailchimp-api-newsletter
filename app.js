const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
//bodyParser parse http request, urlencoded allow access to formdata
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/failure", (req, res)=> {
    res.redirect("/");
})

app.post("/", (req, res) => {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    // console.log(req.body)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const options = {
        url: "https://us20.api.mailchimp.com/3.0/lists/53660bca92",
        method: "POST",
        headers: {
            "Authorization": "whatever c74adaa3e9a1c96deaf34bd136bdc4f9-us20"
        },
        body: jsonData
    }

    request(options, function (error, response, body) {
        if (error) {
            res.sendFile(__dirname + "/failure.html")
            // res.send("Error signing up, please try again!")
        } else {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html")
                // res.send("Successfully subscribed")
            } else {
                // res.send("Error, please try again!")
                res.sendFile(__dirname + "/failure.html")

            }
        }
    })
})

// c74adaa3e9a1c96deaf34bd136bdc4f9-us20

// 53660bca92

app.listen(3000, () => {
    console.log("Server started at port 3000")
})