import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { Delete, Edit, Visibility, Group, Logout, Menu } from "@mui/icons-material";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [showDetailsOpen, setShowDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    section: "",
    rollNumber: "",
    age: "",
    gender: "",
    parentName: "",
    address: "",
    phone: "",
    email: "",
    dob: "",
    enrollmentDate: "",
  });
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      setStudents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleAddStudent = async () => {
    if (!auth.currentUser) return;

    try {
      const newStudentWithOwner = {
        ...newStudent,
        ownerId: auth.currentUser?.uid,
      };
      await addDoc(collection(db, "students"), newStudentWithOwner);
      fetchStudents();
      setNewStudent({
        name: "",
        class: "",
        section: "",
        rollNumber: "",
        age: "",
        gender: "",
        parentName: "",
        address: "",
        phone: "",
        email: "",
        dob: "",
        enrollmentDate: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleEditStudent = async () => {
    if (!auth.currentUser) return;

    try {
      const studentRef = doc(db, "students", selectedStudentId);
      await updateDoc(studentRef, newStudent);
      fetchStudents();
      setIsEditMode(false);
      setOpen(false);
      setSelectedStudentId(null);
    } catch (error) {
      console.error("Error editing student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, "students", id));
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleEditClick = (student) => {
    setNewStudent(student);
    setSelectedStudentId(student.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleAddClick = () => {
    setNewStudent({
      name: "",
      class: "",
      section: "",
      rollNumber: "",
      age: "",
      gender: "",
      parentName: "",
      address: "",
      phone: "",
      email: "",
      dob: "",
      enrollmentDate: "",
    });
    setIsEditMode(false);
    setOpen(true);
  };

  const handleShowDetails = (student) => {
    setSelectedStudentDetails(student);
    setShowDetailsOpen(true);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  useEffect(() => {
    fetchStudents();
  }, []);


  return (
    <Box display="flex">
      {/* Sidebar */}
      <Drawer
       variant={isLargeScreen ? "permanent" : "temporary"}
       anchor="left"
       open={isLargeScreen || drawerOpen}
       onClose={toggleDrawer}
       sx={{
         width: isLargeScreen ? "20%" : "250px",
         flexShrink: 0,
         "& .MuiDrawer-paper": {
           width: isLargeScreen ? "20%" : "250px",
           boxSizing: "border-box",
         },
       }}
      >
        <List>
          <ListItem button onClick={() => navigate("/students")}>
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1} p={4}
       sx={{
         width: isLargeScreen ? "80%" : "100%",
         overflow: "auto",
       }}
       >
        {/* Menu Button for Small Screens */}
        {!isLargeScreen && (
          <IconButton onClick={toggleDrawer} sx={{ mb: 2 }}>
            <Menu />
          </IconButton>
        )}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <h2>Students</h2>
          <Button variant="contained" onClick={handleAddClick}>
            Add Student
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleShowDetails(student)}>
                      <Visibility />
                    </IconButton>
                    {student.ownerId === auth.currentUser?.uid && (
                      <>
                        <IconButton onClick={() => handleEditClick(student)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteStudent(student.id)}>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Student Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{isEditMode ? "Edit Student" : "Add Student"}</DialogTitle>
          <DialogContent>
            <form>
              {Object.keys(newStudent).map((key) => (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newStudent[key]}
                  onChange={(e) => setNewStudent({ ...newStudent, [key]: e.target.value })}
                  required
                />
              ))}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={isEditMode ? handleEditStudent : handleAddStudent}
            >
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Show Student Details Dialog */}
        <Dialog
          open={showDetailsOpen}
          onClose={() => setShowDetailsOpen(false)}
          PaperProps={{
            sx: {
              width: isLargeScreen ? "80%" : "90%",
              maxWidth: "none",
            },
          }}
        >
          <DialogTitle>Student Details</DialogTitle>
          <DialogContent>
            {selectedStudentDetails && (
              <Box>
                {Object.keys(selectedStudentDetails).map(
                  (key) =>
                    key !== "id" && (
                      <TextField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedStudentDetails[key]}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    )
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Students;
