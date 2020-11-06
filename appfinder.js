var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "mydb"
});

const express = require("express");
const app = express();
const url = require('url');

app.get("/", (req, res) => {
    writeSearch(req, res);
});

app.get("/schedule", (req, res) => {
    writeSearch(req, res);
});


port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server listening on" + port);
});

function writeSearch(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let query = ur.parse(req.url, true).query;
    let search = query.search ? query.search : "";
    let filter = query.filter ? query.filter : "";


    let html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <title> Spring 2021 CSE Class Find </title>
    </head>

    <body>
        <h1> Spring 2021 CSE Vlass Find </h1><br>
        <form method ="get" action ="/">
        <input type ="Text" name="search" value="">
        <b>in</b>
        <select name="filter">
            <option value="allFields">All Fields</option>
            <option value="courseName">Course Title</option>
            <option value="instructor">Instructor</option>
            <option value="day">Day</option>
            <option value="time">Time</option>
            </select>
            <input type="submit" value="Submit>
            <br>
            Example searched: 316, fodor, 2:30 PM, MW
        </form>
        <br><br>
        `;

    let sql = "SELECT * FROM clssched;";

    if (filter == "allFields")
        sql = `SELECT* FROM clssched
                    WHERE  Subject       LIKE '%` + search + `%' OR 
                       Course       LIKE '%` + search + `%' OR
                       CourseName       LIKE '%` + search + `%' OR
                       Component        LIKE '%` + search + `%' OR
                       Section       LIKE '%` + search + `%' OR
                       Days    LIKE '%` + search + `%' OR
                       StartTime  LIKE '%` + search + `%' OR
                       EndDate  LIKE '%` + search + `%' OR
                       Duration  LIKE '%` + search + `%' OR
                       InstructionMode  LIKE '%` + search + `%' OR
                       Building  LIKE '%` + search + `%' OR
                       Room  LIKE '%` + search + `%' OR
                       Instructor LIKE '%` + search + `%' OR
                       EnrollCap  LIKE '%` + search + `%' OR
                       WaitCap  LIKE '%` + search + `%' OR
                       CombDesc  LIKE '%` + search + `%' OR
                       CombEnrollCap  LIKE '%` + search + `%';`;
    else if (filter == "courseNum")
        sql = `SELECT * FROM clssched
                WHERE Course   LIKE '%` + search + `%';`;
    else if (filter == "courseName")
        sql = `SELECT * FROM clssched
                    WHERE CourseName   LIKE '%` + search + `%';`;

    else if (filter == "instructor")
        sql = `SELECT * FROM clssched
    WHERE Instructor   LIKE '%` + search + `%';`;
    else if (filter == "day")
        sql = `SELECT * FROM clssched
        WHERE Days   LIKE '%` + search + `%'
        ORDER BY StartTimeInternal;`;
    else if (filter == "time")
        sql = `SELECT * FROM clssched
            WHERE StartTime   LIKE '%` + search + `%' OR
            Endtime   LIKE '%` + search + `%';`;

    con.query(sql, function(err, result) {
        if(err) throw err;
        for (let item of result){
            html +=  `
            <button type="button" class="toggle"> CSE ` +item.Course + ` - ` +
            item.CourseName + ` - ` + item.Component + ` - Section ` + item.Section + `</button>
            <pre>
                Days: ` + item.Days + `
                Start Time: ` + item.StartTime + `
                End Time: ` + item.EndTime + `
                Start Date: ` + item.StartDate + `
                End Date: ` + item.EndDate + `
                Duration: ` + item.Duration + `
                Instruction Mode: ` + item.InstructionMode + `
                Building: ` + item.Building + `
                Room: ` + item.Room + `
                Instructor: ` + item.Instructor + `
                Enrollment Cap: ` + item.EnrollCap + `
                Wait Cap: ` + item.WaitCap + `
                Combined Description: ` + item.CombDesc + `
                Combind Enrollment Cap: ` + item.CombEnrollCap + `
                <button name="add" value="` + item.id + `"> Add Class </button></form></pre>`;
            
        }
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });

};

function writeSchedule(req,res){
    let query = url.parse(req.url, true).query;
    let addQuery = `INSERT INTO savedschedule SELECT * FROM clssched WHERE clssched.id="` +query.add + `";`

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title> Schedule </title>
        <style type = text/css>
        table, tr, th, td {
            border: 1px solid black;
            height: 50px;
            vetical-align: bottom;
            padding: 15px;
            text-algn: left;
        }
        </style>
}