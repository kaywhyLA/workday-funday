// set the date at the top of the page
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do"));
// tasks object to store in localStorage.
var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

// add tasks to localStorage
var setTasks = function() {
    /* add tasks to localStorage */
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// load the tasks from localStorage and create tasks in the right row
var getTasks = function() {
    // get the tasks from localStorage
    /* load the tasks from localStorage and create tasks in the right row */

    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        // for each key/value pair in tasks, create a task
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    // make sure the past/current/future time is reflected
    auditTasks()
}

// create a task in the row that corresponds to the specified hour
var createTask = function(taskText, hourDiv) {
    /* create a task in the row that corresponds to the specified hour */

    var taskDiv = hourDiv.find(".task");
    // create the task element
    var taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}

// task click handler
var auditTasks = function() {
    /* update the background of each row based on the time of day */

    var currentHour = moment().hour();
    $(".task-info").each(function() {
        var elementHour = parseInt($(this).attr("id"));

        // handle past, present, and future
        if (elementHour < currentHour) {
            $(this).removeClass(["present", "future"]).addClass("past");
        } else if (elementHour === currentHour) {
            $(this).removeClass(["past", "future"]).addClass("present");
        } else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextarea = function(textareaElement) {
    /* replaces the provided textarea element with a p element and persists the data in localStorage */

    // get the necessary elements
    var taskInfo = textareaElement.closest(".task-info");
    var textArea = taskInfo.find("textarea");

    // get the time and task
    var time = taskInfo.attr("id");
    var text = textArea.val().trim();

    // persist the data
    tasks[time] = [text]; // setting to a one item list since there's only one task for now
    setTasks();

    // replace the textarea element with a p element
    createTask(text, taskInfo);
}

/* CLICK HANDLERS */

// tasks
$(".task").click(function() {

    // save the other tasks if they've already been clicked
    $("textarea").each(function() {
        // get the necessary elements
        var taskInfo = $(this).closest(".task-info");
        var textArea = taskInfo.find("textarea");
        // get the time
        var time = taskInfo.attr("id");
        // get the task text
        var text = textArea.val().trim();
        // persist the data if there is any
        if (text) {
            // add the task to tasks object
            tasks[time] = [text]; // setting to a one item list since there's only one task for now
            // persist tasks
            setTasks();
        };
        // replace the textarea element with a p element
        createTask(text, taskInfo);
        replaceTextarea($(this));
    })

    // convert to a textarea element if the time hasn't passed
    var time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {
        // get the current text value

        // create a textInput element that includes the current task
        var text = $(this).text();
        // create a textInput element
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        // add the textInput element to the parent div
        $(this).html(textInput);
        // put it into focus
        textInput.trigger("focus");
    }
})

// save button click handler
$(".saveBtn").click(function() {
    // get the necessary elements
    var taskInfo = $(this).closest(".task-info");
    var textArea = taskInfo.find("textarea");
    // get the time
    var time = taskInfo.attr("id");
    // get the task text
    var text = textArea.val().trim();
    // persist the data if there is any
    if (text) {
        // add the task to tasks object
        tasks[time] = [text]; // setting to a one item list since there's only one task for now
        // persist tasks
        setTasks();
    };
    // replace the textarea element with a p element
    createTask(text, taskInfo);
    replaceTextarea($(this));
})

// update the background of each row based on the time of day
var auditTasks = function() {
    // get the current hour
    var currentHour = moment().hour();
    // update tasks based on their time
    $(".task-info").each(function() {
        // get the hour of this row and convert it to an int for comparison
        var elementHour = parseInt($(this).attr("id"));
        // handle hours that have passed
        if (elementHour < currentHour) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        // handle the current hour
        else if (elementHour === currentHour) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        // handle the future
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};
getTasks();

// update the task backgrounds on the hour
timeToHour = (3600000) - today.milliseconds(); // check how much time is left until the next hour
// delay the audit until the top of that hour
// update task backgrounds on the hour
timeToHour = 3600000 - today.milliseconds(); // check how much time is left until the next hour
setTimeout(function() {
    // then audit at every hour after that
    setInterval(auditTasks, 3600000)
}, timeToHour);
// audit every hour after that 

// get the tasks from localStorage on load.
getTasks();