import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Box from "@mui/material/Box";
import axios from "axios";
import { Button, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import moment from "moment";

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

const User = (props) => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(!!props?.data ? props.data : {});
  const [open, setOpen] = React.useState(false);
  const [select,setSelect] = React.useState(null)
  const [seletedcell,setSelectedcell] = React.useState(null)
  const [trigger,setTrigger] = React.useState(false)

  const handleOpen = (params) => {
    console.log(params)
    setSelectedcell(params.row)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    let obj = {_id:seletedcell._id,status:select,assigned_user:seletedcell.assigned_user}
    axios.put("http://localhost:3000/api/updatetask",obj)
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
    setTimeout(()=>{setTrigger(!trigger)},2000)
  };
  
  const handleChange = (event) => {
    setSelect(event.target.value);
  };

  const renderStatus = () =>{
    return(<React.Fragment>
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

            <Button onClick={handleClose}>Update</Button>
          </Box>
        </Modal>
      </React.Fragment>)
  }
  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
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
      renderCell:()=>{return `You (${props?.data?.username})`}
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
          
        </div>
      ),
    }
  ];
  useEffect(() => {
    setUserData(
      !!localStorage.getItem("token")
        ? jwtDecode(localStorage.getItem("token"))
        : null
    );
    axios
      .post("http://localhost:3000/api/getUserDetails", {
        userId: props?.data?._id,
      })
      .then((res) => {
        console.log(res);
        setData(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [trigger]);
  const handlePageChange = () =>{
    
  }
  console.log(data,"data 0")
  return (
    <div>
      <Box sx={{ height: 400, width: "70%",marginTop:"10px",marginLeft:"10px" }}>
        <DataGrid
         rows={!!data.Tasks ? data?.Tasks : []}
          columns={columns}
          getRowId={(row)=>row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          checkboxSelection={false}
          pageSizeOptions={[5]}
          onPaginationModelChange={handlePageChange}
          disableRowSelectionOnClick
        />
      </Box>
      {renderStatus()}
    </div>
  );
};

export default User;
