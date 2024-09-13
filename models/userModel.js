import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { decryptPassword } from "../decrypt.js";

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
  decryptedPassword // Decrypted version used for hashing
) {
  if (!displayName || !userName || !email || !decryptedPassword) {
    throw new Error("All fields are required");
  }

  if (!validator.matches(userName, "^[a-z0-9_.-]{8,}$")) {
    throw new Error(
      "Username must be at least 8 characters long and contain only letters, numbers, underscores, hyphens, and periods"
    );
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }

  // Validate password strength
  if (
    !validator.isStrongPassword(decryptedPassword, {
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

  // Check if user or email already exists
  const userExists = await this.findOne({ userName });
  if (userExists) {
    throw new Error("User already exists");
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error("Email already exists");
  }

  // Hash the decrypted password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(decryptedPassword, salt);

  // Create the user
  const user = await this.create({
    displayName,
    userName,
    email,
    password: passwordHash,
  });

  return user;
};

/* User Login */
userSchema.statics.login = async function (usernameOrEmail, decryptedPassword) {
  if (!usernameOrEmail || !decryptedPassword) {
    throw new Error("Please fill in all the fields");
  }

  const user = await this.findOne({
    $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(decryptedPassword, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      // Check if the password is already hashed
      // If it starts with '$2b$', it's likely a bcrypt hash
      if (this.password.startsWith('$2b$')) {
        // Do nothing if it's already hashed
        return next();
      }

      // Decrypt and hash if it's not hashed
      const decryptedPassword = decryptPassword(this.password);
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(decryptedPassword, salt);
    } catch (error) {
      return next(new Error("Failed to decrypt and hash password"));
    }
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    try {
      // Check if the password is already hashed
      if (update.password.startsWith('$2b$')) {
        // Do nothing if it's already hashed
        this.setUpdate({ ...update });
        return next();
      }

      // Decrypt and hash if it's not hashed
      const decryptedPassword = decryptPassword(update.password);
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(decryptedPassword, salt);

      this.setUpdate({ ...update, password: update.password });
    } catch (error) {
      return next(new Error("Failed to decrypt and hash password"));
    }
  }
  next();
});

export const User = mongoose.model("User", userSchema);
