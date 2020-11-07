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
    writeSchedule(req, res);
});


port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server listening on " + port);
});

function writeSearch(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let query = url.parse(req.url, true).query;
    let search = query.search ? query.search : "";
    let filter = query.filter ? query.filter : "";


    let html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <title> Spring 2021 CSE Class Find </title>
    </head>

    <body>
        <h1> Spring 2021 CSE Class Find </h1><br>
        <form method ="get" action ="/">
        <input type ="text" name="search" value="">
        <b>in</b>
        <select name="filter">
            <option value="allFields"> All Fields </option>
            <option value="courseName"> Course Title </option>
            <option value="courseNum"> Course Num </option>
            <option value="instructor"> Instructor </option>
            <option value="day"> Day </option>
            <option value="time"> Time</option>
        </select>
        <input type="submit" value="Submit">
        <br>
        Example searches: 316, fodor, 2:30 PM, MW
        </form>
        <br><br>
        `;

    let sql = "SELECT * FROM clssched;";

    if (filter == "allFields")
        sql = `SELECT* FROM clssched
                    WHERE  Subj       LIKE '%` + search + `%' OR 
                       Crs      LIKE '%` + search + `%' OR
                       Title       LIKE '%` + search + `%' OR
                       Cmp        LIKE '%` + search + `%' OR
                       Sctn       LIKE '%` + search + `%' OR
                       Days    LIKE '%` + search + `%' OR
                       StartTime  LIKE '%` + search + `%' OR
                       EndTime  LIKE '%` + search + `%' OR
                       Duration  LIKE '%` + search + `%' OR
                       InstructionMode  LIKE '%` + search + `%' OR
                       Building  LIKE '%` + search + `%' OR
                       Room  LIKE '%` + search + `%' OR
                       Instr LIKE '%` + search + `%' OR
                       EnrollCap  LIKE '%` + search + `%' OR
                       WaitCap  LIKE '%` + search + `%' OR
                       CmbDescr  LIKE '%` + search + `%' OR
                       CmbEnrlCap  LIKE '%` + search + `%';`;
    else if (filter == "courseNum")
        sql = `SELECT * FROM clssched
                WHERE Crs   LIKE '%` + search + `%';`;
    else if (filter == "courseName")
        sql = `SELECT * FROM clssched
                    WHERE Title   LIKE '%` + search + `%';`;

    else if (filter == "instructor")
        sql = `SELECT * FROM clssched
    WHERE Instr  LIKE '%` + search + `%';`;
    else if (filter == "day")
        sql = `SELECT * FROM clssched
        WHERE Days   LIKE '%` + search + `%'
        ORDER BY StartTimeInternal;`;
    else if (filter == "time")
        sql = `SELECT * FROM clssched
            WHERE StartTime   LIKE '%` + search + `%' OR
            EndTime   LIKE '%` + search + `%';`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        for (let item of result) {
            html += `
            <button type="button" class="toggle"> CSE ` + item.Crs + ` - ` +
                item.Title + ` - ` + item.Cmp + ` - Section ` + item.Sctn + `</button>
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
                Instructor: ` + item.Instr + `
                Enrollment Cap: ` + item.EnrollCap + `
                Wait Cap: ` + item.WaitCap + `
                Combined Description: ` + item.CmbDescr + `
                Combind Enrollment Cap: ` + item.CmbEnrlCap + `<form action="/schedule" method="get">
                <button name="add" value="` + item.id + `"> Add Class </button> </form> </pre>`;

        }
        res.write(html + "\n\n</body>\n</html>");
        res.end();
    });

};

function writeSchedule(req, res) {
    let query = url.parse(req.url, true).query;
    let addQuery = `INSERT INTO savedschedule SELECT * FROM clssched WHERE clssched.id="` + query.add + `";`

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title> Schedule </title>
        <style type = text/css>
        table, tr, th, td {
            border: 1px solid black;
            height: 50px;
            vertical-align: bottom;
            padding: 15px;
            text-align: left;
        }
        </style>
    </head>
    <body>
        <h1> Schedule </h1><br>
        <a href="/"><b> Return to Search</a>
        <br><br>

        <table>
            <tr>
                <th> Mon </th>
                <th> Tue </th>
                <th> Wed </th>
                <th> Thu </th>
                <th> Fri </th>
            </tr>
            <tr>
                <td> Mon </td>
                <td> Tue </td>
                <td> Wed </td>
                <td> Thu </td>
                <td> Fri </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    con.query(addQuery, function (err, result) {
        if (err) console.log(err);
        con.query(constructSQLDayCommand("M"), function (err, result) {
            if (err) throw err;
            html = html.replace("<td> Mon </td>", getDay(result, "MON"));
            con.query(constructSQLDayCommand("TU"), function (err, result) {
                if (err) throw err;
                html = html.replace("<td> Tue </td>", getDay(result, "TUE"));
                con.query(constructSQLDayCommand("W"), function (err, result) {
                    if (err) throw err;
                    html = html.replace("<td> Wed </td>", getDay(result, "WED"));
                    con.query(constructSQLDayCommand("TH"), function (err, result) {
                        if (err) throw err;
                        html = html.replace("<td> Thu </td>", getDay(result, "THU"));
                        con.query(constructSQLDayCommand("F"), function (err, result) {
                            if (err) throw err;
                            html = html.replace("<td> Fri </td>", getDay(result, "FRI"));
                            res.write(html + "\n\n</body>\n</html>");
                            res.end();
                        });
                    });
                });
            });
        });
    });

}

function getDay(SQLResult, tableHeader) {
    let retStr = "<td>";
    for (let item of SQLResult) {
        retStr += "\n  <b> " + item.StartTime + " - " +
            item.EndTime + "<br><br>" +
            item.Subj + " " +
            item.Crs + "-" +
            item.Sctn + " <br> <p> " +
            item.Title + "<br><br>" +
            item.Instr + "<br><br>" +
            "<br/><br/>";
    }
    return retStr + "</td>";

}

function constructSQLDayCommand(search) {
    var sql = `SELECT * FROM savedschedule 
    WHERE Days   LIKE  '%` + search + `%'
        ORDER BY StartTime;`;  //???StartTimeInternal
    return sql;
};