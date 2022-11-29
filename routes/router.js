const express = require("express");
const router = express.Router();
const users = require("../models/userSchema");
const roles = require("../models/roleSchema");
const assignUsers = require("../models/assignUserScheme");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// router.get("/", (req, res) => {
//   console.log("connect");
// });

// add user
router.post("/addUser", async (req, res) => {
  // console.log(req.body);
  const { name, email, number, address } = req.body;

  if (!name || !email || !number || !address) {
    res.status(422).json("Please fill the data");
  }

  try {
    const preuser = await users.findOne({ email: email });
    console.log(preuser);

    if (preuser) {
      res.status(422).json({
        message: "This email is already used",
      });
    } else {
      const adduser = new users({
        name,
        email,
        number,
        address,
      });

      await adduser.save();
      res.status(201).json(adduser);
      console.log(adduser);
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

// get user
router.get("/getData", async (req, res) => {
  try {
    const userdata = await users.find();
    res.status(201).json(userdata);
    console.log("userdata", userdata);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get individual user
router.get("/getUser/:id", async (req, res) => {
  try {
    console.log("userdata", req.params);
    const { id } = req.params;

    const userIndividual = await users.findById({ _id: id });
    console.log("userIndividual", userIndividual);
    res.status(201).json(userIndividual);
  } catch (error) {
    res.status(422).json(error);
  }
});

// update user
router.patch("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await users.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated User", updatedUser);
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// delete user
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await users.findByIdAndDelete({ _id: id });

    console.log("updated User", deleteUser);
    res.status(201).json(deleteUser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// ------------------------------------

// add role
router.post("/addRole", async (req, res) => {
  const {
    roleName,
    role,
    permission,
    assignUser,
    // user,
    form,
    filter,
    sortable,
    // dashboard,
    slideshow,
  } = req.body;

  try {
    const preuser = await roles.findOne({ roleName: roleName });
    console.log(preuser);

    if (preuser) {
      res.status(422).json({
        message: "This role already exist",
      });
    } else {
      const addrole = new roles({
        roleName,
        role,
        permission,
        assignUser,
        // user,
        form,
        filter,
        sortable,
        // dashboard,
        slideshow,
      });

      await addrole.save();
      res.status(201).json(addrole);
      console.log(addrole);
    }
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

// get role
router.get("/getRoleData", async (req, res) => {
  try {
    const roledata = await roles.find();
    res.status(201).json(roledata);
    console.log("roledata", roledata);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get individual role
router.get("/getRole/:id", async (req, res) => {
  try {
    console.log("roledata", req.params);
    const { id } = req.params;

    const roleIndividual = await roles.findById({ _id: id });
    console.log("roleIndividual", roleIndividual);
    res.status(201).json(roleIndividual);
  } catch (error) {
    res.status(422).json(error);
  }
});

// update role
router.patch("/updateRole/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRole = await roles.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated User", updatedRole);
    res.status(201).json(updatedRole);
  } catch (error) {
    res.status(422).json(error);
  }
});

// delete role
router.delete("/deleteRole/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRole = await roles.findByIdAndDelete({ _id: id });

    console.log("updated role", deleteRole);
    res.status(201).json(deleteRole);
  } catch (error) {
    res.status(422).json(error);
  }
});

// -------------------------------

// add assign user
router.post("/addAssignUser", (req, res, next) => {
  // console.log(req.body);
  // const { name, email, password, roleName } = req.body;

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(422).json({
        message: err,
      });
    } else {
      const adduser = new assignUsers({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        roleName: req.body.roleName,
      });

      adduser
        .save()
        .then((result) => {
          res.status(201).json({
            new_user: result,
          });
        })
        .catch((err) => {
          res.status(422).json({
            message: err,
          });
        });
    }
  });
});

// get assign user
router.get("/getAssignUserData", async (req, res) => {
  try {
    const userdata = await assignUsers.find();
    res.status(201).json({
      users: userdata,
    });
    console.log("userdata", userdata);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get individual assign user
router.get("/getAssignUser/:id", async (req, res) => {
  try {
    console.log("userdata", req.params);
    const { id } = req.params;

    const userIndividual = await assignUsers.findById({ _id: id });
    console.log("userIndividual", userIndividual);
    res.status(201).json(userIndividual);
  } catch (error) {
    res.status(422).json(error);
  }
});

// update assign user
router.patch("/updateAssignUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await assignUsers.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated User", updatedUser);
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// delete assign user
router.delete("/deleteAssignUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await assignUsers.findByIdAndDelete({ _id: id });

    console.log("updated User", deleteUser);
    res.status(201).json(deleteUser);
  } catch (error) {
    res.status(422).json(error);
  }
});

// ---------------------------

// login

router.post("/login", (req, res, next) => {
  assignUsers
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
