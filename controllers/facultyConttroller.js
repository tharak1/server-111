const asyncHandler = require("express-async-handler");
const Faculty = require("../models/facultyModel");
const jwt=require("jsonwebtoken");
const timeTablesModel = require("../models/TTM");
const facultyTimeTableModel = require("../models/facultyTimeTableModel");
const { request } = require("http");



const createFaculty = asyncHandler(async(req,res)=>{
    const user = await Faculty.create(req.body);
    res.status(200).json(user);
});


const loginFaculty = asyncHandler(async (req,res) =>{
    const {UserName,Password} = req.body;
    if(!UserName || !Password){
        res.status(400).json({error:"all fields are manditory"});
    }
    const user = await Faculty.findOne({UserName});    
    if(user && (user.Password===Password)){
            const accessToken = jwt.sign(
                {
                    user : {
                        id : user.FacultyId,
                    }
                },
                process.env.ACCESS_TOKEN_SECERT,
            );
            res.json({token:accessToken});
    }else{
        res.status(400).json({error:"user not found or roolno or password dont match"});
    }
    
});

const getFacultyData = asyncHandler(async(req,res)=>{
    const currentUser = await Faculty.findOne({ FacultyId: req.user.id} );
    res.json(currentUser);
});

const getFacultyByDepartment = asyncHandler(async(req,res)=>{

    let filter = {};
    if(req.query){ 
        filter = {FacultyDepartment:req.query.facultyDepartment};
    }
    const faculties = await Faculty.find(filter);
    res.json(faculties);
});


const getFacultyByDepartmentShort = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){ 
        filter = {FacultyDepartment:req.query.facultyDepartment};
    }
    const faculties = await Faculty.find(filter,{FacultyId:1,FacultyName:1,FacultyDepartment:1,_id:0});
    res.json(faculties);
})


const getFacultyById = asyncHandler(async(req,res)=>{
    let filter = {};
    if(req.query){ 
        filter = {FacultyId:req.body.Id};
    }
    const faculty = await Faculty.findOne(filter);
    res.status(200).json(faculty);
});

const updateFaculty = asyncHandler(async (req, res) => {
    const facultyData = req.body;
    const updatedFaculty = await Faculty.findOneAndUpdate({ FacultyId: req.body.FacultyId }, facultyData, { new: true });
    if (!updatedFaculty) {
        return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(updatedFaculty);
});




const getFacultyTimeTable = asyncHandler(async(req,res)=>{
    const currentUser = await facultyTimeTableModel.findOne({ FacultyId: req.user.id} );
    // console.log("hii from get faculty timetable");
    res.json(currentUser);
})





// async function assignDataToFaculty() {
//     const AllFaculty = await Faculty.find();
//     for(const faculty of AllFaculty){
//         for(const classes of faculty.Classes){
//             const CurrentClassTimeTable = await timeTablesModel.findOne({Department: classes.Department, Regulation: classes.Regulation, Section: classes.Section});
//             if(CurrentClassTimeTable){
//                 const transformedTimetable = CurrentClassTimeTable.TimeTable.map((week) => {
//                     return {
//                         Day: week.Day,
//                         Periods: week.Periods.filter(period => {
//                             const lecturers = period.LecturerId.split(",");
//                             return lecturers.includes(faculty.FacultyId);
//                         }).map(period => ({
//                             StartTime: period.StartTime,
//                             EndTime: period.EndTime,
//                             ClassType: period.ClassType,
//                             Section: classes.Section,
//                             Department: classes.Department,
//                             Year: classes.Year,
//                             Regulation: classes.Regulation,
//                             SubjectName: period.SubjectName,
//                             Subjectcode: period.Subjectcode,
//                         }))
//                     };
//                 });

//                 const existingFacultyTimeTable = await facultyTimeTableModel.findOne({
//                     FacultyId: faculty.FacultyId,
//                 });

//                 if (existingFacultyTimeTable) {
//                     const existingPeriods = existingFacultyTimeTable.TimeTable.reduce((existing, week) => {
//                         existing[week.Day] = existing[week.Day] || [];
//                         existing[week.Day].push(...week.Periods);
//                         return existing;
//                     }, {});

//                     const newPeriods = transformedTimetable.reduce((newPeriods, week) => {
//                         newPeriods[week.Day] = newPeriods[week.Day] || [];
//                         newPeriods[week.Day].push(...week.Periods);
//                         return newPeriods;
//                     }, {});

//                     const updatedTimetable = Object.entries(existingPeriods).map(([day, periods]) => {
//                         const combinedPeriods = [...periods, ...newPeriods[day] || []];
//                         // Filter out duplicates based on start time and end time
//                         const uniquePeriods = combinedPeriods.filter((period, index, self) =>
//                             index === self.findIndex((p) => (
//                                 p.StartTime === period.StartTime && p.EndTime === period.EndTime
//                             ))
//                         );
//                         return { Day: day, Periods: uniquePeriods };
//                     });

//                     existingFacultyTimeTable.TimeTable = updatedTimetable;
//                     await existingFacultyTimeTable.save();
//                     console.log(`Updated timetable for Faculty ${existingFacultyTimeTable._id}`);
//                 } else {
//                     const FacultyTimeTable = await facultyTimeTableModel.create({
//                         FacultyId: faculty.FacultyId,
//                         FacultyName: faculty.FacultyName,
//                         FacultyDepartment: faculty.FacultyDepartment,
//                         TimeTable: transformedTimetable,
//                     });
//                     console.log(`Created new timetable for Faculty ${FacultyTimeTable._id}`);
//                 }
//             }
//         }
//     }
// }



async function assignDataToFaculty(req, res) {
    try {
        const AllFaculty = await Faculty.find();
        let updatedFaculties = 0;
        let createdFaculties = 0;

        for(const faculty of AllFaculty){
            for(const classes of faculty.Classes){
                const CurrentClassTimeTable = await timeTablesModel.findOne({
                    Department: classes.Department,
                    Regulation: classes.Regulation,
                    Section: classes.Section
                });

                if(CurrentClassTimeTable){
                    const transformedTimetable = CurrentClassTimeTable.TimeTable.map((week) => {
                        return {
                            Day: week.Day,
                            Periods: week.Periods.filter(period => {
                                const lecturers = period.LecturerId.split(",");
                                return lecturers.includes(faculty.FacultyId);
                            }).map(period => ({
                                StartTime: period.StartTime,
                                EndTime: period.EndTime,
                                ClassType: period.ClassType,
                                Section: classes.Section,
                                Department: classes.Department,
                                Year: classes.Year,
                                Regulation: classes.Regulation,
                                SubjectName: period.SubjectName,
                                Subjectcode: period.Subjectcode,
                            }))
                        };
                    });

                    const existingFacultyTimeTable = await facultyTimeTableModel.findOne({
                        FacultyId: faculty.FacultyId,
                    });

                    if (existingFacultyTimeTable) {
                        const existingPeriods = existingFacultyTimeTable.TimeTable.reduce((existing, week) => {
                            existing[week.Day] = existing[week.Day] || [];
                            existing[week.Day].push(...week.Periods);
                            return existing;
                        }, {});

                        const newPeriods = transformedTimetable.reduce((newPeriods, week) => {
                            newPeriods[week.Day] = newPeriods[week.Day] || [];
                            newPeriods[week.Day].push(...week.Periods);
                            return newPeriods;
                        }, {});

                        const updatedTimetable = Object.entries(existingPeriods).map(([day, periods]) => {
                            const combinedPeriods = [...periods, ...newPeriods[day] || []];
                            const uniquePeriods = combinedPeriods.filter((period, index, self) =>
                                index === self.findIndex((p) => (
                                    p.StartTime === period.StartTime && p.EndTime === period.EndTime
                                ))
                            );
                            return { Day: day, Periods: uniquePeriods };
                        });

                        existingFacultyTimeTable.TimeTable = updatedTimetable;
                        await existingFacultyTimeTable.save();
                        updatedFaculties++;
                        console.log(`Updated timetable for Faculty ${existingFacultyTimeTable._id}`);
                    } else {
                        const FacultyTimeTable = await facultyTimeTableModel.create({
                            FacultyId: faculty.FacultyId,
                            FacultyName: faculty.FacultyName,
                            FacultyDepartment: faculty.FacultyDepartment,
                            TimeTable: transformedTimetable,
                        });
                        createdFaculties++;
                        console.log(`Created new timetable for Faculty ${FacultyTimeTable._id}`);
                    }
                }
            }
        }

        res.json({
            message: 'Timetables assignment completed successfully',
            updatedFaculties,
            createdFaculties
        });

    } catch (error) {
        console.error('Error in assignDataToFaculty:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// assignDataToFaculty();


module.exports = {assignDataToFaculty,createFaculty,loginFaculty,getFacultyData,getFacultyByDepartment,getFacultyTimeTable,getFacultyByDepartmentShort,getFacultyById,updateFaculty};