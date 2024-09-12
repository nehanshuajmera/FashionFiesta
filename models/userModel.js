import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* User SignUp */
userSchema.statics.signup = async function (
  displayName,
  userName,
  email,
  password
) {
  if (!displayName || !userName || !email || !password) {
    throw new Error("All fields are required");
  }

  if (!validator.matches(userName, "^[a-z0-9_.-]{8,}$")) {
    throw new Error(
      "username must be at least 8 characters long and contain only letters, numbers, underscores, hyphens, and periods"
    );
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
    );
  }

  const userExists = await this.findOne({ userName });
  if (userExists) {
    throw new Error("User already exists");
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await this.create({
    displayName,
    userName,
    email,
    password: passwordHash,
  });

  return user;
};

/* User Login */
userSchema.statics.login = async function (usernameOrEmail, password) {
  if (!usernameOrEmail || !password) {
    throw new Error("Please fill in all the fields");
  }

  const user = await this.findOne({
    $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return user;
};

export const User = mongoose.model("User", userSchema);
