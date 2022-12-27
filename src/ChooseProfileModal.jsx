import Modal from "react-bootstrap/Modal";
import { noop } from "bootstrap/js/src/util";

const ChooseProfileModal = (props) => {
  const { show, handleClose, currentUser, onProfileChanged } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Wybierz użytkownika</Modal.Title>
      </Modal.Header>
      <Modal.Body className="choose-profile-modal-body">
        <Profile
          user="user"
          currentUser={currentUser}
          onProfileChanged={onProfileChanged}
        ></Profile>
        <Profile
          user="admin"
          currentUser={currentUser}
          onProfileChanged={onProfileChanged}
        ></Profile>
      </Modal.Body>
      <Modal.Footer>footer</Modal.Footer>
    </Modal>
  );
};

function Profile(props) {
  const { user, currentUser, onProfileChanged } = props;
  return (
    <div>
      <div
        className="choose-profile-modal-profile-background"
        style={{ backgroundColor: user === currentUser ? "blue" : noop() }}
      >
        <div
          className="choose-profile-modal-profile"
          onClick={() => onProfileChanged(user)}
        ></div>
      </div>
      <span>{user}</span>
    </div>
  );
}

export default ChooseProfileModal;
