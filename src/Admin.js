import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Modal from "@mui/material/Modal";
import moment from "moment";
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Admin = (props) => {
  const [ticketdata, setTicketData] = React.useState([]);
  const [limit, setLimit] = React.useState(6);
  const [select,setSelect] = React.useState(null)
  const [seletedcell,setSelectedcell] = React.useState(null)
  const [trigger,setTrigger] = React.useState(false)
  const [users,setUsers] = React.useState([])
  const [assign,setAssign] = React.useState(null)
  const [taskModal,setTaskModal] = React.useState(false)
  const [taskname,setTaskname] = React.useState('')
  const [taskdetails,setTaskdetails] = React.useState('')
  const [priority,setPriority] = React.useState('')
  const [page,setPage] = React.useState(1)

  const [open, setOpen] = React.useState(false);
  const handleOpen = (params) => {
    console.log(params)
    setSelectedcell(params.row)
    setOpen(true);
  };
  console.log(seletedcell,"sel")
  const handleClose = () => {
    setOpen(false);
    let obj = {_id:seletedcell._id,status:select,assigned_user:seletedcell.assigned_user,assigned_user:assign}
    axios.put("https://tensys-task-backend.onrender.com/api/updatetask",obj)
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
    setTrigger(!trigger)
  };

  const handleCloseTask = () => {
    setTaskModal(false);
    
  };

  const handleDeleteTask = (params) =>{
    let obj = {_id:params._id}
    axios.delete(`https://tensys-task-backend.onrender.com/api/deletetask?_id=${params._id}`,obj)
    .then((res)=>{
        console.log(res)
        setTrigger(!trigger)
    })
    .catch((err)=>{
        console.log(err)
    })
  }

  const columns = [
    { field: "_id", headerName: "ID", width: 190 },
    {
      field: "createdBy",
      headerName: "Createdby",
      width: 150,
      editable: true,
    },
    {
      field: "assigned_username",
      headerName: "Assigned To",
      width: 150,
      editable: true,
      renderCell:(params) =>{return users.map((ele) =>{ if(ele._id === params?.row?.assigned_user){return ele.username} })}
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueFormatter: (params) =>
        moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 110,
      editable: true,
    },
    {
      headerName: "Actions",
      width: 610,
      editable: true,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleOpen(params);
            }}
          >
            Update Status
          </Button>
          <Button variant="contained" onClick={()=>{handleDeleteTask(params.row)}} sx={{backgroundColor:"red"}}>Delete</Button>
        </div>
      ),
    },
  ];

  const handleChange = (event) => {
    setSelect(event.target.value);
  };
  const handleChangeAssignee = (event) => {
    setAssign(event.target.value);
    console.log(event)
  };
  const handlePriority = (event) => {
    setPriority(event.target.value);
  };

  const StatusModal = () => {
    return (
      <React.Fragment>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 200 }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={select}
              label="Status"
              placeholder="Status"
              onChange={handleChange}
            >
              <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"in progress"}>In Progress</MenuItem>
            </Select><br/>
            <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="assigne"
              value={assign}
              label="Assigne"
              placeholder="Assigne"
              onChange={handleChangeAssignee}
            >
                {users.map((ele)=>{
                    return <MenuItem value={ele._id}>{ele.username}</MenuItem>
                })}
              {/* <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"in progress"}>In Progress</MenuItem> */}
            </Select><br/>

            <Button onClick={handleClose}>Update</Button>
          </Box>
        </Modal>
      </React.Fragment>
    );
  };

const handletask = (e) =>{
    if(e.target.name === "taskname"){
        setTaskname(e.target.value)
    }
    if(e.target.name === "details"){
        setTaskdetails(e.target.value)
    }
}
const handleCreateTask = () =>{
    let obj = {taskName:taskname,details:taskdetails,assigned_user:assign,status:select,priority,userId:props?.data?._id}
    axios.post("https://tensys-task-backend.onrender.com/api/createtask",obj)
    .then((res)=>{console.log(res)})
    .catch((err)=>{console.log(err)})
}

  const createtaskModal = () => {
    return (
      <React.Fragment>
        <Modal
          open={taskModal}
          onClose={handleCloseTask}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 200 }}>
          <TextField id="outlined-basic" value={taskname} label="taskname" onChange={(e)=>{handletask(e)}} name="taskname" variant="outlined" />
          <TextField id="outlined-basic"  value={taskdetails}label="details" onChange={(e)=>{handletask(e)}} name="details" variant="outlined" />
          <InputLabel id="demo-simple-select-label">User</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="assigne"
              value={assign}
              label="Assigne"
              placeholder="Assigne"
              onChange={handleChangeAssignee}
            >
                {users.map((ele)=>{
                    return <MenuItem value={ele._id}>{ele.username}</MenuItem>
                })}
              {/* <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"in progress"}>In Progress</MenuItem> */}
            </Select><br/>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={select}
              label="Status"
              placeholder="Status"
              onChange={handleChange}
            >
              <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"in progress"}>In Progress</MenuItem>
            </Select><br/>
            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={priority}
              label="Status"
              placeholder="Status"
              onChange={handlePriority}
            >
              <MenuItem value={"high"}>High</MenuItem>
              <MenuItem value={"Medium"}>Medium</MenuItem>
              <MenuItem value={"Low"}>Low</MenuItem>
            </Select><br/>
            <Button onClick={handleCreateTask}>create Task</Button>
          </Box>
        </Modal>
      </React.Fragment>
    );
  };

  const openTaskModal = () =>{
    setTaskModal(!taskModal)
  }

  React.useEffect(() => {
    axios
      .get(`https://tensys-task-backend.onrender.com/api/tasks?limit=${limit}`)
      .then((res) => {
        console.log(res.data);
        setTicketData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get('https://tensys-task-backend.onrender.com/api/getall')
    .then((res)=>{
        setUsers(res.data)
    })
    .catch((err)=>{
        console.log(err)
    })
  }, [trigger]);

  const handlePageChange = () =>{
    setPage(page + 1)
    setLimit(limit + 3)
    setTrigger(!trigger)
  }

  return (
    <div>
      <Box
        sx={{
          height: 400,
          width: "70%",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        <DataGrid
          rows={ticketdata}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
                page:page
              },
            },
          }}
          pageSizeOptions={[5,10]}
          checkboxSelection={false}
          getRowId={((rows) => rows._id)}
          onPaginationModelChange={handlePageChange}
          pagination
          page={page}
          disableRowSelectionOnClick
        />
      </Box>
      {StatusModal()}
      {createtaskModal()}
      <br/>
      <br/>
      <div>
      <Button variant="contained" onClick={()=>{openTaskModal()}}>Create Task</Button>
      </div>
    </div>
  );
};

export default Admin;
