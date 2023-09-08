import Modal from "react-bootstrap/Modal";
import { noop } from "bootstrap/js/src/util";
import { PersonFill, PersonFillGear } from "react-bootstrap-icons";
import { useAuth } from "./AuthProvider";
import Button from "react-bootstrap/Button";

const ChooseProfileModal = (props) => {
  const { show, handleClose, currentUser, onProfileChanged } = props;
  const { onLogout } = useAuth();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Wybierz użytkownika</Modal.Title>
      </Modal.Header>
      <Modal.Body className="choose-profile-modal-body">
        <Profile
          user="user"
          currentUser={currentUser}
          icon={
            <PersonFill
              size={35}
              style={{ cursor: "pointer" }}
              className="choose-profile-modal-profile"
              onClick={() => onProfileChanged("user")}
            ></PersonFill>
          }
        ></Profile>
        <Profile
          user="admin"
          currentUser={currentUser}
          icon={
            <PersonFillGear
              size={35}
              style={{ cursor: "pointer" }}
              className="choose-profile-modal-profile"
              onClick={() => onProfileChanged("admin")}
            ></PersonFillGear>
          }
        ></Profile>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onLogout}
          className="choose-profile-modal-button"
        >
          Wyloguj się
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

function Profile(props) {
  const { user, currentUser, icon } = props;
  return (
    <div>
      <div
        className="choose-profile-modal-profile-background"
        style={{ backgroundColor: user === currentUser ? "lightblue" : noop() }}
      >
        {icon}
      </div>
      <p className="choose-profile-modal-profile-name">{user}</p>
    </div>
  );
}

export default ChooseProfileModal;
