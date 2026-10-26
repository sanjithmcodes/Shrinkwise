import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FaEdit } from 'react-icons/fa';
import LossEventForm from '../LossEventForm';

function EditModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSaved(updatedLossEvent) {
    props.setPosts(prev => prev.map(e => e._id === updatedLossEvent._id ? updatedLossEvent : e))
    console.log('Loss event updated')
    handleClose()
  }

  return (
    <>
      <button className='tw-border-none tw-bg-transparent' onClick={handleShow}>
        <FaEdit size='25' color='gray' />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton />

        <Modal.Body>
          <LossEventForm lossEvent={props.lossEvent} onSaved={handleSaved} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditModal;
