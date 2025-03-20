const scheduleDb = require('../ScheduleDb');
const postDb = require('../PostsDb')
const scheduler = require('node-schedule');
const mongoose = require('mongoose');

async function eventTrigger(postId) {
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const makePostActive = await postDb.updateOne(
                { PostId: postId },
                { $set: { Status: "active" } },
                { session }
            );

            if (makePostActive.matchedCount === 0) {
                console.log("Post not found, exiting...");
                await session.abortTransaction();
                session.endSession();
                return false;
            }

            const removeCompletedSchedule = await scheduleDb.deleteOne(
                { PostId: postId },
                { session }
            );

            if (removeCompletedSchedule.deletedCount === 0) {
                console.log("Schedule not found, exiting...");
                await session.abortTransaction();
                session.endSession();
                return false; 
            }

            // Commit transaction if both updates succeed
            await session.commitTransaction();  
            session.endSession();

            console.log("Post activated and schedule deleted successfully");  
            return true;
        } catch (error) {
            console.log("Error in jobScheduler eventTrigger function:", error);

            await session.abortTransaction();
            session.endSession();

            if (attempt < maxRetries - 1) {
                const backoffTime = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, backoffTime));
            } else {
                console.log("Max retries reached, giving up...");
                return false;
            }

            attempt++;
        }
    }
}






const jobScheduler = async (postId, scheduleTime, jUserId) => {
    try {
        if (!postId || !scheduleTime || !jUserId) {
            console.log("Invalid input for scheduling job");
            return false;
        }

        const job = scheduler.scheduleJob(scheduleTime, async () => {
            eventTrigger(postId);
        });

        if (!job) {
            console.log("Failed to schedule job");
            return false;
        }

        

        const pushInScheduleDb = await scheduleDb.create({
            PostId: postId,
            UserId: jUserId,
            ScheduleTime: scheduleTime 
        });

        if (!pushInScheduleDb) {
            console.log("Failed to push in scheduleDb");
            return false;
        }
        console.log("Scheduled successfully");
        return true;
    } catch (error) {
        console.log("Error in scheduling job:", error);
        return false;
    }
};

module.exports = jobScheduler;