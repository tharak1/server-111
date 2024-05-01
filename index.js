const express = require("express");
const connectDB = require("./config/databaseConnection");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const path = require("path");


const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer);

let clients = {

}

io.on("connection", (socket) => {
    console.log("connetetd");
    console.log(socket.id, "has joined");
    socket.on("signin", (id) => {
        // console.log("sign in event");
        // console.log(id);
        clients[id] = socket;
        console.log(id);
      });
      socket.on("message", (msg) => {
        console.log(msg);
        let targetId = msg.targetId;
        if (clients[targetId]) clients[targetId].emit("message", msg);
      });
    //   socket.on('image', (imageData) => {
    //     // Process the received image data
    //     // For demonstration, let's save the image to a file
    //     console.log(imageData.targetId);
    // });
  });

const port = process.env.PORT || 3000
connectDB();
app.use(cors());


app.use(express.json());

app.use("/api/user",require("./routes/userRoutes"));
app.use("/api/userdata",require("./routes/userDataRoutes"));
app.use("/api/books",require("./routes/booksRoutes"));
app.use("/api/parent",require("./routes/parentRoutes"));
app.use("/api/attendance",require("./routes/attendanceRoutes"));
app.use("/api/performance",require("./routes/performanceRoutes"));
app.use("/api/buses",require("./routes/transportRoutes"));
app.use("/api/library",require("./routes/LibraryRoutes")),
app.use("/api/sendmessage",require("./routes/sendMessages"));
app.use("/api/semmarks",require("./routes/semMarksRoutes"));
app.use("/api/faculty/",require("./routes/facultyRoutes"));
app.use("/api/booksImage",require("./controllers/setimage"));
app.use("/api/circularpdf",require("./controllers/circulars"));
app.use("/api/timetable",require("./controllers/timeTableController"));
app.use("/api/prevQP",require("./controllers/prevQuestionPaperController"));
app.use("/api/certificates",require("./controllers/certificatesController"));
app.use("/api/updates",require("./controllers/updatesController"));

app.use("/api/attendanceHistory",require("./routes/attendanceHistoryRoutes"));
app.use("/api/setTimetable",require("./routes/timeTableRoutes"));
app.use("/api/semesterdata",require("./routes/acedemicsRoutes"));
app.use("/api/liveloction",require("./routes/locationRoutes"));
app.use("/api/midmarks",require("./routes/mid_marks_routes"));
// app.use('/profile', express.static('./upload/images'));
app.use('/upload',express.static('./upload'));
app.use('/downloadAttendance',express.static('./created'));


app.use("/api/hostels",require("./hostels/routes/hostelsRoutes"));


// app.use('/booksPdf',express.static('./upload/booksPdf'));







httpServer.listen(port,"0.0.0.0",()=>{
    console.log("server is live at ",port);  
});