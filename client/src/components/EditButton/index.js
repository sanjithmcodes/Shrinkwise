import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FiEdit2 } from 'react-icons/fi';
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
      <button className='sw-icon-btn' onClick={handleShow} aria-label='Edit loss' title='Edit loss'>
        <FiEdit2 size='20' />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
      >
        <Modal.Header closeButton />

        <Modal.Body className="pt-0 px-4 pb-4">
          <LossEventForm lossEvent={props.lossEvent} onSaved={handleSaved} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditModal;
