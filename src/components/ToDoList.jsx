import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Typography,
  Box,
  Fab,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [taskInput, setTaskInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    console.log("Initial tasks:", storedTasks);
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Updated tasks:", tasks);
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (tabValue === 1) return task.completed;
    if (tabValue === 2) return !task.completed;
    return true; // All
  });

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      const newTask = { id: Date.now(), text: taskInput, completed: false };
      setTasks([...tasks, newTask]);
      setTaskInput("");
      setOpenDialog(false);
    } else {
      setOpen(true);
    }
  };

  const handleRemoveTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggleCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTaskInput(""); // Empty the input field when the dialog is closed
  };

  return (
    <Container maxWidth="sm" style={{ minHeight: "95vh" }}>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20, fontSize: 25 }}
        onClick={() => setOpenDialog(true)}
      >
        +
      </Fab>
      <Typography variant="h6" align="center" gutterBottom marginTop={3} letterSpacing={1} fontWeight={800} color={"primary"}>
        TO-DO LIST
      </Typography>
      <Tabs
        value={tabValue}
        centered
        onChange={(e, newValue) => setTabValue(newValue)}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <Tab label="All" />
        <Tab label="Completed" />
        <Tab label="Active" />
      </Tabs>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mt={4}
      >
        {filteredTasks.length === 0 ? (
          <Box
            width={250}
            minHeight={"80vh"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <img src="na.svg" alt="No tasks" style={{ maxWidth: "100%" }} />
            <Typography
              variant="body1"
              color="textSecondary"
              mt={2}
              textTransform={"uppercase"}
              letterSpacing={2}
            >
              No tasks available
            </Typography>
          </Box>
        ) : (
          <List style={{ width: "100%" }}>
            {filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                style={{
                  background: "#fff6f1",
                  borderRadius: "5px",
                  marginBlockEnd: "10px",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleCompletion(task.id)}
                    />
                  }
                  label={<ListItemText primary={task.text} />}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    color="primary"
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveTask(task.id)}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Task name cannot be empty!
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Todo"
            type="text"
            fullWidth
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ToDoList;
