const cron = require("node-cron");
const { getNotEndedTodo, setCronPassed } = require("./cron.query");
const { sendMail } = require("../mail/sendMail");

async function startCron() {
    cron.schedule("*/2 * * * *", async () => {
        const notEndedTodos = await getNotEndedTodo();

        await notEndedTodos.map((todo) => {
            if (todo.due_time !== null) {
                const now = new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" });
                const parisTime = new Date(now).getTime();
                const dueTime = new Date(todo.due_time).getTime();
                const timeDifference = dueTime - parisTime;
    
                if (timeDifference > 0 && timeDifference <= (60*60*1000)) {
                    setCronPassed(todo.id);
                    sendMail(
                        todo.email,
                        "Reminder to-do list",
                        "Hello, Remember that you have a to-do list that ends in less than an hour ! ("+todo.title+")"
                    );
                }
            }
        });
    });
}

module.exports = {
    startCron
}