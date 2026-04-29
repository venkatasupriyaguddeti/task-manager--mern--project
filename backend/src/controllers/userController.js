import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error("Email already registered");
      err.status = 400;
      throw err;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const { password: _, ...safeUser } = user.toObject();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "10", 10), 1),
      100,
    );
    const skip = (page - 1) * limit;

    //Filtering
    const filter = {};
    if (req.query.role)
      //users?role=admin
      filter.role = req.query.role;
    if (req.query.email)
      //users?email=huma@example.com
      filter.email = req.query.email;

    //Sorting
    const allowedSortFields = new Set(["createdAt", "name", "email", "role"]);
    //users?sortBy=name&order=ASC
    const sortBy = allowedSortFields.has(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    const order = (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;
    const sort = { [sortBy]: order }; //{createdAt: 1}

    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit).select("-password"),
      User.countDocuments(filter),
    ]);
    //metadata-> pages, next, previous
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
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

export const updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // If password is being updated → hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedUser) {
      const err = new Error("User Not Found");
      err.status = 404;
      throw err;
    }
    const { password: _, ...safeUser } = updatedUser.toObject();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      const err = new Error("User Not Found");
      err.status = 404;
      throw err;
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id: req.params.id },
    });
  } catch (err) {
    next(err);
  }
};
