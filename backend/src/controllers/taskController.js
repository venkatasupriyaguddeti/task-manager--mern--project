import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try { //forcing userId to be current user for normal users
    const task = { ...req.body };
    if (req.user.role !== "admin") {
      task.userId = req.user.userId; //normal user
    } else {
      if (!task.userId) task.userId = req.user.userId;
    }
    const newTask = await Task.create(task);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    //Pagination /tasks?page=2&limit=10,, /tasks
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "10", 10), 1),
      100,
    );
    const skip = (page - 1) * limit;

    //Filtering
    const filter = {};
    if (req.user.role !== "admin") filter.userId = req.user.userId;
    else {
      if (req.query.userId) filter.userId = req.query.userId;
    }
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    //Sorting
    const allowedSortFields = new Set(["createdAt", "dueDate", "priority"]);
    const sortBy = allowedSortFields.has(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    const order = (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;
    const sort = { [sortBy]: order }; //{createdAt: 1}

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);
    //metadata-> pages, next, previous
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        sortBy,
        order: order === 1 ? "asc" : "desc",
        filtersApplied: filter,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    let query = Task.findById(req.params.id);

    // Only admin gets populated user info
    if (req.user.role === "admin") {
      query = query.populate("userId", "name email");
    }

    const task = await query;

    if (!task) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // Non-admin cannot change ownership
    if (req.user.role !== "admin") {
      delete updates.userId;
    }

    let query = Task.findByIdAndUpdate(req.params.id, updates, { new: true });

    // If admin → populate user info
    if (req.user.role === "admin") {
      query = query.populate("userId", "name email");
    }

    const updatedTask = await query;

    if (!updatedTask) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
