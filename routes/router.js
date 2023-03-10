const express = require("express");
const router = express.Router();
const notes = require("../models/noteSchema");
const roles = require("../models/roleSchema");
const user = require("../models/userSchema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const upload = require("../multerconfig/storageConfig");

// add note ---------------------------
router.post("/addNote", async (req, res) => {
  const { title, description, noteStatus } = req.body;

  try {
    // let pending = "";
    // if (noteStatus === "0") {
    //   pending = "Pending";
    // }
    // let success = "";
    // if (noteStatus === "1") {
    //   success = "Success";
    // }
    // let failed = "";
    // if (noteStatus === "2") {
    //   failed = "Failed";
    // }
    const addnote = new notes({
      title,
      description,
      // noteStatus: pending ? pending : success ? success : failed,
      noteStatus,
    });

    await addnote.save();
    res.status(201).json({
      StatusCode: 200,
      Message: "success",
    });
    console.log(addnote);
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get note ---------------------------
router.get("/getNoteData", async (req, res) => {
  try {
    const { noteStatus } = req.query;

    const queryObject = {};

    // const noteStat = ["Pending", "Success", "Failed"];

    if (noteStatus) {
      // queryObject.noteStatus = noteStat[noteStatus];
      queryObject.noteStatus = noteStatus;
    }

    const notedata = await notes.find(queryObject);
    res.status(201).json({
      NoteData: notedata.length <= 0 ? null : notedata,
      StatusCode: 200,
      Message: "success",
    });
    console.log("notedata", notedata);
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get individual note ---------------------------
router.get("/getNote/:id", async (req, res) => {
  try {
    console.log("notedata", req.params);
    const { id } = req.params;

    const noteIndividual = await notes.findById({ _id: id });
    console.log("noteIndividual", noteIndividual);
    res.status(201).json({
      NoteList: [noteIndividual],
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// update note ---------------------------
router.patch("/updateNote/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNote = await notes.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated Note", updatedNote);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// delete note ---------------------------
router.delete("/deleteNote/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteNote = await notes.findByIdAndDelete({ _id: id });

    console.log("deleted Note", deleteNote);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// ------------------------------------

// add role ---------------------------
router.post("/addRole", async (req, res) => {
  const {
    roleName,
    role,
    permission,
    user,
    form,
    filter,
    sortable,
    slideshow,
  } = req.body;

  try {
    const preuser = await roles.findOne({ roleName: roleName });
    console.log(preuser);

    if (preuser) {
      res.status(422).json({
        Message: "This role already exist",
      });
    } else {
      const addrole = new roles({
        roleName,
        role,
        permission,
        user,
        form,
        filter,
        sortable,
        slideshow,
      });

      await addrole.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
      console.log(addrole);
    }
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get role ---------------------------
router.get("/getRoleData", async (req, res) => {
  try {
    const roledata = await roles.find();
    res.status(201).json({
      RoleData: roledata.length <= 0 ? null : roledata,
      StatusCode: 200,
      Message: "success",
    });
    console.log("roledata", roledata);
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get individual role ---------------------------
router.get("/getRole/:id", async (req, res) => {
  try {
    console.log("roledata", req.params);
    const { id } = req.params;

    const roleIndividual = await roles.findById({ _id: id });
    console.log("roleIndividual", roleIndividual);
    res.status(201).json({
      RoleList: [roleIndividual],
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// update role ---------------------------
router.patch("/updateRole/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRole = await roles.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated User", updatedRole);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// delete role ---------------------------
router.delete("/deleteRole/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRole = await roles.findByIdAndDelete({ _id: id });

    console.log("updated role", deleteRole);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// -------------------------------

// add user ---------------------------
router.post("/addUser", async (req, res) => {
  try {
    let preuser = await user.findOne({ email: req.body.email });

    if (preuser) {
      return res.status(422).json({
        Message: "This email already exist",
      });
    }

    // const file = req.file.filename;

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    const adduser = new user({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      roleName: req.body.roleName,
      // image: file,
    });

    await adduser.save();
    res.status(201).json({
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get user ---------------------------
router.get("/getUserData", async (req, res) => {
  try {
    const userdata = await user.find();
    res.status(201).json({
      UserData: userdata.length <= 0 ? null : userdata,
      StatusCode: 200,
      Message: "success",
    });
    console.log("userdata", userdata);
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get individual user ---------------------------
router.get("/getUser/:id", async (req, res) => {
  try {
    console.log("userdata", req.params);
    const { id } = req.params;

    const userIndividual = await user.findById({ _id: id });
    console.log("userIndividual", userIndividual);
    res.status(201).json({
      UserList: [userIndividual],
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// update user ---------------------------
router.patch("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await user.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated User", updatedUser);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// delete user ---------------------------
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await user.findByIdAndDelete({ _id: id });

    console.log("updated User", deleteUser);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// ---------------------------

// login

router.post("/login", (req, res, next) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(422).json({
          message: "User doesn't exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(422).json({
            message: "Password doesn't match",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: user[0].name,
              email: user[0].email,
              roleName: user[0].roleName,
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          res.status(201).json({
            name: user[0].name,
            email: user[0].email,
            roleName: user[0].roleName,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(422).json({
        message: err,
      });
    });
});

module.exports = router;
