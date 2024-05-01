// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const asyncHandeler = require("express-async-handler");
const UserDetails = require("../models/userDetailsModel");
const attenn = require("../models/attendanceModel");
const cron = require('node-cron');

// const sendMessage = asyncHandeler(async(req,res)=>{
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// const {rollnumbers} = req.body;
// let arr = []
// for(let i=0;i<rollnumbers.length;i++){
//     const user = await UserDetails.findOne({rollno :rollnumbers[i]});  
//     await client.messages
//     .create({from: '+13604064403', body: `Your Ward ${user.name} of class ${user.clas} is absent today.\n Roll.no : ${user.rollno}`, to: '+917989833031'})
//     .then(message => res.send(message));  
// }
// });


const sendMessage = asyncHandeler(async (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const result = await attenn.find({ 'CurrentDay.MorningAttended': 0 }, { RollNo: 1, _id: 0 });

    const rollNumbers = result.map(item => item.RollNo);

    await Promise.all(
        rollNumbers.map(async (rollnumber) => {
        try {
          const user = await UserDetails.findOne({ RollNo: rollnumber },{'FatherName':1,'StudentName':1,'Department':1,'Section':1,'RollNo':1});
  
          if (user) {
            
            const message = await client.messages.create({
              from: '+13604064403',
              body: `\nDear parent, \n${user.FatherName},\nYour Ward ${user.StudentName} of class ${user.Department}-${user.Section} is absent today.\nRoll.no : ${user.RollNo}`,
              to: '+917989833031',
            }); 
          } else {
            
            console.error(`User details not found for roll number: ${rollnumber}`);
          }
        } catch (error) {
          console.error(`Error sending SMS for roll number ${rollnumber}: ${error.message}`);
        }
      })
    );
      console.log('SMS messages sent successfully');
    //res.status(200).json({ message: 'SMS messages sent successfully', sentMessages: arr });
  });
  

  cron.schedule('23 14 * * *',()=>{
    sendMessage();
  })

module.exports = {sendMessage};


