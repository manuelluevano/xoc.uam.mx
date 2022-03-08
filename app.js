const { json, append } = require("express/lib/response");
const res = require("express/lib/response");
const mysql = require("mysql");
const express = require("express");
var request = require("request");

// DB
var connexion = mysql.createConnection({
  host: "148.206.96.43",
  user: "desarrollo",
  password: "Abcd1234",
  database: "vlk_uamnew21",
});
// PORT
const app = express();
app.listen("3000", () => {
  console.log("Server starded on port 3000");
});

// CONNECT
connexion.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MYSQL CONNECTED");
});

function call() {
  var sql = "CALL usp_SincronizateEventsToWebService";
  connexion.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    function readStatus() {
      var sql =
        "SELECT event_id, post_id, event_parent, event_slug, event_owner, event_status, event_name,event_start_date,event_end_date,event_start_time,event_end_time,event_all_day,event_start,event_end,event_timezone,post_content,event_rsvp,event_rsvp_date,event_rsvp_time,event_rsvp_spaces,event_spaces,event_private,location_id,event_location_type,recurrence_id,event_date_created,event_date_modified,recurrence,recurrence_interval,recurrence_freq,recurrence_byday,recurrence_byweekno,recurrence_days,recurrence_rsvp_days,blog_id,group_id,event_language,event_translation,statusid,creationdate,sincronizatedate,result FROM vlkuam_em_events_clone where statusid = 1";

      connexion.query(sql, function (err, result) {
        if (err) throw err;
        result.forEach(function (row) {
          console.log(JSON.stringify(row));
          var eventID = row.event_id;
          console.log(row.event_id);
          $json = JSON.stringify(row);

          tokenSesion = "P01NzBDRDNDRTgtMUU2MC00OEQxLUIxNjAtQUQ4QUY4MTlEM0E3";

          var options = {
            method: "POST",
            url: "http://70.35.199.154/XOCUAMAPI/Events/SaveUpdateEvent",
            headers: {
              "Content-Type": "text/plain",
            },
            body: $json,
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            updateStatus(eventID);
          });
        });
      });
    }

    readStatus();

    function updateStatus($eventId) {
      var sql =
        "UPDATE vlkuam_em_events_clone set statusid = 2 where event_id = " +
        $eventId;

      console.log(sql);
      connexion.query(sql, function (err, result) {
        if (err) throw err;
      });
    }
  });
}

setInterval(call, 15000);
