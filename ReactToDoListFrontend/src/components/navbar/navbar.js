import { useNavigate, useParams } from "react-router-dom";
import "./navbar.css"
import axios from "axios";
import { useEffect, useState } from "react";

const Navbar = (props) => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, updatePayload] = useState({ name: "", password: "" });
  const [isPasswordShown, updateIsPasswordShown] = useState(false);
  const [isLoading, updateIsLoading] = useState(false);

  const logoutHandler = () => {
    sessionStorage.clear();
    navigate('/')
  }

  const updateSubmitHandler = (event) => {
    event.preventDefault();
    updateIsLoading(true);
    const url = `${window.API_URL}/user/${id}`;
    axios.patch(url, payload)
      .then((res) => {
        updateIsLoading(false);
        if (res?.status === 200) {
          alert(res?.data?.msg)
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

  const fetchData = () => {
    updateIsLoading(true);
    let url = window.API_URL + `/user/${id}`;
    axios.get(url)
      .then((res) => {
        updateIsLoading(false);
        updatePayload(res.data.data)
        sessionStorage.setItem("name", res.data.data.name)
      })
      .catch((err) => {
        updateIsLoading(false);
        alert(err?.response?.data?.msg)
      });
  }

  const onChangeHandler = (event) => {
    let id = event?.target?.id;
    let value = event?.target?.value;
    let updatedPayload = { ...payload };

    updatedPayload[id] = value;
    updatePayload(updatedPayload)
  }

  const passwordShownHandler = (event) => {
    let checked = event?.target?.checked;
    updateIsPasswordShown(checked);
  }

  const deleteUserHandler = (event) => {
    updateIsLoading(true);
    event.preventDefault();
    let url = window.API_URL + `/user/${id}`;
    axios.patch(url, { "type": "delete" })
      .then((res) => {
        updateIsLoading(false);
        alert(res.data.msg);
        sessionStorage.clear();
        navigate('/');
      })
      .catch((err) => {
        updateIsLoading(false);
        alert(err?.response?.data?.msg)
      });
  }

  useEffect(() => {
    props.rerenderComponentOnChange();
  },[sessionStorage.name])

  return <>
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Todo List</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <p className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Profile
              </p>
              <ul className="dropdown-menu">
                <li><p className="dropdown-item" onClick={fetchData} data-bs-toggle="modal" data-bs-target="#editModal">Edit</p></li>
                <li><p className="dropdown-item" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</p></li>
              </ul>
            </li>
            {props?.name && <li className="nav-item">
              <p className="nav-link logout" onClick={logoutHandler}>Logout</p>
            </li>
            }
          </ul>
        </div>
      </div>
    </nav>

    <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="editModalLabel">Edit Profile</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={updateSubmitHandler}>
            <div className="modal-body">
              {isLoading && <div className="loader-overlay"><div className="loader"></div></div>}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  className="form-control"
                  id="name"
                  onChange={onChangeHandler}
                  value={payload?.name}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  autoComplete="off"
                  type={isPasswordShown ? "text" : "password"}
                  className="form-control"
                  id="password"
                  onChange={onChangeHandler}
                  value={payload?.password}
                />
                <input
                  autoComplete="off" type="checkbox" checked={isPasswordShown} onChange={passwordShownHandler} /> Show Password
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteModalLabel">Delete Profile</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={deleteUserHandler}>
            <p>Are you sure you want to d2elete?</p>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
}

export default Navbar;