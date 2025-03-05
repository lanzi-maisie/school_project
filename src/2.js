// school_project/server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/school_project', { useNewUrlParser: true });

// Define a schema for the students collection
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  courses: [String]
});

// Create a model from the schema
const Student = mongoose.model('Student', studentSchema);

// Define a route for retrieving students
app.get('/students', (req, res) => {
  // Retrieve all students from the database and return them in JSON format
  Student.find((err, students) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'Something went wrong!' });
    } else {
      res.json(students);
    }
  });
});

// Define a route for adding a new student
app.post('/students', (req, res) => {
  // Create a new instance of the Student model with data from the request body
  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    courses: req.body.courses
  });

  // Save the student to the database and return it in JSON format
  student.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'Something went wrong!' });
    } else {
      res.json(student);
    }
  });
});

// Define a route for updating a student's courses
app.put('/students/:id', (req, res) => {
  // Find the student with the specified ID and update their courses with the data from the request body
  Student.findByIdAndUpdate(req.params.id, { $set: { courses: req.body.courses } }, { new: true }, (err, student) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'Something went wrong!' });
    } else {
      res.json(student);
    }
  });
});

// Define a route for deleting a student
app.delete('/students/:id', (req, res) => {
  // Find the student with the specified ID and delete it from the database
  Student.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: 'Something went wrong!' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
