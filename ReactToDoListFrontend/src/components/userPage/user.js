import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import './user.css'
import axios from "axios";
import { useParams } from "react-router-dom";

const User = (props) => {
  const { id } = useParams();
  const [userDetails, updatedUserDetails] = useState({});
  const [isLoading, updateIsLoading] = useState(false);
  const [addNote, updatedAddNote] = useState({ data: "", imgURL: "", isCompleted: false, id: "" });
  const [stateIndex, updatedStateIndex] = useState(0);
  const [uniqueId, updatedUniqueId] = useState(0);
  const [type, updatedType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const fetchData = () => {
    updateIsLoading(true);
    let url = window.API_URL + `/user/${id}`;
    axios.get(url)
      .then((res) => {
        updateIsLoading(false);
        updatedUserDetails(res.data.data)
      })
      .catch((err) => {
        updateIsLoading(false);
        alert(err?.response?.data?.msg)
      });
  }

  const onChangeAddHandler = (event) => {
    const value = event.target.value;
    const updateAddNote = { data: value, imgURL: "", isCompleted: false, id: Date.now().toString() }
    updatedAddNote(updateAddNote);
  };

  const updateSubmitHandler = (event, key) => {
    event.preventDefault();

    updateIsLoading(true);
    const updatedUserDetails = { ...userDetails };

    if (key === "add") {
      updatedUserDetails.notes.push(addNote);
    }

    else if (key === "delete") {
      updatedUserDetails.notes.splice(stateIndex, 1);
    }

    const url = `${window.API_URL}/user/${id}`;
    axios.patch(url, updatedUserDetails)
      .then((res) => {
        updateIsLoading(false);
        if (res?.status === 200) {
          alert(res?.data?.msg)
          const updateAddNote = { data: "", imgURL: "", isCompleted: false, id: "" }
          updatedAddNote(updateAddNote);
          updatedType("")
          fetchData();
        }
        else {
          alert(res?.data?.msg)
        }
      })
      .catch((err) => {
        updateIsLoading(false);
        alert(err?.response?.data?.msg)
      });
  }

  const indexHandler = (event, id, type) => {
    event.preventDefault()
    const newUserDetails = { ...userDetails };
    const index = newUserDetails?.notes?.findIndex(val => val.id === id);
    updatedStateIndex(index);
    updatedUniqueId(id);
    updatedType(type);
    if (type === "completed") {
      newUserDetails.notes[index].isCompleted = !newUserDetails.notes[index].isCompleted;
      updatedUserDetails(newUserDetails);
      updateSubmitHandler(event, "completed")
    }
  }

  const onChangeEditHandler = (event) => {
    event.preventDefault();
    const newUserDetails = { ...userDetails };
    newUserDetails.notes[stateIndex].data = event.target.value;
    updatedUserDetails(newUserDetails);
  }

  const rerenderComponentOnChange = () => {
    fetchData();
  }

  const fileSubmitHandler = async (event) => {
    updateIsLoading(true);
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', selectedFile);

    const url = `${window.API_URL}/imageUpload`;
    axios.post(url, formData)
      .then((res) => {
        updateIsLoading(false);
        if (res?.status === 200) {
          setImageUrl(res?.data?.data?.imageUrl);
          alert(res?.data?.msg)
        }
        else {
          alert(res?.data?.msg)
        }
      })
      .catch((err) => {
        updateIsLoading(false);
        alert(err?.response?.data?.msg)
      });
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return <>
    <Navbar name={userDetails.name} rerenderComponentOnChange={rerenderComponentOnChange} />
    <h1 className="welcome-msg" >Hello {userDetails.name}! Add some new tasks today..</h1>

    {isLoading && <div className="loader-overlay"><div className="loader"></div></div>}

    <form className="addtodo" onSubmit={fileSubmitHandler}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>

    {imageUrl && (
      <div>
        <h3>Uploaded Image:</h3>
        <img src={imageUrl} alt="Uploaded" />
      </div>
    )}

    <form className="addtodo" onSubmit={(event) => updateSubmitHandler(event, "add")} >
      <div className="input-group mb-3">
        <input type="text" id="add" value={addNote.data} onChange={onChangeAddHandler} className="form-control" placeholder="Add notes here.." required />
        <button className="btn btn-outline-secondary" type="submit">Add</button>
      </div>
    </form>

    <form className="addtodo">
      {userDetails?.notes?.length === 0 && "No Notes Found"}
      {userDetails?.notes?.map((val, index) => <div key={val.id} className="input-group mb-3">

        {
          type === "edit" && val.id === uniqueId ?
            <input type="text" onChange={onChangeEditHandler} className="form-control" value={val.data} /> :
            <div className={val.isCompleted ? "completed-note" : ""}> {index + 1}. {val.data} </div>
        }

        <div>
          <button
            className="btn btn-outline-secondary"
            ata-bs-toggle="tooltip"
            data-bs-placement="top"
            onClick={type === "edit" && val.id === uniqueId ? (event) => updateSubmitHandler(event, "edit") : (event) => indexHandler(event, val.id, "edit")}
            title="Edit">
            {type === "edit" && val.id === uniqueId ? "Update" : <i className="fa fa-pencil-square-o" aria-hidden="true"></i>}
          </button>

          <button
            className="btn btn-outline-secondary"
            ata-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Delete"
            data-bs-toggle="modal"
            data-bs-target="#deleteNodeModal"
            onClick={(event) => indexHandler(event, val.id, "delete")}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </button>

          <button
            className="btn btn-outline-secondary"
            ata-bs-toggle="tooltip"
            data-bs-placement="top"
            onClick={(event) => indexHandler(event, val.id, "completed")}
            title="Done">
            {val.isCompleted ? <i className="fa fa-times" aria-hidden="true"></i> : <i className="fa fa-check-square-o" aria-hidden="true"></i>}
          </button>

        </div>
      </div>)}
    </form>

    <div className="modal fade" id="deleteNodeModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteModalLabel">Delete Note</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={(event) => updateSubmitHandler(event, "delete")}>
            <p>Are you sure you want to delete?</p>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
};

export default User;